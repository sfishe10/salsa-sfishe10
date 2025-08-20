import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, RouterLink, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService} from '@azure/msal-angular';
import {filter, Subject, take, takeUntil} from 'rxjs';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
  RedirectRequest
} from '@azure/msal-browser';
import {MatSidenavModule} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {SessionCacheService} from './services/session-cache.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatSidenavModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    public sessionCacheService: SessionCacheService,
    public router: Router) { };

  ngOnInit() {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(status => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        let account = this.authService.instance.getActiveAccount();
        if (!account) {
          const allAccounts = this.authService.instance.getAllAccounts();
          if (allAccounts.length > 0) {
            account = allAccounts[0];
            this.authService.instance.setActiveAccount(account);
          }
        }
      });
  }

  // // If the user is logged in, present the user with a "logged in" experience
  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  // Log the user in and redirect them if MSAL provides a redirect URI otherwise go to the default URI
  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  // Log the user out
  logout() {
    this.authService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
