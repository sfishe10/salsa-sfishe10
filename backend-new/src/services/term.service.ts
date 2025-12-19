import {TermRepository} from "../repositories/term.repository";
import {TermDto} from "../dto/term.dto";
import {Term} from "../entities/term.entity";
import {toTermDto} from "../mappers/term.mapper";


export class TermService {
    private termRepository: TermRepository;

    constructor(termRepository?: TermRepository) {
        this.termRepository = termRepository ?? new TermRepository();
    }

    public async getById(termId: number): Promise<Term> {
        const term: Term | null =
            await this.termRepository.findById(termId);

        if (!term) {
            throw new Error('Term not found');
        }

        return term;
    }

    public async getAll(): Promise<TermDto[]> {
        const terms: Term[] =
            await this.termRepository.findAll();

        const termDtos: TermDto[] = terms.map(term => toTermDto(term));

        return termDtos;
    }
}