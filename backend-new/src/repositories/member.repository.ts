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

    public async findBySectionId(sectionId: number): Promise<Member[]> {
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

    public async findByTermId(termId: number): Promise<Member[]> {
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

    public async findByTermIdAndEmail(termId: number, email: string): Promise<Member[]> {
        return this.repo.find({
            where: {
                user: {email},
                term: {termId}
            }
        });
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

    public async save(member: Partial<Member>) {
        return await this.repo.save(member);
    }

    // for a duplicate member (user + term + section already in use), ignores insert
    public async insertOrIgnore(members: Member[] | Member) {
        await this.repo
            .createQueryBuilder()
            .insert()
            .values(members)
            .orIgnore()
            .execute();
    }

    public async updateRehearsalConflict(member: Member) {
        await this.repo.update(
            { user: { email: member.user.email } },
            { rehearsalConflict: member.rehearsalConflict })
    }

    public async delete(memberId: number) {
        return await this.repo.delete(memberId);
    }
}
