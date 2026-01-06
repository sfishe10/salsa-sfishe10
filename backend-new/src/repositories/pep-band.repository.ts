import {db} from "../data-source";
import {PepBand} from "../entities/pep-band.entity";

export class PepBandRepository {
    private repo = db.getRepository(PepBand);

    findAll(sectionId?: number, termId?: number): Promise<PepBand[]> {
        const qb = this.repo.createQueryBuilder('pepBand');

        const conditions: string[] = [];
        const params: any = {};

        console.log(termId);

        if (sectionId !== undefined) {
            conditions.push('member.sectionId = :sectionId');
            params.sectionId = sectionId;
        }

        if (termId !== undefined) {
            conditions.push('member.termId = :termId');
            params.termId = termId;
        }

        qb.leftJoinAndSelect(
            'pepBand.members',
            'member',
            conditions.length ? conditions.join(' AND ') : undefined,
            params
        ).leftJoinAndSelect(
            'member.user',
            'user'
        );

        return qb.getMany();
    }

    findById(id: string) {
        return this.repo.findOne({
            where: { bandId: id }
            // if needed later, make a separate method that also fetches members and/or events associated with the pep band
        });
    }

    async create(pepBand: Partial<PepBand>) {
        const newPepBand = this.repo.create(pepBand);
        return await this.repo.save(newPepBand);
    }
}