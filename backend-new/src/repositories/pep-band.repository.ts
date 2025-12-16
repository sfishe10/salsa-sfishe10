import {db} from "../config/data-source";
import {PepBand} from "../entities/pep-band.entity";

export class PepBandRepository {
    private repo = db.getRepository(PepBand);

    findAll() {
        return this.repo.find(
            { relations: {
                    events: true,
                    members: true
                } }
        );
    }

    // TODO: probably don't need this
    // findById(id: string) {
    //     return this.repo.findOne({
    //         where: { bandId: id },
    //         relations: {
    //             events: true,
    //             members: true
    //         } });
    // }

    async create(pepBand: Partial<PepBand>) {
        const newPepBand = this.repo.create(pepBand);
        return await this.repo.save(newPepBand);
    }
}