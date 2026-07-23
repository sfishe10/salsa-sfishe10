import {EvaluationService} from "../../services/evaluation.service";
import {NewEvaluationDto} from "../../dto/new-evaluation.dto";
import {plainToInstance} from "class-transformer";
import {Evaluation} from "../../entities/evaluation.entity";
import {toEvaluationDto} from "../../mappers/evaluation.mapper";

const evalService: EvaluationService = new EvaluationService();

export const create = async (req: any, res: any) => {
    try {
        const evalDto: NewEvaluationDto = plainToInstance(NewEvaluationDto, req.body);

        const savedEval: Evaluation = await evalService.create(evalDto);

        res.send(toEvaluationDto(savedEval));
    } catch (err: any) {
        console.error('A critical error occurred in evaluations.create():', err.message);
        return res.status(500).send(err.message);
    }
};


