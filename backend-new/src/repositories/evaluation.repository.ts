import {db} from "../data-source";
import {Evaluation} from "../entities/evaluation.entity";
import {NotFoundError} from "../errors/not-found-error";
import {EvaluationItem} from "../entities/evaluation-item.entity";
import {MemberStationStatusDto} from "../dto/member-station-status.dto";
import {plainToInstance} from "class-transformer";
import {IsNull} from "typeorm";

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

    public async findByMemberAndStationId(memberId: number, stationId: number): Promise<Evaluation | null> {
        const evaluation: Evaluation | null = await this.repo.findOne({
            where: {
                member: {
                    memberId
                },
                station: {
                    stationId
                },
                passed: IsNull()
            }
        })

        return evaluation;
    }

    public async getMemberStationsStatus(memberId: number): Promise<MemberStationStatusDto[]> {
        const params: any[] = [memberId];

        const sql = `
            SELECT
                s.stationId AS stationId,
                s.title AS stationTitle,
                s.level AS stationLevel,
                s.class AS stationClass,
                e.evalId,
                CASE
                    WHEN e.evalId IS NULL THEN 'No Attempts Yet'
                    WHEN e.passed = 1 THEN 'passed'
                    WHEN e.passed = 0 THEN 'failed'
                    WHEN e.passed IS NULL THEN 'in progress'
                    END AS status,
                COALESCE(e.attemptCount, 0) AS attemptCount,
                e.evalTime,
                evaluatorUser.firstName AS evaluatorFirst,
                evaluatorUser.lastName AS evaluatorLast
            FROM Station AS s
                     LEFT JOIN (
                SELECT
                    ranked.evalId,
                    ranked.memberId,
                    ranked.evaluatorId,
                    ranked.stationId,
                    ranked.passed,
                    ranked.evalTime,
                    ranked.attemptCount
                FROM (
                         SELECT
                             Evaluation.*,
                             ROW_NUMBER() OVER (
                PARTITION BY stationId
                ORDER BY evalTime DESC, evalId DESC
            ) AS rowNum,
                             COUNT(*) OVER (
                PARTITION BY stationId
            ) AS attemptCount
                         FROM Evaluation
                         WHERE memberId = ?
                     ) AS ranked
                WHERE ranked.rowNum = 1
            ) AS e
                               ON e.stationId = s.stationId
                     LEFT JOIN Member AS evaluatorMember
                               ON e.evaluatorId = evaluatorMember.memberId
                     LEFT JOIN User AS evaluatorUser
                               ON evaluatorMember.email = evaluatorUser.email
            ORDER BY s.level;
        `

        const results: any[] = await db.query(sql, params);

        return plainToInstance(MemberStationStatusDto, results, {excludeExtraneousValues: true});
    }

    public async save(evaluation: Partial<Evaluation>) {
        return await this.repo.save(evaluation);
    }

    public async saveItem(item: Partial<EvaluationItem>) {
        return await this.itemRepo.save(item);
    }
}