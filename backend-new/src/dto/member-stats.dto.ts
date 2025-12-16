import { Expose } from 'class-transformer';

export class MemberStatsDto {
    @Expose()
    memberId!: number;

    @Expose()
    termId!: number;

    @Expose()
    email!: string;

    @Expose()
    firstName!: string;

    @Expose()
    lastName!: string;

    @Expose()
    numRehearsals!: number;

    @Expose()
    numWholeBandEvents!: number;

    @Expose()
    numPepEvents!: number;

    @Expose()
    numVolunteerEvents!: number;

    @Expose()
    numSubEvents!: number;
}
