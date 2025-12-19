import {MemberRepository} from "../repositories/member.repository";
import {Member} from "../entities/member.entity";
import {MemberDto} from "../dto/member.dto";
import {toMemberDto} from "../mappers/member.mapper";
import {AttendanceRepository} from "../repositories/attendance.repository";

export class MemberService {
    private memberRepository: MemberRepository;
    private attendanceRepository: AttendanceRepository;

    constructor(memberRepository?: MemberRepository,
                attendanceRepository?: AttendanceRepository) {
        this.memberRepository = memberRepository ?? new MemberRepository();
        this.attendanceRepository = attendanceRepository ?? new AttendanceRepository();
    }

    public async getById(memberId: number): Promise<Member> {
        const member: Member | null =
            await this.memberRepository.findById(memberId);

        if (!member) {
            throw new Error('Member not found');
        }

        return member;
    }

    public async getBySectionId(sectionId: number): Promise<MemberDto[]> {
        const members: Member[] =
            await this.memberRepository.findBySectionId(sectionId);

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

    public async delete(memberId: number) {
        // delete all EventAttendances associated with member
        await this.attendanceRepository.deleteAttendancesForMember(memberId);

        await this.memberRepository.delete(memberId);
    }
}