import { Routes } from '@angular/router';
import { HomeScreenComponent } from './home/home-screen/home-screen.component';
import { OverlayComponent } from './feature/common/overlay/overlay/overlay.component';
import { CalendarViewComponent } from './feature/calendar-view/calendar-view.component';
import { ChatComponent } from './feature/chat/chat.component';
import { LoginComponent } from './core/auth/login/login.component';
import { isAuthenticatedGuard } from './core/auth/router/isAuthenticated.guards';

export const routes: Routes = [
  {
    path: '',
    component: HomeScreenComponent,
    canActivate: [isAuthenticatedGuard],
    data: { animation: 'fadeFromBottom' },
    // pathMatch: 'full',
    // loadComponent: () =>
    //   import('./home/home-screen/home-screen.component').then(
    //     (x) => x.HomeScreenComponent
    //   ),
  },
  {
    path: '',
    component: ChatComponent,
    data: { animation: 'fadeFromBottom' },
    outlet: 'overlay',
    // pathMatch: 'full',
    // loadComponent: () =>
    //   import('./home/home-screen/home-screen.component').then(
    //     (x) => x.HomeScreenComponent
    //   ),
  },
  {
    path: 'calendar',
    component: CalendarViewComponent,
    data: { animation: 'calendarPage' },
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  //   {
  // path: '',
  // component: OverlayComponent,
  // outlet: 'overlay',
  //   },
];
