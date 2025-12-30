import {AttendanceRepository} from "../repositories/attendance.repository";
import {EventAttendanceDto} from "../dto/event-attendance.dto";
import {EventAttendance} from "../entities/event-attendance.entity";
import {toEventAttendanceDto} from "../mappers/attendance.mapper";
import {MemberStatsDto} from "../dto/member-stats.dto";
import {AttendanceTermPageDto} from "../dto/attendance-term-page.dto";
import {MBEvent} from "../entities/mb-event.entity";
import {Section} from "../entities/section.entity";
import {Member} from "../entities/member.entity";
import {MbEventRepository} from "../repositories/mb-event.repository";
import {Constants} from "../utilities/constants";
import {MemberRepository} from "../repositories/member.repository";
import {NotFoundError} from "../errors/not-found-error";

export class AttendanceService {
    private attendanceRepository: AttendanceRepository;
    private eventRepository: MbEventRepository;
    private memberRepository: MemberRepository;

    constructor(attendanceRepository?: AttendanceRepository,
                eventRepository?: MbEventRepository,
                memberRepository?: MemberRepository) {
        this.attendanceRepository = attendanceRepository ?? new AttendanceRepository();
        this.eventRepository = eventRepository ?? new MbEventRepository();
        this.memberRepository = memberRepository ?? new MemberRepository();
    }

    public async getById(attendanceId: number): Promise<EventAttendance> {
        const attendance: EventAttendance | null =
            await this.attendanceRepository.findById(attendanceId);

        if (!attendance) {
            throw new NotFoundError('Attendance not found');
        }

        return attendance;
    }

    public async getByEventId(eventId: number) {
        const attendances: EventAttendance[] =
            await this.attendanceRepository.findByEventId(eventId);

        return attendances;
    }

    public async getByMemberId(memberId: number) {
        const attendances: EventAttendance[] =
            await this.attendanceRepository.findByMemberId(memberId);

        return attendances;
    }

    public async getBySectionAndEventId(sectionId: number, eventId: number) {
        const attendances: EventAttendance[] =
            await this.attendanceRepository.findBySectionAndEventId(sectionId, eventId);

        const attendanceDtos: EventAttendanceDto[] =
            attendances.map(attendance => toEventAttendanceDto(attendance));

        return attendanceDtos;
    }

    public async getByTermIdAndSection(termId: number,
                                       sectionId: number | null,
                                       eventType: string) {
        const attendances: AttendanceTermPageDto[] =
            await this.attendanceRepository.getByTermIdAndSection(termId, sectionId, eventType);

        return attendances;
    }

    public async getByTermIdAndSectionAndPepBand(termId: number,
                                                 pepBandId: string,
                                                 sectionId: number | null,
                                                 ignoreMemberPepBand: boolean) {
        const attendances: AttendanceTermPageDto[] =
            await this.attendanceRepository.getByTermIdAndSectionAndPepBand(termId, pepBandId, sectionId, ignoreMemberPepBand);

        return attendances;
    }

    public async getMemberStatsBySectionId(sectionId: number): Promise<MemberStatsDto> {
        const stats: MemberStatsDto =
            await this.attendanceRepository.getMemberStatsBySectionId(sectionId);

        return stats;
    }

    public async createBlankAttendance(newAttendanceDto: EventAttendanceDto): Promise<EventAttendance> {
        const eventId = newAttendanceDto.mbEvent.eventId;
        const sectionId = newAttendanceDto?.section ? newAttendanceDto.section.sectionId : null;

        let newAttendance: EventAttendance = new EventAttendance();
        const mbEvent: MBEvent = { eventId } as MBEvent;
        const section: Section | null = sectionId ? { sectionId } as Section : null;

        newAttendance.member = null;
        newAttendance.mbEvent = mbEvent;
        newAttendance.section = section;

        return await this.attendanceRepository.save(newAttendance);
    }

    public async updateAttendance(attendanceDto: EventAttendanceDto): Promise<EventAttendance> {
        const existingAttendance: EventAttendance = await this.getById(attendanceDto.attendanceId);

        const member: Member | null = attendanceDto.member
            ? await this.memberRepository.findById(attendanceDto.member.memberId) : null;
        const sub: Member | null = attendanceDto.sub
            ? await this.memberRepository.findById(attendanceDto.sub.memberId) : null;

        existingAttendance.member = member;
        existingAttendance.sub = sub;
        existingAttendance.attendance = attendanceDto.attendance;

        return await this.attendanceRepository.save(existingAttendance);
    }

    // used when creating or updating an event
    public async createAttendancesForEvent(mbEvent: MBEvent) {
        // create new EventAttendance objects for each appropriate Member
        let members: Member[] = [];

        if (mbEvent.type == Constants.EVENT_TYPE_PEP_EVENT) {
            // for ABC band events, assign the appropriate pep band
            // volunteer events will default to 0 attendances as they will be added later by users
            if (mbEvent.pepBand != null && mbEvent.pepBand?.bandId != Constants.PEP_BAND_ID_VOLUNTEER) {
                members = await this.memberRepository.findByTermAndPepBandId(mbEvent.term.termId, mbEvent.pepBand.bandId);
            }
        } else {
            members = await this.memberRepository.findByTermId(mbEvent.term.termId);
        }

        for (let member of members) {
            await this.createAndSaveAttendance(mbEvent, member);
        }
    }

    // used when creating or updating an individual member
    public async createAttendancesForMember(member: Member) {
        let mbEvents: MBEvent[];

        let pepBandId: string | null = member.pepBand ? member.pepBand.bandId : null;
        mbEvents = await this.eventRepository.getByTermAndPepBandId(member.term.termId, pepBandId);

        for (let mbEvent of mbEvents) {
            await this.createAndSaveAttendance(mbEvent, member);
        }
    }

    // used when adding members from the supplemental form
    public async createAttendancesForWholeTerm(termId: number) {
        let mbEvents: MBEvent[];
        let members: Member[] = await this.memberRepository.findByTermId(termId);

        for (let member of members) {
            let pepBandId: string | null = member.pepBand ? member.pepBand.bandId : null;
            mbEvents = await this.eventRepository.getByTermAndPepBandId(member.term.termId, pepBandId);

            for (let mbEvent of mbEvents) {
                await this.createAndSaveAttendance(mbEvent, member);
            }
        }
    }

    private async createAndSaveAttendance(mbEvent: MBEvent, member: Member) {
        let newAttendance: EventAttendance = new EventAttendance();
        newAttendance.mbEvent = mbEvent;
        newAttendance.member = member;
        newAttendance.attendance = null;
        newAttendance.required = true;
        newAttendance.section = member.section;

        await this.attendanceRepository.create(newAttendance);
    }

    public async submitForm(attendanceDtos: EventAttendanceDto[]): Promise<EventAttendance[]> {
        const savedAttendances: EventAttendance[] = [];

        for (let attendance of attendanceDtos) {
            const savedAttendance: EventAttendance = await this.updateAttendance(attendance);
            savedAttendances.push(savedAttendance);
        }

        return savedAttendances;
    }

    public async delete(id: number): Promise<void> {
        return await this.attendanceRepository.delete(id);
    }

    public async deleteAttendancesForEvent(eventId: number) {
        return await this.attendanceRepository.deleteAttendancesForEvent(eventId);
    }

    public async deleteAttendancesForMember(memberId: number) {
        return await this.attendanceRepository.deleteAttendancesForMember(memberId);
    }

    public async deleteEmptyAttendancesForMember(memberId: number) {
        await this.attendanceRepository.deleteEmptyAttendancesForMember(memberId);
    }

    public async changePepAttendancesToNotRequired(memberId: number) {
        const pepAttendances: EventAttendance[] = await this.attendanceRepository.findPepEventsByMemberId(memberId);

        const updatedAttendances: EventAttendance[] = [];
        for (let att of pepAttendances) {
            att.required = false;
            updatedAttendances.push(await this.attendanceRepository.save(att));
        }

        return updatedAttendances;
    }
}
