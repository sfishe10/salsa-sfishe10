import { Expose } from 'class-transformer';

export class MemberStatsDto {
    @Expose()
    memberId!: number;

    @Expose()
    sectionId!: number;

    @Expose()
    sectionName!: string;

    @Expose()
    email!: string;

    @Expose()
    firstName!: string;

    @Expose()
    lastName!: string;

    // Unexcused Misses
    @Expose()
    totalUnexcusedMisses!: number

    @Expose()
    rehearsalsMissed!: number;

    @Expose()
    wholeBandEventsMissed!: number;

    @Expose()
    pepEventsMissed!: number;

    // Attended events
    @Expose()
    rehearsalsAttended!: number;

    @Expose()
    wholeBandEventsAttended!: number;

    @Expose()
    totalPepEventsAttended!: number;

    @Expose()
    assignedAbcEventsAttended!: number;

    @Expose()
    extraAbcEventsAttended!: number;

    @Expose()
    abcEventsSubbed!: number;

    @Expose()
    volunteerEventsAttended!: number;
}
