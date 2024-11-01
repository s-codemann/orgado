import { Routes } from '@angular/router';
import { HomeScreenComponent } from './home/home-screen/home-screen.component';
import { OverlayComponent } from './feature/common/overlay/overlay/overlay.component';
import { CalendarViewComponent } from './feature/calendar-view/calendar-view.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeScreenComponent,
    // loadComponent: () =>
    //   import('./home/home-screen/home-screen.component').then(
    //     (x) => x.HomeScreenComponent
    //   ),
  },
  { path: 'calendar', component: CalendarViewComponent },
  //   {
  // path: '',
  // component: OverlayComponent,
  // outlet: 'overlay',
  //   },
];
