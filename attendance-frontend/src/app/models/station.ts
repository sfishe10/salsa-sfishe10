import {StationGroup} from './station-group';
import {StationPacket} from './station-packet';

export interface Station {
  stationId: number;
  title: string;
  description: string;
  maxFailed: number;
  level: number;
  class: number;
  groups: StationGroup[];
  packets: StationPacket[];
}
