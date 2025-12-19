import {TermService} from "../../services/term.service";
import {TermDto} from "../../dto/term.dto";
import {Term} from "../../entities/term.entity";
import {toTermDto} from "../../mappers/term.mapper";

const termService: TermService = new TermService();

/**
 * Term selectors
 */

export const getAll = async (req: any, res: any) => {
    try {
        const terms: TermDto[] = await termService.getAll();

        res.send(terms);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};

export const getById = async (req: any, res: any) => {
    const termId = req.params.id;

    try {
        const term: Term = await termService.getById(termId);

        if (!term) {
            return res.status(404).send('Term not found');
        }

        res.send(toTermDto(term));
    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};
