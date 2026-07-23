import {Evaluation} from './evaluation';
import {StationItem} from './station-item';

export interface EvaluationItem {
  evaluation: Evaluation,
  stationItem: StationItem,
  status: boolean
}
