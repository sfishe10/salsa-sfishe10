import { Routes } from '@angular/router';
import {MsalRedirectComponent} from '@azure/msal-angular';
import {ProfileComponent} from './profile/profile.component';
import {AttendanceFormComponent} from './attendance-form/attendance-form.component';
import {AdminComponent} from './admin/admin.component';
import {MemberPageComponent} from './member-page/member-page.component';
import {EventPageComponent} from './admin/event-page/event-page.component';
import {AttendancesComponent} from './admin/attendances/attendances.component';
import {UserPageComponent} from './admin/user-page/user-page.component';
import {EventListComponent} from './event-list/event-list.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {AuthzGuard} from './authz.guard';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {EventAttendancePageComponent} from './event-attendance-page/event-attendance-page.component';
import {SectionPageComponent} from './section-page/section-page.component';
import { AuthResponseComponent } from './utilities/auth-response.component';
import {StationPageComponent} from './station-page/station-page.component';
import {StationPacketPageComponent} from './station-packet-page/station-packet-page.component';
import {StationsMenuPageComponent} from './stations-menu-page/stations-menu-page.component';
import {MemberListPageComponent} from './member-list-page/member-list-page.component';
import {StationListPageComponent} from './station-list-page/station-list-page.component';
import {StationPacketListPageComponent} from './shared/station-packet-list-page/station-packet-list-page.component';
import {EvaluationPageComponent} from './evaluation-page/evaluation-page.component';

export const routes: Routes = [
  {
    path: 'auth-response',
    component: AuthResponseComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/events?type=upcoming',
        pathMatch: 'full',
      },
      {
        path: 'events',
        component: EventListComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'stations',
        component: StationsMenuPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'stations/evaluate',
        component: MemberListPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'stations-list',
        component: StationListPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'attendance/term/:id',
        component: AttendancesComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'attendance-form/:id',
        component: AttendanceFormComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'member/:id',
        component: MemberPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'user/:id',
        component: UserPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'event/:id',
        component: EventPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'section/:id',
        component: SectionPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'attendance/:id',
        component: EventAttendancePageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'station/:id',
        component: StationPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'station/:id/packets',
        component: StationPacketListPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'packet/:id',
        component: StationPacketPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'evaluation/:id',
        component: EvaluationPageComponent,
        canActivate: [AuthzGuard]
      }
    ]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: '/upcoming-events',
  },
];
