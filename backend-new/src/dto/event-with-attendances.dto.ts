import {MBEventDto} from "./mb-event.dto";
import {Expose, Type} from "class-transformer";
import {EventAttendance} from "../entities/event-attendance.entity";
import {EventAttendanceDto} from "./event-attendance.dto";

export class EventWithAttendancesDto extends MBEventDto {
    @Expose()
    @Type(() => EventAttendance)
    attendances!: EventAttendanceDto[];
}