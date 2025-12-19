import {AttendanceRepository} from "../repositories/attendance.repository";
import {EventAttendanceDto} from "../dto/event-attendance.dto";
import {EventAttendance} from "../entities/event-attendance.entity";
import {toEventAttendanceDto} from "../mappers/attendance.mapper";
import {MemberStatsDto} from "../dto/member-stats.dto";
import {AttendanceTermPageDto} from "../dto/attendance-term-page.dto";
import {MBEvent} from "../entities/mb-event.entity";
import {Section} from "../entities/section.entity";
import {MbEventService} from "./mb-event.service";
import {SectionService} from "./section.service";
import {Member} from "../entities/member.entity";
import {MemberService} from "./member.service";

export class AttendanceService {
    private attendanceRepository: AttendanceRepository;
    private eventService: MbEventService;
    private sectionService: SectionService;
    private memberService: MemberService;

    constructor(attendanceRepository?: AttendanceRepository,
                eventService?: MbEventService,
                sectionService?: SectionService,
                memberService?: MemberService) {
        this.attendanceRepository = attendanceRepository ?? new AttendanceRepository();
        this.eventService = eventService ?? new MbEventService();
        this.sectionService = sectionService ?? new SectionService();
        this.memberService = memberService ?? new MemberService();
    }

    public async getById(attendanceId: number): Promise<EventAttendance> {
        const attendance: EventAttendance | null =
            await this.attendanceRepository.findById(attendanceId);

        if (!attendance) {
            throw new Error('Attendance not found');
        }

        return attendance;
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

    public async createAttendance(newAttendanceDto: EventAttendanceDto): Promise<EventAttendance> {
        const eventId = newAttendanceDto.mbEvent.eventId;
        const sectionId = newAttendanceDto?.section ? newAttendanceDto.section.sectionId : null;

        let newAttendance: EventAttendance = new EventAttendance();
        const mbEvent: MBEvent = await this.eventService.getById(eventId);
        const section: Section | null = sectionId ? await this.sectionService.getById(sectionId) : null;

        newAttendance.mbEvent = mbEvent;
        newAttendance.section = section;

        return await this.attendanceRepository.save(newAttendance);
    }

    public async updateAttendance(attendanceDto: EventAttendanceDto): Promise<EventAttendance> {
        const existingAttendance: EventAttendance = await this.getById(attendanceDto.attendanceId);

        const member: Member | null = attendanceDto.member
            ? await this.memberService.getById(attendanceDto.member.memberId) : null;
        const sub: Member | null = attendanceDto.sub
            ? await this.memberService.getById(attendanceDto.sub.memberId) : null;

        existingAttendance.member = member;
        existingAttendance.sub = sub;
        existingAttendance.attendance = attendanceDto.attendance;

        return await this.attendanceRepository.save(existingAttendance);
    }

    public async submitForm(attendanceDtos: EventAttendanceDto[]): Promise<EventAttendance[]> {
        const savedAttendances: EventAttendance[] = [];

        for (let attendance of attendanceDtos) {
            const savedAttendance: EventAttendance = await this.updateAttendance(attendance);
            savedAttendances.push(savedAttendance);
        }

        return savedAttendances;
    }

    public async delete(id: number): Promise<void> {
        return await this.attendanceRepository.delete(id);
    }
}
