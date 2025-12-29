import {plainToInstance} from "class-transformer";
import {Term} from "../entities/term.entity";
import {TermDto} from "../dto/term.dto";

export function toTermDto(term: Term): TermDto {
    const plainObj = {
        termId: term.termId,
        termName: term.termName,
        startDate: term.startDate,
        endDate: term.endDate,
    };

    return plainToInstance(TermDto, plainObj, { excludeExtraneousValues: true });
}
