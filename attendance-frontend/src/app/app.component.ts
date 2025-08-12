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

  eventType: string = 'upcoming'; // default

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    public sessionCacheService: SessionCacheService,
    public router: Router,
    private route: ActivatedRoute) { };

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

        if (account) {
          this.sessionCacheService.preload();
        }
      });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.route.queryParams.subscribe(params => {
          this.eventType = params['type'] || 'upcoming';
        });
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

  get pageTitle(): string {
    if (this.router.url.startsWith('/events')) {
      return this.eventType === 'upcoming' ? 'Upcoming Events' : 'Recent Events';
    }
    if (this.router.url === '/profile') return 'Profile';
    if (this.router.url.includes('/attendance-form')) return 'Enter Attendance';
    if (this.router.url.includes('/member')) return 'Member';
    if (this.router.url.includes('/user')) return 'User';
    if (this.router.url === '/event' || this.router.url.startsWith('/event/')) return 'Event';
    if (this.router.url.includes('/attendance/term')) return 'Attendance';
    if (this.router.url === '/admin') return 'Admin';
    return '';
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }


}
