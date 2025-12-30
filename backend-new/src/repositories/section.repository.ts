import {db} from "../data-source";
import {Section} from "../entities/section.entity";

export class SectionRepository {
    private repo = db.getRepository(Section);

    findAll() {
        return this.repo.find();
    }

    findById(id: number) {
        return this.repo.findOne({
            where: { sectionId: id },
            relations: { members: true } });
    }

    async create(section: Partial<Section>) {
        const newSection = this.repo.create(section);
        return await this.repo.save(newSection);
    }
}