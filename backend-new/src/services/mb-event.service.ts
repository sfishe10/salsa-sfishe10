import {MbEventRepository} from "../repositories/mb-event.repository";
import {MBEventDto} from "../dto/mb-event.dto";
import {MBEvent} from "../entities/mb-event.entity";
import {toMbEventDto} from "../mappers/mb-event.mapper";


export class MbEventService {
    private eventRepository: MbEventRepository;

    constructor(attendanceRepository?: MbEventRepository) {
        this.eventRepository = attendanceRepository ?? new MbEventRepository();
    }

    public async getById(attendanceId: number): Promise<MBEventDto> {
        const mbEvent: MBEvent | null =
            await this.eventRepository.findById(attendanceId);

        if (!mbEvent) {
            throw new Error('Event not found');
        }

        return toMbEventDto(mbEvent);
    }

    public async getUpcoming(): Promise<MBEventDto[]> {
        const events: MBEvent[] =
            await this.eventRepository.getUpcomingOrRecent(true);

        const eventDtos = events.map(event => toMbEventDto(event));

        return eventDtos;
    }

    public async getRecent(): Promise<MBEventDto[]> {
        const events: MBEvent[] =
            await this.eventRepository.getUpcomingOrRecent(false);

        const eventDtos = events.map(event => toMbEventDto(event));

        return eventDtos;
    }

    public async getByTermId(termId: number): Promise<MBEventDto[]> {
        const events: MBEvent[] =
            await this.eventRepository.getByTermId(termId);

        const eventDtos = events.map(event => toMbEventDto(event));

        return eventDtos;
    }
}