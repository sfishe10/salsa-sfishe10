import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Evaluation} from '../models/evaluation';
import {NewEvaluation} from '../models/new-evaluation';
import {MemberStationStatus} from '../models/member-station-status';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  baseUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  public startEval(newEval: NewEvaluation): Observable<Evaluation> {
    const url = this.baseUrl + `/evaluations`;
    return this.http.post<Evaluation>(url, newEval)
  }

  public getEvalById(id: number): Observable<Evaluation> {
    const url = this.baseUrl + `/evaluations/${id}`;
    return this.http.get<Evaluation>(url);
  }

  public getMemberStationsStatus(memberId: number): Observable<MemberStationStatus[]> {
    const url = this.baseUrl + `/evaluations/member/${memberId}`;
    return this.http.get<MemberStationStatus[]>(url);
  }

  public getAllStationsProgress(termId: number): Observable<MemberStationStatus[]> {
    const url = this.baseUrl + `/evaluations/progress/term/${termId}`;
    return this.http.get<MemberStationStatus[]>(url);
  }

  public getSectionStationsProgress(termId: number, sectionId: number): Observable<MemberStationStatus[]> {
    const url = this.baseUrl + `/evaluations/progress/term/${termId}/section/${sectionId}`;
    return this.http.get<MemberStationStatus[]>(url);
  }

  public submitEval(evaluation: Evaluation): Observable<Evaluation> {
    const url = this.baseUrl + `/evaluations/submit`;
    return this.http.put<Evaluation>(url, evaluation);
  }

}
