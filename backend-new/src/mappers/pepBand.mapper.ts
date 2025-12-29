import {plainToInstance} from "class-transformer";
import {PepBand} from "../entities/pep-band.entity";
import {PepBandDto} from "../dto/pep-band.dto";

export function toPepBandDto(pepBand: PepBand): PepBandDto {
    const plainObj = {
        bandId: pepBand.bandId,
        displayName: pepBand.displayName
    };

    return plainToInstance(PepBandDto, plainObj, { excludeExtraneousValues: true });
}
