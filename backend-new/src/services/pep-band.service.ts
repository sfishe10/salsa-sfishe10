import {PepBandRepository} from "../repositories/pep-band.repository";
import {PepBand} from "../entities/pep-band.entity";
import {toPepBandDto} from "../mappers/pepBand.mapper";
import {PepBandDto} from "../dto/pep-band.dto";
import {NotFoundError} from "../errors/not-found-error";

export class PepBandService {
    private pepBandRepository: PepBandRepository;

    constructor(pepBandRepository?: PepBandRepository) {
        this.pepBandRepository = pepBandRepository ?? new PepBandRepository();
    }

    public async getById(pepBandId: string): Promise<PepBand> {
        const pepBand: PepBand | null =
            await this.pepBandRepository.findById(pepBandId);

        if (!pepBand) {
            throw new NotFoundError('Pep band not found');
        }

        return pepBand;
    }

    public async getAll(sectionId?: number, termId?: number): Promise<PepBandDto[]> {
        const pepBands: PepBand[] =
            await this.pepBandRepository.findAll(sectionId, termId);

        const pepBandDtos: PepBandDto[] = pepBands.map(band => toPepBandDto(band));

        return pepBandDtos;
    }
}