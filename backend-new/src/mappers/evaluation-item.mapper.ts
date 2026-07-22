import {plainToInstance} from "class-transformer";
import {EvaluationItem} from "../entities/evaluation-item.entity";
import {EvaluationItemDto} from "../dto/evaluation-item.dto";
import {toEvaluationDto} from "./evaluation.mapper";
import {toStationItemDto} from "./station-item.mapper";

export function toEvaluationItemDto(item: EvaluationItem): EvaluationItemDto {
    const plainObj = {
        evaluation: item.evaluation ? toEvaluationDto(item.evaluation) : null,
        stationItem: item.stationItem ? toStationItemDto(item.stationItem) : null,
        status: item.status
    }

    return plainToInstance(EvaluationItemDto, plainObj, { excludeExtraneousValues: true })
}