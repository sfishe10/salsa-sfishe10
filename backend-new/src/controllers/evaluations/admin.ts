import {EvaluationService} from "../../services/evaluation.service";
import {NewEvaluationDto} from "../../dto/new-evaluation.dto";
import {plainToInstance} from "class-transformer";
import {Evaluation} from "../../entities/evaluation.entity";
import {toEvaluationDto} from "../../mappers/evaluation.mapper";
import {EvaluationDto} from "../../dto/evaluation.dto";

const evalService: EvaluationService = new EvaluationService();

export const create = async (req: any, res: any) => {
    try {
        const evalDto: NewEvaluationDto = plainToInstance(NewEvaluationDto, req.body);

        const savedEval: Evaluation = await evalService.startEvaluation(evalDto);

        res.send(toEvaluationDto(savedEval));
    } catch (err: any) {
        console.error('A critical error occurred in evaluations.create():', err.message);
        return res.status(500).send(err.message);
    }
};

export const submit = async (req: any, res: any) => {
    try {
        const evalDto: EvaluationDto = plainToInstance(EvaluationDto, req.body);

        const savedEval: Evaluation = await evalService.submitEvaluation(evalDto);

        res.send(toEvaluationDto(savedEval));
    } catch (err: any) {
        console.error('A critical error occurred in evaluations.submit():', err.message);
        return res.status(500).send(err.message);
    }
};

export const save = async (req: any, res: any) => {
    try {
        const evalDto: EvaluationDto = plainToInstance(EvaluationDto, req.body);

        const savedEval: Evaluation = await evalService.saveEvaluation(evalDto);

        res.send(toEvaluationDto(savedEval));
    } catch (err: any) {
        console.error('A critical error occurred in evaluations.save():', err.message);
        return res.status(500).send(err.message);
    }
};

export const deleteEval = async (req: any, res: any) => {
    try {
        const evalId = req.params.id;

        const result: boolean = await evalService.deleteEvaluation(evalId);

        res.send(result);
    } catch (err: any) {
        console.error('A critical error occurred in evaluations.deleteEval():', err.message);
        return res.status(500).send(err.message);
    }
};


