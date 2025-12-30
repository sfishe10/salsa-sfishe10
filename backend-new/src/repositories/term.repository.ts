import {db} from "../data-source";
import {Term} from "../entities/term.entity";
import {NotFoundError} from "../errors/not-found-error";

export class TermRepository {
    private repo = db.getRepository(Term);

    public async findAll() {
        return this.repo.find({
            order: { startDate: 'DESC' }
        });
    }

    public async findById(id: number) {
        const term: Term | null = await this.repo.findOne({
            where: { termId: id },
            relations: {
                events: true,
                members: true
            } });

        if (!term) {
            throw new NotFoundError('Term not found');
        }

        return term;
    }

    public async save(term: Partial<Term>) {
        return await this.repo.save(term);
    }

    public async delete(termId: number) {
        return await this.repo.delete(termId);
    }
}