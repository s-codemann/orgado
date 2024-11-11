import { Component, inject, OnInit } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { buffer, concatMap, EMPTY, map, switchAll, switchMap } from 'rxjs';
import { HomeScreenComponent } from './home/home-screen/home-screen.component';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { NotificationService } from './service/notification.service';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { fromBottomAnimation } from './animations';
import { ChatComponent } from './feature/chat/chat.component';
import { environment } from '../environments/environment.development';
import { AuthStore } from './core/auth/store/auth.store';
import { AppLayoutService } from './core/layout/app-layout.service';

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
  constructor(private layoutService: AppLayoutService) {}
  private contexts = inject(ChildrenOutletContexts);
  NS = inject(NotificationService);
  private dateAdapter = inject(DateAdapter);
  swPush = inject(SwPush);
  httpClient = inject(HttpClient);
  todos$ = this.httpClient.get('https://jsonplaceholder.typicode.com/todos/1');
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
    this.httpClient
      .post(environment.backendUrl + '/login', {
        username: 'sasa',
        password: 'fisch',
      })
      .subscribe((v) => console.log(v));
    // const socket = new WebSocket('ws://localhost:3000/websocket');
    // setInterval(() => console.log('WSOCKET', socket), 10000);
    // setInterval(
    //   () => socket.send(JSON.stringify({ what: 'is this msg?' })),
    //   5000
    // );
    // console.log('WEBSOCKET: ', socket);
    this.dateAdapter.setLocale('de-de');

    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('SW NOTIFICATION: ', action, notification);
    });
    this.swPush.messages.subscribe((m) => {
      console.log('SW MESSAGE: ', m);
    });
    this.todos$.pipe().subscribe((val) => {
      console.log(val);
    });
    console.log('PUSH SUB: ');
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
    // this.swPush.subscription.subscribe((s) => {
    //   if (!s) {
    //     console.log('WEB PUSH SUBSCRIBING: ');
    //     this.NS.requestSubscription();
    //   } else {
    //     console.log('already subbed:', s);
    //   }
    // });

    // setTimeout(() => {
    // document.querySelector('button')?.click();
    //   console.log(
    //     'COLOR:',
    //     document.head
    //       .querySelector('meta[name="theme-color"')
    //       ?.setAttribute('content', '#ffffff')
    //   );
    // }, 2000);
    const ev = new Event('beforeinstallprompt');
    // window.addEventListener('pointerdown', this.requestFullScreen);
    // setTimeout(() => {
    //   window.dispatchEvent(ev);
    // }, 2000);
    // document.body.addEventListener('click', () => {});
  }
}
