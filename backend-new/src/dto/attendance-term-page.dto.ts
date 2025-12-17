import {Expose} from "class-transformer";

export class AttendanceTermPageDto {
    @Expose()
    attendanceId!: number;

    @Expose()
    attendanceStatus!: string | null;

    @Expose()
    eventId!: number;

    @Expose()
    eventTitle!: string;

    @Expose()
    eventDate!: Date;

    @Expose()
    memberId!: number;

    @Expose()
    memberFirstName!: string;

    @Expose()
    memberLastName!: string;

    @Expose()
    rehearsalConflict!: boolean;

    @Expose()
    subId!: number | null;

    @Expose()
    subFirstName!: string | null;

    @Expose()
    subLastName!: string | null;

    @Expose()
    sectionId!: number;

    @Expose()
    sectionName!: string;
}
