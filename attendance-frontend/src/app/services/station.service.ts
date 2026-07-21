import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Station} from '../models/station';
import {StationPacket} from '../models/station-packet';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  baseUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  public getAllStations(): Observable<Station[]> {
    const url = this.baseUrl + `/stations`;
    return this.http.get<Station[]>(url)
  }

  public getStationById(id: number): Observable<Station> {
    const url = this.baseUrl + `/stations/${id}`;
    return this.http.get<Station>(url);
  }

  public updateStation(station: Station, deleteGroupIds: number[], deleteItemIds: number[]): Observable<Station> {
    const url = this.baseUrl + `/stations/${station.stationId}`;
    return this.http.put<Station>(url, {station, deleteGroupIds, deleteItemIds});
  }

  public getPacketById(id: number): Observable<StationPacket> {
    const url = this.baseUrl + `/stations/packets/${id}`;
    return this.http.get<StationPacket>(url);
  }

  public updatePacket(packet: StationPacket): Observable<StationPacket> {
    const url = this.baseUrl + `/stations/packets/${packet.packetId}`;
    return this.http.put<StationPacket>(url, packet);
  }

  public deletePacket(id: number): Observable<StationPacket> {
    const url = this.baseUrl + `/stations/packets/${id}`;
    return this.http.delete<StationPacket>(url);
  }
}
