import { Component, inject, OnInit } from '@angular/core';
import {
  ChildrenOutletContexts,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  catchError,
  concatMap,
  EMPTY,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { fromBottomAnimation } from './core/layout/animations/animations';
import { ChatComponent } from './feature/chat/chat.component';
import { environment } from '../environments/environment.development';
import { AuthStore } from './core/auth/store/auth.store';
import { AppLayoutService } from './core/layout/app-layout.service';
import { NotificationService } from './core/notification/notification.service';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    // RouterOutlet,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fromBottomAnimation],
})
export class AppComponent implements OnInit {
  constructor() {}
  private contexts = inject(ChildrenOutletContexts);
  private http = inject(HttpClient);
  private layoutService = inject(AppLayoutService);
  NS = inject(NotificationService);
  private dateAdapter = inject(DateAdapter);
  swPush = inject(SwPush);
  title = 'orgado';
  isFullScreen = false;
  // aStore = inject(AuthStore);

  getRouteAnimationData() {
    const aData =
      this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    // console.log('ANIMATIONDATA:', aData);

    return aData;
  }

  ngOnInit(): void {
    // this.http
    //   .post(
    //     environment.backendUrl + '/web-push-subscription',
    //     {
    //       endpoint: 'endpoint',
    //     },
    //     { responseType: 'json', withCredentials: true }
    //   )
    //   .pipe(catchError((e) => of(e)))
    //   .subscribe({
    //     next: (v) => console.log('SUCC', v),
    //     error: (err) => console.warn('WEBPUSHERR', err),
    //     complete: () => console.log('WEBPUSHCOMP:ETE'),
    //   });
    this.dateAdapter.setLocale('de-de');

    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('SW NOTIFICATION: ', action, notification);
    });
    this.swPush.messages.subscribe((m) => {
      console.log('SW MESSAGE: ', m);
    });
    // this.swPush.unsubscribe();
    // return;
    // this.swPush.unsubscribe();
    // return;
    this.swPush.subscription
      .pipe(
        concatMap((sub) => {
          if (!sub) {
            console.log('REQUESTING SUB: ');
            return this.NS.requestSubscription();
          } else {
            console.log('ALREADY SUBSCRIBED: ', sub);
            return this.NS.validateExistingClientSubscription();
          }
        }),
        tap((v) => console.log('SUB CHANGED: ', v))
      )
      .subscribe((v) => {
        console.log('SUBSCRIPTION CHECK RESULT: ', v);
      });
    const ev = new Event('beforeinstallprompt');
  }
}
