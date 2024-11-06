import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { buffer, concatMap, EMPTY, map, switchAll, switchMap } from 'rxjs';
import { AppLayoutService } from './service/app-layout.service';
import { HomeScreenComponent } from './home/home-screen/home-screen.component';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { NotificationService } from './service/notification.service';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeScreenComponent],
  providers: [provideNativeDateAdapter()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private layoutService: AppLayoutService) {}
  NS = inject(NotificationService);
  private dateAdapter = inject(DateAdapter);
  swPush = inject(SwPush);
  httpClient = inject(HttpClient);
  todos$ = this.httpClient.get('https://jsonplaceholder.typicode.com/todos/1');
  title = 'orgado';
  isFullScreen = false;
  // requestFullScreen = () => {
  //   document.body.requestFullscreen();
  //   this.isFullScreen = true;
  //   if (this.isFullScreen) {
  //     window.removeEventListener('pointerdown', this.requestFullScreen);
  //   }
  // };
  f() {
    document.documentElement.requestFullscreen({ navigationUI: 'hide' });
  }
  ngOnInit(): void {
    this.dateAdapter.setLocale('de-de');
    console.log('SWPUSH: ', this.swPush.isEnabled);
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
