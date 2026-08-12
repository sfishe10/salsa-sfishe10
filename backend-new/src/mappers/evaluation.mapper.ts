import {Evaluation} from "../entities/evaluation.entity";
import {toMemberDto} from "./member.mapper";
import {toStationDto} from "./station.mapper";
import {plainToInstance} from "class-transformer";
import {EvaluationDto} from "../dto/evaluation.dto";
import {toEvaluationItemDto} from "./evaluation-item.mapper";
import {toUserDto} from "./user.mapper";

export function toEvaluationDto(evaluation: Evaluation): EvaluationDto {
    const plainObj = {
        evalId: evaluation.evalId,
        member: evaluation.member ? toMemberDto(evaluation.member) : null,
        evaluator: evaluation.evaluator ? toUserDto(evaluation.evaluator) : null,
        station: evaluation.station ? toStationDto(evaluation.station) : null,
        passed: evaluation.passed,
        evalTime: evaluation.evalTime,

        items: evaluation.items ?
            evaluation.items.map(item => toEvaluationItemDto(item)) : null
    }

    return plainToInstance(EvaluationDto, plainObj, { excludeExtraneousValues: true })
}