import {db} from "../data-source";
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