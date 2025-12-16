import {MemberRepository} from "../repositories/member.repository";
import {Member} from "../entities/member.entity";
import {MemberDto} from "../dto/member.dto";
import {toMemberDto} from "../mappers/member.mapper";

export class MemberService {
    private memberRepository: MemberRepository;

    constructor(memberRepository?: MemberRepository) {
        this.memberRepository = memberRepository ?? new MemberRepository();
    }

    public async getById(memberId: number): Promise<MemberDto> {
        const member: Member | null =
            await this.memberRepository.findById(memberId);

        if (!member) {
            throw new Error('Member not found');
        }

        return toMemberDto(member);
    }

    public async getBySectionId(sectionId: number): Promise<MemberDto[]> {
        const members: Member[] =
            await this.memberRepository.findBySectionId(sectionId);

        const memberDtos: MemberDto[] = members.map(member => toMemberDto(member));

        return memberDtos;
    }

    public async getByTermId(termId: number): Promise<MemberDto[]> {
        const members: Member[] =
            await this.memberRepository.findByTermId(termId);

        const memberDtos: MemberDto[] = members.map(member => toMemberDto(member));

        return memberDtos;
    }
}