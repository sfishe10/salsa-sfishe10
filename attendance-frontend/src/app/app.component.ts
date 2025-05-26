import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService} from '@azure/msal-angular';
import {filter, Subject, takeUntil} from 'rxjs';
import {EventMessage, EventType, InteractionStatus, RedirectRequest} from '@azure/msal-browser';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {Router} from '@angular/router';
import {MatDivider} from '@angular/material/divider';
import {SessionCacheService} from './services/session-cache.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterLink,
    MatSidenavModule, MatIconButton, MatIcon, MatToolbar, MatDivider],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  loginDisplay = false;
  tokenExpiration: string = '';

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
      private authService: MsalService,
      private msalBroadcastService: MsalBroadcastService,
      private sessionCacheService: SessionCacheService,
      public router: Router) { };

  ngOnInit() {
    this.sessionCacheService.preload();

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });

    // Used for storing and displaying token expiration
    this.msalBroadcastService.msalSubject$.pipe(filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS)).subscribe(msg => {
      this.tokenExpiration=  (msg.payload as any).expiresOn;
      localStorage.setItem('tokenExpiration', this.tokenExpiration);
    });
  }

  // If the user is logged in, present the user with a "logged in" experience
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

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
