import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Station} from '../models/station';

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
}
