import {db} from "../config/data-source";
import {Member} from "../entities/member.entity";

export class MemberRepository {
    private repo = db.getRepository(Member);

    findById(id: number) {
        return this.repo.findOne({
            where: { memberId: id },
            relations: {
                user: true,
                section: true,
                pepBand: true,
                term: true,
                attendances: true,
                subs: true
            }});
    }

    findBySectionId(sectionId: number) {
        return this.repo.find({
            where: {
                section: { sectionId: sectionId }
            },
            relations: {
                user: true,
                section: true,
                pepBand: true,
                term: true,
            }});
    }

    findByTermId(termId: number) {
        return this.repo.find({
            where: {
                term: { termId: termId }
            },
            relations: {
                user: true,
                section: true,
                pepBand: true,
                term: true,
            }});
    }

    findByTermAndPepBandId(termId: number, pepBandId: string) {
        return this.repo.find({
            where: {
                term: { termId: termId },
                pepBand: { bandId: pepBandId }
            },
            relations: {
                user: true,
                section: true,
                pepBand: true,
                term: true,
            }});
    }

    async create(member: Partial<Member>) {
        const newMember = this.repo.create(member);
        return await this.repo.save(newMember);
    }
}
