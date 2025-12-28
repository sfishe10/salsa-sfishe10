import {MemberRepository} from "../repositories/member.repository";
import {Member} from "../entities/member.entity";
import {MemberDto} from "../dto/member.dto";
import {toMemberDto} from "../mappers/member.mapper";
import {UserService} from "./user.service";
import {SectionService} from "./section.service";
import {AttendanceService} from "./attendance.service";
import {User} from "../entities/user.entity";
import {Term} from "../entities/term.entity";
import {Section} from "../entities/section.entity";
import {PepBand} from "../entities/pep-band.entity";
import {Utilities} from "../utilities/utilities";
import {Constants} from "../utilities/constants";
import {InvalidEmailsError} from "../errors/invalid-emails-error";
import {InvalidSectionsError} from "../errors/invalid-sections-error";
import {NotFoundError} from "../errors/not-found-error";

export class MemberService {
    private memberRepository: MemberRepository;
    private attendanceService: AttendanceService;
    private userService: UserService;
    private sectionService: SectionService;

    constructor(memberRepository?: MemberRepository,
                attendanceService?: AttendanceService,
                userService?: UserService,
                sectionService?: SectionService) {
        this.memberRepository = memberRepository ?? new MemberRepository();
        this.attendanceService = attendanceService ?? new AttendanceService();
        this.userService = userService ?? new UserService();
        this.sectionService = sectionService ?? new SectionService();
    }

    public async getById(memberId: number): Promise<Member> {
        const member: Member | null =
            await this.memberRepository.findById(memberId);

        if (!member) {
            throw new NotFoundError('Member not found');
        }

        member.attendances = await this.attendanceService.getByMemberId(memberId);

        console.log(member);
        return member;
    }

    public async getMemberForCurrentTerm(email: string): Promise<Member | null> {
        const members: Member[] =
            await this.memberRepository.findByEmailForCurrentTerm(email);

        // technically there can be multiple members for a given email in a term, if they are in multiple sections
        // but this is a rare case so just return the first thing that comes up
        return members.length ? members[0]! : null;
    }

    public async getBySectionAndTermId(sectionId: number, termId: number): Promise<MemberDto[]> {
        const members: Member[] =
            await this.memberRepository.findBySectionAndTermId(sectionId, termId);

        const memberDtos: MemberDto[] = members.map(member => toMemberDto(member));

        return memberDtos;
    }

    public async getByTermId(termId: number): Promise<Member[]> {
        const members: Member[] =
            await this.memberRepository.findByTermId(termId);

        return members;
    }

    public async getByTermAndPepBandId(termId: number, pepBandId: string): Promise<Member[]> {
        const members: Member[] =
            await this.memberRepository.findByTermAndPepBandId(termId, pepBandId);

        return members;
    }

    // TODO: redo this to take a MemberDto
    public async create(memberDto: MemberDto): Promise<Member> {
        let newMember: Member = new Member();

        newMember.rehearsalConflict = memberDto.rehearsalConflict;

        // since we're using a lot of relations here, skip fetching the entire objects
        // TypeOrm just needs the primary keys (the ID's) to link these tables when we save in the repository
        newMember.user = { email: memberDto.user.email } as User;
        newMember.pepBand = memberDto.pepBand ? { bandId: memberDto.pepBand.bandId } as PepBand : null;
        newMember.term = { termId: memberDto.term.termId } as Term;
        newMember.section = { sectionId: memberDto.section.sectionId } as Section;

        newMember = await this.memberRepository.save(newMember);

        // create EventAttendances for all events for this term
        await this.attendanceService.createAttendancesForMember(newMember);

        return newMember;
    }

    public async update(memberDto: MemberDto): Promise<Member> {
        const memberId: number = memberDto.memberId;
        let newMember: Member = await this.getById(memberId);

        newMember.rehearsalConflict = memberDto.rehearsalConflict;

        // since we're using a lot of relations here, skip fetching the entire object
        // TypeOrm just needs the primary keys (the ID's) to link these tables when we save in the repository
        newMember.user = { userId: memberDto.user.userId } as User;
        newMember.term = { termId: memberDto.term.termId } as Term;
        newMember.section = { sectionId: memberDto.section.sectionId } as Section;

        const oldPepBandId: string | null = newMember.pepBand ? newMember.pepBand.bandId : null;
        const newPepBandId: string | null = memberDto.pepBand ? memberDto.pepBand.bandId : null;

        newMember.pepBand = { bandId: newPepBandId } as PepBand;

        newMember = await this.memberRepository.save(newMember);

        if (oldPepBandId && oldPepBandId != newPepBandId) {
            // delete empty attendances, change non-empty ones to non-required
            await this.attendanceService.deleteEmptyAttendancesForMember(memberId)
            await this.attendanceService.changePepAttendancesToNotRequired(memberId);
        }

        if (newPepBandId && oldPepBandId != newPepBandId) {
            // assign new attendances
            await this.attendanceService.createAttendancesForMember(newMember);
        }

        newMember.attendances = await this.attendanceService.getByMemberId(memberId);

        return newMember;
    }

    public async delete(memberId: number) {
        // delete all EventAttendances associated with member
        await this.attendanceService.deleteAttendancesForMember(memberId);

        await this.memberRepository.delete(memberId);
    }

    public async parseCsvAndCreateMembers(file: any, termId: number) {
        const rows: Array<Record<string, string>> = await Utilities.parseCsv(file);

        const term: Term = { termId } as Term;

        // check all values of the Section column to make sure they match an existing Section
        const sections: Section[] = await this.sectionService.getAll();
        const sectionMap = new Map<string, Section>(
            sections.map(s => [s.name.trim().toLowerCase(), s])
        );

        const invalidSections: Set<string> = new Set(rows
            .map(row => row.Section?.trim().toLowerCase())
            .filter((s): s is string => !!s)
            .filter(sectionName => !(sectionMap.has(sectionName))));

        if (invalidSections.size) {
            // return any invalid sections to the frontend
            throw new InvalidSectionsError([...invalidSections]);
        }

        // collect User and Member objects to insert once all parsing is done
        const users: User[] = [];
        const members: Member[] = [];

        for (const row of rows) {
            // TODO: extract these column names out as constants
            const officialLastName = row['Official Last']?.trim() ?? '';
            const officialFirstName = row['Official First']?.trim() ?? '';
            const preferredLastName = row['Preferred Last']?.trim() ?? '';
            const preferredFirstName = row['Preferred First']?.trim() ?? '';
            // for extended ed students without a CP email, use their preferred email for now -
            // they will not be needing to log in, so it won't cause problems
            const email = row.Email!.trim() !== 'anonymous' ? row.Email!.trim() : row['Preferred Email']!.trim();

            const lastName = preferredLastName === '0' ? officialLastName : preferredLastName;
            const firstName = preferredFirstName === '0' ? officialFirstName : preferredFirstName;

            const sectionName = row.Section?.trim().toLowerCase() ?? '';
            // ! = non-null assertion, since we already checked for invalid section names
            const section: Section = sectionMap.get(sectionName)!;

            let user: User | null = await this.userService.getByEmail(email);
            if (user && user.role != Constants.ROLE_ADMIN && user.role != Constants.ROLE_OFFICER) {
                // reset everyone's role, unless they're an admin/officer - in case the logged-in user is an admin/officer,
                // we don't want it to change their access level during the session
                user.role = Constants.ROLE_MEMBER;
                users.push(user);
            } else if (!user) {
                user = new User();
                user.firstName = firstName;
                user.lastName = lastName;
                user.email = email;
                user.role = Constants.ROLE_MEMBER;
                users.push(user);
            }

            const member: Member = new Member();
            member.user = user;
            member.section = section;
            member.term = term;
            member.pepBand = null;
            member.rehearsalConflict = null;
            members.push(member);
        }

        // insert users if they don't exist
        await this.userService.insertOrUpdate(users);

        // insert members
        await this.memberRepository.insertOrIgnore(members);

        // assign members to events for that term
        await this.attendanceService.createAttendancesForWholeTerm(termId);

    }

    public async parseRehearsalConflictsCsv(file: any, termId: number, ignoreInvalidEmails: boolean) {
        const rows: Array<Record<string, string>> = await Utilities.parseCsv(file);

        if (!ignoreInvalidEmails) {
            // make sure each of the emails belongs to a current member - if not, send back the ones that don't
            const invalidEmails: string[] = rows
                .map(row => row.Email2?.trim().toLowerCase() ?? '')
                .filter(async email => !(await this.isEmailInUseForTerm(email, termId)));
            if (invalidEmails.length) {
                // return any invalid emails to the frontend
                throw new InvalidEmailsError(invalidEmails);
            }
        }

        for (const row of rows) {
            // TODO: extract these column names out as constants
            const email = row.Email2?.trim().toLowerCase() ?? '';
            const tuesdayArriveLate = row['Tuesday Rehearsal']?.toLowerCase().includes('arriving late');
            const tuesdayLeaveEarly = row['Tuesday Rehearsal']?.toLowerCase().includes('leaving early');
            const thursdayArriveLate = row['Thursday Rehearsal']?.toLowerCase().includes('arriving late');
            const thursdayLeaveEarly = row['Thursday Rehearsal']?.toLowerCase().includes('leaving early');

            if (tuesdayArriveLate || tuesdayLeaveEarly || thursdayLeaveEarly || thursdayArriveLate) {
                let rehearsalConflict: string;

                if (tuesdayArriveLate && thursdayArriveLate && !tuesdayLeaveEarly && !thursdayLeaveEarly) {
                    rehearsalConflict = Constants.REHEARSAL_CONFLICT_ARRIVING_LATE;
                } else if (tuesdayLeaveEarly && thursdayLeaveEarly && !tuesdayArriveLate && !thursdayArriveLate) {
                    rehearsalConflict = Constants.REHEARSAL_CONFLICT_LEAVING_EARLY;
                } else if ((tuesdayLeaveEarly || tuesdayArriveLate) && !thursdayLeaveEarly && !thursdayArriveLate) {
                    rehearsalConflict = Constants.REHEARSAL_CONFLICT_TUES;
                } else if ((thursdayLeaveEarly || thursdayArriveLate) && !tuesdayLeaveEarly && !tuesdayArriveLate) {
                    rehearsalConflict = Constants.REHEARSAL_CONFLICT_THURS;
                } else {
                    rehearsalConflict = Constants.REHEARSAL_CONFLICT_OTHER;
                }
                const member: Member = new Member();
                // if the email is invalid, it will just be ignored when updating
                member.user = {email} as User;
                member.term = {termId} as Term;
                member.rehearsalConflict = rehearsalConflict;
                await this.memberRepository.updateRehearsalConflict(member);
            }
        }

    }

    public async isEmailInUseForTerm(email: string, termId: number) {
        return (await this.memberRepository.findByTermIdAndEmail(termId, email)).length;
    }
}