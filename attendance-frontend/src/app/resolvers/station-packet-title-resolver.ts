import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {StationService} from '../services/station.service';
import {map} from 'rxjs';

export const stationPacketTitleResolver: ResolveFn<string> = route => {
  const stationService = inject(StationService);
  const packetId = Number(route.paramMap.get('id'))

  return stationService.getPacketById(packetId).pipe(
    map(packet => `Station ${packet.station.level + 1} - ${packet.title}`)
  )
};
