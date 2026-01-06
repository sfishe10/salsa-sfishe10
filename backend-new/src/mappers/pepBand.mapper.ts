import {plainToInstance} from "class-transformer";
import {PepBand} from "../entities/pep-band.entity";
import {PepBandDto} from "../dto/pep-band.dto";
import {toMemberDto} from "./member.mapper";

export function toPepBandDto(pepBand: PepBand): PepBandDto {
    const plainObj = {
        bandId: pepBand.bandId,
        displayName: pepBand.displayName,
        members: pepBand.members ? pepBand.members.map(member => toMemberDto(member)) : null
    };

    return plainToInstance(PepBandDto, plainObj, { excludeExtraneousValues: true });
}
