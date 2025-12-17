import {AttendanceRepository} from "../repositories/attendance.repository";
import {EventAttendanceDto} from "../dto/event-attendance.dto";
import {EventAttendance} from "../entities/event-attendance.entity";
import {toEventAttendanceDto} from "../mappers/attendance.mapper";
import {MemberStatsDto} from "../dto/member-stats.dto";
import {AttendanceTermPageDto} from "../dto/attendance-term-page.dto";

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

    public async getBySectionAndEventId(sectionId: number, eventId: number) {
        const attendances: EventAttendance[] =
            await this.attendanceRepository.findBySectionAndEventId(sectionId, eventId);

        const attendanceDtos: EventAttendanceDto[] =
            attendances.map(attendance => toEventAttendanceDto(attendance));

        return attendanceDtos;
    }

    public async getByTermIdAndSection(termId: number,
                                       sectionId: number | null,
                                       eventType: string) {
        const attendances: AttendanceTermPageDto[] =
            await this.attendanceRepository.getByTermIdAndSection(termId, sectionId, eventType);

        return attendances;
    }

    public async getByTermIdAndSectionAndPepBand(termId: number,
                                                 pepBandId: number,
                                                 sectionId: number | null,
                                                 ignoreMemberPepBand: boolean) {
        const attendances: AttendanceTermPageDto[] =
            await this.attendanceRepository.getByTermIdAndSectionAndPepBand(termId, pepBandId, sectionId, ignoreMemberPepBand);

        return attendances;
    }

    public async getMemberStatsBySectionId(sectionId: number): Promise<MemberStatsDto> {
        const stats: MemberStatsDto =
            await this.attendanceRepository.getMemberStatsBySectionId(sectionId);

        return stats;
    }
}
