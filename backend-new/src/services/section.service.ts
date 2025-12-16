import {SectionRepository} from "../repositories/section.repository";
import {SectionDto} from "../dto/section.dto";
import {Section} from "../entities/section.entity";
import {toSectionDto} from "../mappers/section.mapper";


export class SectionService {
    private sectionRepository: SectionRepository;

    constructor(sectionRepository?: SectionRepository) {
        this.sectionRepository = sectionRepository ?? new SectionRepository();
    }

    public async getById(sectionId: number): Promise<SectionDto> {
        const section: Section | null =
            await this.sectionRepository.findById(sectionId);

        if (!section) {
            throw new Error('Section not found');
        }

        return toSectionDto(section);
    }

    public async getAll(): Promise<SectionDto[]> {
        const sections: Section[] =
            await this.sectionRepository.findAll();

        const sectionDtos: SectionDto[] = sections.map(section => toSectionDto(section));

        return sectionDtos;
    }
}