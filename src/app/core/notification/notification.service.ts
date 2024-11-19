import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import {
  catchError,
  EMPTY,
  exhaustMap,
  first,
  firstValueFrom,
  from,
  switchMap,
} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private swPush: SwPush, private http: HttpClient) {}

  serverPublicKey =
    'BCV-rSAWxLbJpapCmRD0p0HV4KF_B-yvDFgBgRlOek6PpZ2HSKUBxJ8gU8ktqBWyhppnfys3aM4_mrzjUxoDxN4';
  requestSubscription() {
    return from(
      this.swPush.requestSubscription({ serverPublicKey: this.serverPublicKey })
    ).pipe(
      switchMap((sub) => {
        return this.sendSubToServer(sub);
      })
    );
    // then((sub) => {
    //   console.log('SUBSCRIPTION: ', sub);
    //   return this.sendSubToServer(sub).subscribe();
    // });
  }

  validateExistingClientSubscription() {
    // const existing = await this.swPush.subscription);
    return this.swPush.subscription.pipe(
      first(),
      switchMap((sub) => {
        return this.http.post(
          environment.backendUrl + '/web-push-subscription',
          {
            endpoint: sub?.endpoint,
          },
          {
            responseType: 'text',
          }
        );
      }),
      catchError((e) => {
        console.log('ERROR CONFIRMING CLIENT SUBSCRIPTION: ', e);
        return from(this.swPush.unsubscribe())
          .pipe
          // exhaustMap(() => {
          //   console.log('UNSUBSCRIBED CLIENT SUB, REQUESTING NEW SUB');
          //   return this.requestSubscription();
          // })
          ();
        // return this.requestSubscription();
      })
    );
    // const existing2 = toSignal(this.swPush.subscription);
    // console.log('FUCK');
    // // console.log(existing2());
    // console.log('EXISTING SUB: ', existing);
    // return this.http.post(environment.backendUrl + '/web-push-subscription', {
    //   existing,
    // });
    // return this.http.get('/web-push-subscription');
  }

  sendSubToServer(sub: any) {
    return this.http.post(
      environment.backendUrl + '/get-sub',
      { sub },
      { responseType: 'text' }
    );
  }
}
