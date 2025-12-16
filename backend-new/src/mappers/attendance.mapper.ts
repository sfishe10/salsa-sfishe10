import { plainToInstance } from 'class-transformer';
import { EventAttendance } from '../entities/event-attendance.entity';
import { EventAttendanceDto } from '../dto/event-attendance.dto';
import { toMbEventDto } from './mb-event.mapper';
import { toMemberDto } from './member.mapper';
import { toSectionDto } from './section.mapper';

export function toEventAttendanceDto(attendance: EventAttendance): EventAttendanceDto {
    const plainObj = {
        attendanceId: attendance.attendanceId,
        attendance: attendance.attendance,
        required: attendance.required,
        lastUpdated: attendance.lastUpdated,

        event: attendance.mbEvent ? toMbEventDto(attendance.mbEvent) : null,
        member: attendance.member ? toMemberDto(attendance.member) : null,
        sub: attendance.sub ? toMemberDto(attendance.sub) : null,
        section: attendance.section ? toSectionDto(attendance.section) : null,
    };

    return plainToInstance(EventAttendanceDto, plainObj, { excludeExtraneousValues: true });
}
