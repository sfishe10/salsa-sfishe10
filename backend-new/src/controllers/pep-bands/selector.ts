import {PepBandService} from "../../services/pep-band.service";
import {PepBandDto} from "../../dto/pep-band.dto";

const pepBandService: PepBandService = new PepBandService();

/**
 * Pep Band selectors
 */

export const getAll = async (req: any, res: any) => {
    try {
        const sectionId = req.query.sectionId
            ? Number(req.query.sectionId)
            : undefined;

        const termId = req.query.termId
            ? Number(req.query.termId)
            : undefined;

        const pepBands: PepBandDto[] = await pepBandService.getAll(sectionId, termId);

        res.send(pepBands);

    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};
