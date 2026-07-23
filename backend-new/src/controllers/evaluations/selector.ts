import {NotFoundError} from "../../errors/not-found-error";
import {EvaluationService} from "../../services/evaluation.service";
import {Evaluation} from "../../entities/evaluation.entity";
import {toEvaluationDto} from "../../mappers/evaluation.mapper";

const evalService: EvaluationService = new EvaluationService();

/**
 * Evaluations selectors
 */

export const getById = async (req: any, res: any) => {
    try {
        const evalId = req.params.id;

        const evaluation: Evaluation = await evalService.getById(evalId);

        res.send(toEvaluationDto(evaluation));
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(404).send('Evaluation not found');
        }

        console.error(err);
        res.status(500).send('Query failed');
    }
};

