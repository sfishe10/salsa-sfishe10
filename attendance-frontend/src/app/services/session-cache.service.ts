import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../utilities/constants';
import {firstValueFrom, Observable, of, switchMap, tap} from 'rxjs';
import {Section} from '../models/section';
import {PepBand} from '../models/pep-band';

@Injectable({
  providedIn: 'root'
})
export class SessionCacheService {
  baseUrl = "http://localhost:3001/api/mb-attendance";

  constructor(private http: HttpClient) {}

  public async preload(): Promise<void> {
    try {
      // Fetch current user info
      const response: any = await firstValueFrom(
        this.http.get('http://localhost:3001/api/me').pipe(
          tap((res: any) => {
            this.set(Constants.STORAGE_KEY_ME, res);

            const role = res.user.role;
            this.set(Constants.STORAGE_KEY_IS_ADMIN, role === Constants.ROLE_ADMIN);
            this.set(Constants.STORAGE_KEY_IS_OFFICER, role === Constants.ROLE_OFFICER);
            this.set(Constants.STORAGE_KEY_IS_ATTENDANCE_TAKER, role === Constants.ROLE_ATTENDANCE_TAKER);
          })
        )
      );

      // If user is a member, fetch their section members
      if (response.member?.section?.sectionId) {
        const sectionId = response.member.section.sectionId;
        this.set(Constants.STORAGE_KEY_SECTION_ID, sectionId);

        const sectionMembers: any = await firstValueFrom(
          this.http.get(`${this.baseUrl}/members/section/${sectionId}`)
        );
        this.set(Constants.STORAGE_KEY_SECTION_MEMBERS, sectionMembers);
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
    return this.get(Constants.STORAGE_KEY_IS_ADMIN);
  }

  public isOfficer() {
    return this.get(Constants.STORAGE_KEY_IS_OFFICER);
  }

  public isAttendanceTaker() {
    return this.get(Constants.STORAGE_KEY_IS_ATTENDANCE_TAKER)
  }

}
