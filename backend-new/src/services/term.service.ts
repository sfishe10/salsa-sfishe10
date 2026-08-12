import {TermRepository} from "../repositories/term.repository";
import {TermDto} from "../dto/term.dto";
import {Term} from "../entities/term.entity";
import {toTermDto} from "../mappers/term.mapper";
import {MBEvent} from "../entities/mb-event.entity";
import {MbEventService} from "./mb-event.service";
import {Member} from "../entities/member.entity";
import {MemberService} from "./member.service";


export class TermService {
    private termRepository: TermRepository;
    private eventService: MbEventService;
    private memberService: MemberService;

    constructor(termRepository?: TermRepository,
                eventService?: MbEventService,
                memberService?: MemberService) {
        this.termRepository = termRepository ?? new TermRepository();
        this.eventService = eventService ?? new MbEventService();
        this.memberService = memberService ?? new MemberService();
    }

    public async getById(termId: number): Promise<Term> {
        const term: Term = await this.termRepository.findById(termId);

        return term;
    }

    public async getAll(): Promise<TermDto[]> {
        const terms: Term[] =
            await this.termRepository.findAll();

        const termDtos: TermDto[] = terms.map(term => toTermDto(term));

        return termDtos;
    }

    public async getCurrentOrClosestTerm(): Promise<Term> {
        const term: Term = await this.termRepository.findClosestOrCurrentTerm();

        return term;
    }

    public async create(termDto: TermDto): Promise<Term> {
        let newTerm: Term = new Term();

        newTerm.termName = termDto.termName;
        newTerm.startDate = new Date(termDto.startDate);
        newTerm.endDate = new Date(termDto.endDate);

        return await this.termRepository.save(newTerm);
    }

    public async update(termDto: TermDto): Promise<Term> {
        let existingTerm: Term = await this.getById(termDto.termId);

        existingTerm.termName = termDto.termName;
        existingTerm.startDate = new Date(termDto.startDate);
        existingTerm.endDate = new Date(termDto.endDate);

        return await this.termRepository.save(existingTerm);
    }

    public async delete(termId: number) {
        // delete all events and EventAttendances associated with the term
        const mbEvents: MBEvent[] = await this.eventService.getByTermId(termId);
        for (let mbEvent of mbEvents) {
            await this.eventService.delete(mbEvent.eventId);
        }

        // delete all members associated with the term
        const members: Member[] = await this.memberService.getByTermId(termId);
        for (let member of members) {
            await this.memberService.delete(member.memberId);
        }

        // delete the term
        await this.termRepository.delete(termId);
    }
}