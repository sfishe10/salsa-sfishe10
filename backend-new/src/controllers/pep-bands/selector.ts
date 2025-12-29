import {PepBandService} from "../../services/pep-band.service";
import {PepBandDto} from "../../dto/pep-band.dto";

const pepBandService: PepBandService = new PepBandService();

/**
 * Pep Band selectors
 */

export const getAll = async (req: any, res: any) => {
    try {
        const pepBands: PepBandDto[] = await pepBandService.getAll();

        res.send(pepBands);

    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};
