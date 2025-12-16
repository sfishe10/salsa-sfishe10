import {AttendanceRepository} from "../repositories/attendance.repository";
import {EventAttendanceDto} from "../dto/event-attendance.dto";
import {EventAttendance} from "../entities/event-attendance.entity";
import {toEventAttendanceDto} from "../mappers/attendance.mapper";
import {MemberStatsDto} from "../dto/member-stats.dto";

export class AttendanceService {
    private attendanceRepository: AttendanceRepository;

    constructor(attendanceRepository?: AttendanceRepository) {
        this.attendanceRepository = attendanceRepository ?? new AttendanceRepository();
    }

    public async getById(attendanceId: number): Promise<EventAttendanceDto> {
        const attendance: EventAttendance | null =
            await this.attendanceRepository.findById(attendanceId);

        if (!attendance) {
            throw new Error('Attendance not found');
        }

        return toEventAttendanceDto(attendance);
    }

    public async getMemberStatsBySectionId(sectionId: number): Promise<MemberStatsDto> {
        const stats: MemberStatsDto =
            await this.attendanceRepository.getMemberStatsBySectionId(sectionId);

        return stats;
    }
}
