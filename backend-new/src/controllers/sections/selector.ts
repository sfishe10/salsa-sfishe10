import {SectionDto} from "../../dto/section.dto";
import {SectionService} from "../../services/section.service";
import {toSectionDto} from "../../mappers/section.mapper";
import {Section} from "../../entities/section.entity";

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

        if (!section) {
            return res.status(404).send('Section not found');
        }

        res.send(section);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};
