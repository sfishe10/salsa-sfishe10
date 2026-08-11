import {Member} from './member';
import {Station} from './station';
import {EvaluationItem} from './evaluation-item';
import {User} from './user';

export interface Evaluation {
  evalId: number,
  member: Member,
  evaluator: User,
  station: Station,
  passed: boolean,
  evalTime: Date,

  items: EvaluationItem[]
}
