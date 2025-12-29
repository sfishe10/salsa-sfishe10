import {SectionDto} from "../../dto/section.dto";
import {SectionService} from "../../services/section.service";
import {toSectionDto} from "../../mappers/section.mapper";
import {Section} from "../../entities/section.entity";
import {NotFoundError} from "../../errors/not-found-error";

const sectionService: SectionService = new SectionService();

/**
 * Section selectors
 */

export const getAll = async (req: any, res: any) => {
    try {
        const sections: Section[] = await sectionService.getAll();

        const sectionDtos: SectionDto[] = sections.map(section => toSectionDto(section));

        res.send(sectionDtos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};

export const getById = async (req: any, res: any) => {
    const sectionId = req.params.id;

    try {
        const section: SectionDto = await sectionService.getById(sectionId);

        res.send(section);
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(404).send('Section not found');
        }

        console.error(err);
        res.status(500).send('Query failed');
    }
};
