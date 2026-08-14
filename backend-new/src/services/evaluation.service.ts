import {EvaluationRepository} from "../repositories/evaluation.repository";
import {Evaluation} from "../entities/evaluation.entity";
import {Member} from "../entities/member.entity";
import {Station} from "../entities/station.entity";
import {EvaluationItem} from "../entities/evaluation-item.entity";
import {StationRepository} from "../repositories/station.repository";
import {NewEvaluationDto} from "../dto/new-evaluation.dto";
import {MemberStationStatusDto} from "../dto/member-station-status.dto";
import {EvaluationDto} from "../dto/evaluation.dto";
import {StationItem} from "../entities/station-item.entity";
import {User} from "../entities/user.entity";
import {getAllStationsProgress, getSectionStationsProgress} from "../controllers/evaluations/selector";

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

    public async getAllStationsProgress(termId: number): Promise<MemberStationStatusDto[]> {
        const statuses: MemberStationStatusDto[] = await this.evaluationRepository.getStationsProgress(termId);

        return statuses;
    }

    public async getSectionStationsProgress(termId: number, sectionId: number): Promise<MemberStationStatusDto[]> {
        const statuses: MemberStationStatusDto[] = await this.evaluationRepository.getStationsProgress(termId, sectionId);

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
        newEvaluation.evaluator = {userId: newEvalDto.evaluatorId} as User;
        newEvaluation.station = {stationId: newEvalDto.stationId} as Station;
        newEvaluation.evalTime = new Date();
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

    public async submitEvaluation(evalDto: EvaluationDto): Promise<Evaluation> {
        let numFailed = 0;

        for (const item of evalDto.items) {
            let updatedItem = new EvaluationItem();

            updatedItem.evalId = evalDto.evalId;
            updatedItem.itemId = item.stationItem.itemId;
            updatedItem.status = item.status;

            await this.evaluationRepository.saveItem(updatedItem);

            if (!item.status) numFailed++;
        }

        const evaluation = await this.evaluationRepository.findById(evalDto.evalId);

        // in case the person who finished the evaluation is different from the person who started it
        evaluation.evaluator = {userId: evalDto.evaluator.userId} as User;

        evaluation.passed = numFailed <= evaluation.station.maxFailed;

        await this.evaluationRepository.save(evaluation);

        return evaluation;
    }

    public async saveEvaluation(evalDto: EvaluationDto): Promise<Evaluation> {
        for (const item of evalDto.items) {
            let updatedItem = new EvaluationItem();

            updatedItem.evalId = evalDto.evalId;
            updatedItem.itemId = item.stationItem.itemId;
            updatedItem.status = item.status;

            await this.evaluationRepository.saveItem(updatedItem);
        }

        const evaluation = await this.evaluationRepository.findById(evalDto.evalId);

        // in case the person who saved the evaluation is different from the person who started it
        evaluation.evaluator = {userId: evalDto.evaluator.userId} as User;

        evaluation.passed = null;

        await this.evaluationRepository.save(evaluation);

        return evaluation;
    }

    public async deleteEvaluation(evalId: number): Promise<boolean> {
        const evaluation = await this.evaluationRepository.findById(evalId);

        for (const item of evaluation.items) {
            await this.evaluationRepository.deleteItem(item.evalId, item.itemId);
        }

        const result = await this.evaluationRepository.deleteEval(evalId);

        return !!result;
    }
}