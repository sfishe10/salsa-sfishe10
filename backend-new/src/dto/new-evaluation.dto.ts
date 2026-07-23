import {Expose} from "class-transformer";

export class NewEvaluationDto {
    @Expose()
    memberId!: number;

    @Expose()
    evaluatorId!: number

    @Expose()
    stationId!: number;

}