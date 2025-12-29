import {TermService} from "../../services/term.service";
import {TermDto} from "../../dto/term.dto";
import {plainToInstance} from "class-transformer";
import {Term} from "../../entities/term.entity";
import {toTermDto} from "../../mappers/term.mapper";

const termService: TermService = new TermService();

export const create = async (req: any, res: any) => {
    try {
        const termDto: TermDto = plainToInstance(TermDto, req.body);

        const savedTerm: Term = await termService.create(termDto);

        res.send(toTermDto(savedTerm));
    } catch (err: any) {
        console.error('A critical error occurred in terms.create():', err.message);
        return res.status(500).send(err.message);
    }
};

export const update = async (req: any, res: any) => {
    try {
        const termDto: TermDto = plainToInstance(TermDto, req.body);

        const updatedTerm: Term = await termService.update(termDto);

        res.send(toTermDto(updatedTerm));
    } catch (err: any) {
        console.error('A critical error occurred in terms.update():', err.message);
        return res.status(500).send(err.message);
    }
};

export const deleteTerm = async (req: any, res: any) => {
    try {
        const termId = req.params.id;

        await termService.delete(termId);

        res.status(200).send(null);
    } catch (err: any) {
        console.error('A critical error occurred in terms.deleteTerm():', err.message);
        return res.status(500).send(err.message);
    }
};
