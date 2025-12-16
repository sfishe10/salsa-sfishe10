import {PepBandRepository} from "../repositories/pep-band.repository";
import {PepBand} from "../entities/pep-band.entity";
import {toPepBandDto} from "../mappers/pepBand.mapper";
import {PepBandDto} from "../dto/pep-band.dto";

export class PepBandService {
    private pepBandRepository: PepBandRepository;

    constructor(pepBandRepository?: PepBandRepository) {
        this.pepBandRepository = pepBandRepository ?? new PepBandRepository();
    }

    // TODO: probably don't need this
    // public async getById(pepBandId: string): Promise<PepBandDto> {
    //     const pepBand: PepBand | null =
    //         await this.pepBandRepository.findById(pepBandId);
    //
    //     if (!pepBand) {
    //         throw new Error('Pep band not found');
    //     }
    //
    //     return toPepBandDto(pepBand);
    // }

    public async getAll(): Promise<PepBandDto[]> {
        const pepBands: PepBand[] =
            await this.pepBandRepository.findAll();

        const pepBandDtos: PepBandDto[] = pepBands.map(band => toPepBandDto(band));

        return pepBandDtos;
    }
}