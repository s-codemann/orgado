import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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
  sendSubToServer(sub: any) {
    return this.http.post(environment.backendUrl + '/get-sub', { sub });
  }
}
