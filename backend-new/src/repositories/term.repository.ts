import {db} from "../config/data-source";
import {Term} from "../entities/term.entity";

export class TermRepository {
    private repo = db.getRepository(Term);

    findAll() {
        return this.repo.find();
    }

    findById(id: number) {
        return this.repo.findOne({
            where: { termId: id },
            relations: {
                events: true,
                members: true
            } });
    }

    async create(term: Partial<Term>) {
        const newTerm = this.repo.create(term);
        return await this.repo.save(newTerm);
    }
}