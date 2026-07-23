import {Expose, Type} from "class-transformer";
import {StationItemDto} from "./station-item.dto";

export class EvaluationItemDto {
    // I don't think we'll need this since EvaluationItems will only be fetched through the Evaluation, and this will make a circular dependency

    // @Expose()
    // @Type(() => EvaluationDto)
    // evaluation!: EvaluationDto;

    @Expose()
    @Type(() => StationItemDto)
    stationItem!: StationItemDto;

    @Expose()
    status!: boolean;
}