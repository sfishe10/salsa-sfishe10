import {Expose} from "class-transformer";

export class MemberStationStatusDto {
    @Expose()
    stationId!: number;

    @Expose()
    stationTitle!: string;

    @Expose()
    stationLevel!: number;

    @Expose()
    stationClass!: number;

    @Expose()
    evalId!: number;

    @Expose()
    status!: string;

    @Expose()
    attemptCount!: number;

    @Expose()
    evalTime!: Date | null;

    @Expose()
    evaluatorFirst!: string | null;

    @Expose()
    evaluatorLast!: string | null;
}