import {Station} from './station';
import {StationItem} from './station-item';

export interface StationGroup {
  groupId: number;
  station: Station;
  title: string;
  level: number;
  items: StationItem[];
}
