import { Routes } from '@angular/router';
import {MsalGuard, MsalRedirectComponent} from '@azure/msal-angular';
import {ProfileComponent} from './profile/profile.component';
import {AttendanceFormComponent} from './attendance-form/attendance-form.component';
import {UpcomingEventsComponent} from './upcoming-events/upcoming-events.component';
import {RecentEventsComponent} from './recent-events/recent-events.component';
import {AdminComponent} from './admin/admin.component';
import {MemberPageComponent} from './admin/member-page/member-page.component';
import {EventPageComponent} from './admin/event-page/event-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/upcoming-events',
    pathMatch: 'full',
  },
  {
    path: 'upcoming-events',
    component: UpcomingEventsComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'recent-events',
    component: RecentEventsComponent,
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
