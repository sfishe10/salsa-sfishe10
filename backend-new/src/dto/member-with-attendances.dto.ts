import {MemberDto} from "./member.dto";
import {Expose, Type} from "class-transformer";
import {EventAttendanceDto} from "./event-attendance.dto";

export class MemberWithAttendancesDto extends MemberDto {
    @Expose()
    @Type(() => EventAttendanceDto)
    attendances?: EventAttendanceDto[];
}