import {SectionRepository} from "../repositories/section.repository";
import {SectionDto} from "../dto/section.dto";
import {Section} from "../entities/section.entity";
import {toSectionDto} from "../mappers/section.mapper";
import {NotFoundError} from "../errors/not-found-error";


export class SectionService {
    private sectionRepository: SectionRepository;

    constructor(sectionRepository?: SectionRepository) {
        this.sectionRepository = sectionRepository ?? new SectionRepository();
    }

    public async getById(sectionId: number): Promise<Section> {
        const section: Section | null =
            await this.sectionRepository.findById(sectionId);

        if (!section) {
            throw new NotFoundError('Section not found');
        }

        return section;
    }

    public async getAll(): Promise<Section[]> {
        const sections: Section[] =
            await this.sectionRepository.findAll();

        return sections;
    }
}