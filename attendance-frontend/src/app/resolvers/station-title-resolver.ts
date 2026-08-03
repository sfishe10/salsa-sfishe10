import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {StationService} from '../services/station.service';
import {map} from 'rxjs';

export const stationTitleResolver: ResolveFn<string> = route => {
  const stationService = inject(StationService);
  const stationId = Number(route.paramMap.get('id'))

  return stationService.getStationById(stationId).pipe(
    map(station => `Station ${station.level + 1}`)
  )
};
