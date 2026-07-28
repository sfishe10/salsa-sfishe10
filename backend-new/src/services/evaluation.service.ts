import {EvaluationRepository} from "../repositories/evaluation.repository";
import {Evaluation} from "../entities/evaluation.entity";
import {Member} from "../entities/member.entity";
import {Station} from "../entities/station.entity";
import {EvaluationItem} from "../entities/evaluation-item.entity";
import {StationRepository} from "../repositories/station.repository";
import {NewEvaluationDto} from "../dto/new-evaluation.dto";
import {MemberStationStatusDto} from "../dto/member-station-status.dto";

export class EvaluationService {
    private evaluationRepository: EvaluationRepository;
    private stationRepository: StationRepository;

    constructor(evaluationRepository?: EvaluationRepository,
                stationRepository?: StationRepository) {
        this.evaluationRepository = evaluationRepository ?? new EvaluationRepository();
        this.stationRepository = stationRepository ?? new StationRepository();
    }

    public async getById(id: number): Promise<Evaluation> {
        const evaluation: Evaluation = await this.evaluationRepository.findById(id);

        return evaluation;
    }

    public async getMemberStationsStatus(memberId: number): Promise<MemberStationStatusDto[]> {
        const statuses: MemberStationStatusDto[] = await this.evaluationRepository.getMemberStationsStatus(memberId);

        return statuses;
    }

    public async startEvaluation(newEvalDto: NewEvaluationDto): Promise<Evaluation> {
        // first check if there's an unfinished evaluation (passed == null)
        const existingEval = await this.evaluationRepository.findByMemberAndStationId(newEvalDto.memberId, newEvalDto.stationId);
        if (existingEval) {
            return existingEval;
        }

        // there are no unfinished evaluations, so start a new one
        let newEvaluation = new Evaluation();

        newEvaluation.member = {memberId: newEvalDto.memberId} as Member;
        newEvaluation.evaluator = {memberId: newEvalDto.evaluatorId} as Member;
        newEvaluation.station = {stationId: newEvalDto.stationId} as Station;
        newEvaluation.passed = null;

        await this.evaluationRepository.save(newEvaluation);

        const station = await this.stationRepository.findById(newEvalDto.stationId);

        for (let group of station.groups) {
            for (let item of group.items) {
                let newEvalItem = new EvaluationItem();

                newEvalItem.stationItem = item;
                newEvalItem.evaluation = newEvaluation;
                newEvalItem.status = false;

                await this.evaluationRepository.saveItem(newEvalItem);
            }
        }

        return newEvaluation;
    }
}