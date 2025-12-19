import {TermService} from "../../services/term.service";
import {TermDto} from "../../dto/term.dto";
import {plainToInstance} from "class-transformer";
import {Term} from "../../entities/term.entity";
import {toTermDto} from "../../mappers/term.mapper";

const termService: TermService = new TermService();

export const create = async (req: any, res: any) => {
  const termDto: TermDto = plainToInstance(TermDto, req.body);

  const savedTerm: Term = await termService.create(termDto);

  res.send(toTermDto(savedTerm));
};

export const update = async (req: any, res: any) => {
    const termDto: TermDto = plainToInstance(TermDto, req.body);

    const updatedTerm: Term = await termService.update(termDto);

    res.send(toTermDto(updatedTerm));
};

export const deleteTerm = async (req: any, res: any) => {
  const termId = req.params.id;

  await termService.delete(termId);

  res.status(200).send(null);
};
