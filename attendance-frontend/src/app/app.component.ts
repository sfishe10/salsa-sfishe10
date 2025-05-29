import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService} from '@azure/msal-angular';
import {filter, Subject, take, takeUntil} from 'rxjs';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
  RedirectRequest,
  SilentRequest
} from '@azure/msal-browser';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {Router} from '@angular/router';
import {MatDivider} from '@angular/material/divider';
import {SessionCacheService} from './services/session-cache.service';
import {Constants} from './utilities/constants';
import {Member} from './models/member';

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

  public me: Member | null = null;


  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
      private authService: MsalService,
      private msalBroadcastService: MsalBroadcastService,
      private sessionCacheService: SessionCacheService,
      public router: Router) { };

  ngOnInit() {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(status => status === InteractionStatus.None),
        take(1)
      )
      .subscribe(() => {
        const account = this.authService.instance.getActiveAccount();
        if (account) {
          this.authService.instance.setActiveAccount(account);
          this.sessionCacheService.preload();
          this.me = this.sessionCacheService.get(Constants.STORAGE_KEY_ROLE);
        }
      });
  }

  // // If the user is logged in, present the user with a "logged in" experience
  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  // // Log the user in and redirect them if MSAL provides a redirect URI otherwise go to the default URI
  // login() {
  //   if (this.msalGuardConfig.authRequest && this.loginDisplay){
  //     // this.msalGuardConfig.authRequest.account = this.authService.instance.getAllAccounts()[0];
  //     this.authService.acquireTokenSilent({...this.msalGuardConfig.authRequest} as SilentRequest)
  //       .subscribe((response: AuthenticationResult) => {
  //         this.authService.instance.setActiveAccount(response.account);
  //         console.log(response.accessToken);
  //         console.log(this.authService.instance.getAllAccounts());
  //       });
  //   } else {
  //     this.authService.loginRedirect();
  //   }
  // }

  // Log the user out
  logout() {
    this.authService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }


}
