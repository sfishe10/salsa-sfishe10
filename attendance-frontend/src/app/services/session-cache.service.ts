import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../utilities/constants';
import {firstValueFrom, Observable, tap} from 'rxjs';
import {Section} from '../models/section';
import {PepBand} from '../models/pep-band';
import {environment} from '../../environments/environment';
import {Utilities} from '../utilities/utilities';

@Injectable({
  providedIn: 'root'
})
export class SessionCacheService {
  baseUrl = environment.apiURL + '/mb-attendance';

  constructor(private http: HttpClient) {}

  public async preload(): Promise<void> {
    try {
      // Fetch current user info
      const response: any = await firstValueFrom(
        this.http.get(`${environment.apiURL}/me`, {
          withCredentials: true
        }).pipe(
          tap((res: any) => {
            this.set(Constants.STORAGE_KEY_ME, res);
          })
        )
      );

      // If user is a member, fetch their section members and term
      if (response.member) {
        const section = response.member.section;
        this.set(Constants.STORAGE_KEY_SECTION, section);

        this.set(Constants.STORAGE_KEY_IS_DRUMLINE_ATTENDANCE_TAKER,
          (response.user.role === Constants.ROLE_SECTION_LEADER
            || response.user.role === Constants.ROLE_ATTENDANCE_TAKER)
          && Utilities.isDrumline(response.member.section))

        const termId = response.member.term.termId;

        const sectionMembers: any = await firstValueFrom(
          this.http.get(`${this.baseUrl}/members/section/${section.sectionId}/term/${termId}`)
        );
        this.set(Constants.STORAGE_KEY_SECTION_MEMBERS, sectionMembers);

        const term = response.member.term;
        this.set(Constants.STORAGE_KEY_TERM, term);
      }

      // Fetch sections and pep bands in parallel
      const [sections, pepBands] = await Promise.all([
        firstValueFrom(this.getSections()),
        firstValueFrom(this.getPepBands())
      ]);

      this.set(Constants.STORAGE_KEY_SECTIONS, sections);
      this.set(Constants.STORAGE_KEY_PEP_BANDS, pepBands);

    } catch (err) {
      console.error('Error preloading session cache:', err);
    }
  }

  private getSections(): Observable<Section[]> {
    const url = this.baseUrl + '/sections';
    return this.http.get<Section[]>(url);
  }

  private getPepBands(): Observable<PepBand[]> {
    const url = this.baseUrl + '/pepBands';
    return this.http.get<PepBand[]>(url);
  }

  get(key: string): any {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  set(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }

  public isAdmin() {
    return this.get(Constants.STORAGE_KEY_ME).user?.role === Constants.ROLE_ADMIN;
  }

  public isOfficer() {
    return this.get(Constants.STORAGE_KEY_ME).user?.role === Constants.ROLE_OFFICER;
  }

  public isAttendanceTaker() {
    return this.get(Constants.STORAGE_KEY_ME).user?.role === Constants.ROLE_ATTENDANCE_TAKER;
  }

  public isSectionLeader() {
    return this.get(Constants.STORAGE_KEY_ME).user?.role === Constants.ROLE_SECTION_LEADER;
  }

  public isDrumlineAttendanceTaker() {
    return this.get(Constants.STORAGE_KEY_IS_DRUMLINE_ATTENDANCE_TAKER);
  }

}
