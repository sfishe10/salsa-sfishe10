import {StationGroup} from './station-group';

export interface Station {
  stationId: number;
  description: string;
  maxFailed: number;
  level: number;
  class: number;
  groups: StationGroup[];
}
