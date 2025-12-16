import {SectionDto} from "../../dto/section.dto";
import {SectionService} from "../../services/section.service";

const sectionService: SectionService = new SectionService();

/**
 * Section selectors
 */

export const getAll = async (req: any, res: any) => {
    try {
        const sections: SectionDto[] = await sectionService.getAll();

        res.send(sections);
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
