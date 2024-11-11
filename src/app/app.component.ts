import { Component, inject, OnInit } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { concatMap, EMPTY } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { fromBottomAnimation } from './core/layout/animations/animations';
import { ChatComponent } from './feature/chat/chat.component';
import { environment } from '../environments/environment.development';
import { AuthStore } from './core/auth/store/auth.store';
import { AppLayoutService } from './core/layout/app-layout.service';
import { NotificationService } from './core/notification/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [provideNativeDateAdapter()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fromBottomAnimation],
})
export class AppComponent implements OnInit {
  constructor() {}
  private contexts = inject(ChildrenOutletContexts);
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
            return EMPTY;
          }
        })
      )
      .subscribe();
    const ev = new Event('beforeinstallprompt');
  }
}
