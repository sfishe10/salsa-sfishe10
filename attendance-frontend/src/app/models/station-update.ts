import {Station} from './station';

export interface StationUpdate {
  station: Station;
  deleteGroupIds: number[];
  deleteItemIds: number[];
}
