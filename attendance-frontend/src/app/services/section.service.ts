import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Member} from '../models/member';
import {EventAttendanceMemberPage} from '../models/event-attendance-member-page';
import {environment} from '../../environments/environment';
import {Section} from '../models/section';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  baseUrl = environment.apiURL + '/mb-attendance';

  constructor(private http: HttpClient) {}

  public getSectionById(id: number): Observable<Section> {
    const url = this.baseUrl + `/sections/${id}`;
    return this.http.get<Section>(url);
  }
}
