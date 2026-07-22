import {Expose, Type} from "class-transformer";
import {MemberDto} from "./member.dto";
import {StationDto} from "./station.dto";
import {EvaluationItemDto} from "./evaluation-item.dto";

export class EvaluationDto {
    @Expose()
    evalId!: number;

    @Expose()
    @Type(() => MemberDto)
    member!: MemberDto;

    @Expose()
    @Type(() => MemberDto)
    evaluator!: MemberDto

    @Expose()
    @Type(() => StationDto)
    station!: StationDto;

    @Expose()
    passed!: boolean;

    @Expose()
    evalTime!: Date;

    @Expose()
    @Type(() => EvaluationItemDto)
    items!: EvaluationItemDto[];
}