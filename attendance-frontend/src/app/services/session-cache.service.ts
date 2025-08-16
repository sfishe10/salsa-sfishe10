import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../utilities/constants';
import {Observable, of, switchMap, tap} from 'rxjs';
import {Section} from '../models/section';
import {PepBand} from '../models/pep-band';

@Injectable({
  providedIn: 'root'
})
export class SessionCacheService {
  baseUrl = "http://localhost:3001/api/mb-attendance";

  constructor(private http: HttpClient) {}

  public preload() {
    this.http.get('http://localhost:3001/api/me').pipe(
      tap((response: any) => {
        // keep track of the logged-in user's role
        this.set(Constants.STORAGE_KEY_ME, response);
        const isAdmin = response.user.role === Constants.ROLE_ADMIN;
        this.set(Constants.STORAGE_KEY_IS_ADMIN, isAdmin);
        const isOfficer = response.user.role === Constants.ROLE_OFFICER;
        this.set(Constants.STORAGE_KEY_IS_OFFICER, isOfficer);
      }),
      switchMap((response: any) => {
        // if the user is a member (i.e. attendance taker), fetch the members of their section
        if (response.member?.section.sectionId) {
          const sectionId = response.member.section.sectionId;
          console.log(sectionId);
          this.set(Constants.STORAGE_KEY_SECTION_ID, sectionId);
          return this.http.get(`${this.baseUrl}/members/section/${sectionId}`);
        } else {
          return of(null); // User has no member object, skip section fetch
        }
      })
    ).subscribe(sectionMembers => {
      if (sectionMembers) {
        this.set(Constants.STORAGE_KEY_SECTION_MEMBERS, sectionMembers);
      }
    });

    this.getSections().subscribe(sections => {
      this.set(Constants.STORAGE_KEY_SECTIONS, sections);
    })

    this.getPepBands().subscribe(pepBands => {
      this.set(Constants.STORAGE_KEY_PEP_BANDS, pepBands);
    })

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

}
