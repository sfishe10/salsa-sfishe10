import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Station} from '../models/station';
import {StationGroup} from '../models/station-group';
import {StationItem} from '../models/station-item';

@Injectable({
  providedIn: 'root'
})
export class StationsService {
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

  public addStationGroup(stationId: number): Observable<StationGroup> {
    const url = this.baseUrl + `/stations/${stationId}/addGroup`;
    return this.http.put<StationGroup>(url, {})
  }

  public addStationItem(groupId: number): Observable<StationItem> {
    const url = this.baseUrl + `/stations/group/${groupId}/addItem`;
    return this.http.put<StationItem>(url, {})
  }
}
