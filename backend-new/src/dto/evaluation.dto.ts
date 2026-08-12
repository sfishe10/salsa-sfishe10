import {Expose, Type} from "class-transformer";
import {MemberDto} from "./member.dto";
import {StationDto} from "./station.dto";
import {EvaluationItemDto} from "./evaluation-item.dto";
import {UserDto} from "./user.dto";

export class EvaluationDto {
    @Expose()
    evalId!: number;

    @Expose()
    @Type(() => MemberDto)
    member!: MemberDto;

    @Expose()
    @Type(() => UserDto)
    evaluator!: UserDto

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