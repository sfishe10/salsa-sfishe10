import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, UrlTree, RouterStateSnapshot} from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import {SessionCacheService} from './services/session-cache.service';
import {firstValueFrom, Observable} from 'rxjs';
import {Constants} from './utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthzGuard implements CanActivate {
  constructor(
    private sessionCacheService: SessionCacheService,
    private router: Router,
    private msalGuard: MsalGuard
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // First run MsalGuard to ensure user is logged in
    const msalResult = await firstValueFrom(
      this.msalGuard.canActivate(route, state) as Observable<boolean | UrlTree>
    );

    if (!msalResult) {
      return msalResult; // will redirect to login if needed
    }

    let me = this.sessionCacheService.get(Constants.STORAGE_KEY_ME);
    if (!me) {
      await this.sessionCacheService.preload();
    }
    if (this.sessionCacheService.isOfficer()
        || this.sessionCacheService.isAdmin()
        || this.sessionCacheService.isAttendanceTaker()
        || this.sessionCacheService.isSectionLeader()
      || this.sessionCacheService.isLeadership()) {
      return true;
    }
    return this.router.parseUrl('/unauthorized');
  }
}
