import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {PepBand} from '../models/pep-band';

@Injectable({
  providedIn: 'root'
})
export class PepBandService {
  baseUrl = environment.apiURL + '/mb-attendance';

  constructor(private http: HttpClient) {}

  public getAllWithSectionMembers(sectionId: number, termId: number): Observable<PepBand[]> {
    const url = this.baseUrl + `/pepBands?sectionId=${sectionId}&termId=${termId}`;
    return this.http.get<PepBand[]>(url);
  }
}
