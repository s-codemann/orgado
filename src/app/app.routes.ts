import { Routes } from '@angular/router';
import { HomeScreenComponent } from './feature/home/home-screen/home-screen.component';
import { OverlayComponent } from './core/layout/common/overlay/overlay/overlay.component';
import { CalendarViewComponent } from './feature/calendar-view/calendar-view.component';
import { ChatComponent } from './feature/chat/chat.component';
import { LoginComponent } from './core/auth/login/login.component';
import { isAuthenticatedGuard } from './core/auth/router/isAuthenticated.guards';
import { inject } from '@angular/core';
import { AuthStore } from './core/auth/store/auth.store';
import { EditTodoComponent } from './feature/todo/components/edit-todo/edit-todo.component';

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
  { path: 'todos/:todo/edit', component: EditTodoComponent, outlet: 'overlay' },
  {
    path: 'calendar',
    component: CalendarViewComponent,
    canActivate: [isAuthenticatedGuard],
    data: { animation: 'calendarPage' },
  },
  {
    path: 'login',
    canDeactivate: [isAuthenticatedGuard],
    component: LoginComponent,
  },
  //   {
  // path: '',
  // component: OverlayComponent,
  // outlet: 'overlay',
  //   },
];
