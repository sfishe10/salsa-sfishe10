import { Routes } from '@angular/router';
import {MsalGuard, MsalRedirectComponent} from '@azure/msal-angular';
import {ProfileComponent} from './profile/profile.component';
import {AttendanceFormComponent} from './attendance-form/attendance-form.component';
import {AdminComponent} from './admin/admin.component';
import {MemberPageComponent} from './admin/member-page/member-page.component';
import {EventPageComponent} from './admin/event-page/event-page.component';
import {AttendancesComponent} from './admin/attendances/attendances.component';
import {UserPageComponent} from './admin/user-page/user-page.component';
import {EventListComponent} from './event-list/event-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/events?type=upcoming',
    pathMatch: 'full',
  },
  {
    path: 'events',
    component: EventListComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'attendance/term/:id',
    component: AttendancesComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'attendance-form/:id',
    component: AttendanceFormComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'member/:id',
    component: MemberPageComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'user/:id',
    component: UserPageComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'event/:id',
    component: EventPageComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'auth-response',
    component: MsalRedirectComponent
  },
  {
    path: '**',
    redirectTo: '/upcoming-events',
  },
];
