import {Member} from './member';
import {Station} from './station';
import {EvaluationItem} from './evaluation-item';

export interface Evaluation {
  evalId: number,
  member: Member,
  evaluator: Member,
  station: Station,
  passed: boolean,
  evalTime: Date,

  items: EvaluationItem[]
}
