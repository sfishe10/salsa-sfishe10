import {StationGroup} from './station-group';

export interface Station {
  stationId: number;
  title: string;
  description: string;
  maxFailed: number;
  level: number;
  class: number;
  groups: StationGroup[];
}
