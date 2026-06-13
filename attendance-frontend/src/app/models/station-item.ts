import {StationGroup} from './station-group';

export interface StationItem {
  itemId: number;
  group: StationGroup;
  item: string;
  level: number;
  required: boolean;
}
