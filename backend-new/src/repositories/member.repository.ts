import {db} from "../config/data-source";
import {Member} from "../entities/member.entity";

export class MemberRepository {
    private repo = db.getRepository(Member);

    public async findById(id: number) {
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

    public async findBySectionId(sectionId: number) {
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

    public async findByTermId(termId: number) {
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

    public async findByTermAndPepBandId(termId: number, pepBandId: string) {
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

    public async create(member: Partial<Member>) {
        return await this.repo.save(member);
    }

    public async delete(memberId: number) {
        return await this.repo.delete(memberId);
    }
}
