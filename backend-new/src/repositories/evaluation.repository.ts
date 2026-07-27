import {db} from "../data-source";
import {Evaluation} from "../entities/evaluation.entity";
import {NotFoundError} from "../errors/not-found-error";
import {EvaluationItem} from "../entities/evaluation-item.entity";

export class EvaluationRepository {
    private repo = db.getRepository(Evaluation);
    private itemRepo = db.getRepository(EvaluationItem);

    public async findById(id: number): Promise<Evaluation> {
        const evaluation: Evaluation | null = await this.repo.findOne({
            where: { evalId: id },
            relations: {
                member: true,
                evaluator: true,
                station: true,
                items: {
                    stationItem: {
                        group: true
                    }
                }
            },
            order: {
                items: {
                    stationItem: {
                        level: 'ASC'
                    }
                }
            }
        })

        if (!evaluation) {
            throw new NotFoundError('Evaluation not found');
        }

        return evaluation;

    }

    public async save(evaluation: Partial<Evaluation>) {
        return await this.repo.save(evaluation);
    }

    public async saveItem(item: Partial<EvaluationItem>) {
        return await this.itemRepo.save(item);
    }
}