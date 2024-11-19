import { inject, Injectable } from '@angular/core';
import { WebsocketService } from '../../../shared/websocket/websocket.service';
import { AuthStore } from '../../../core/auth/store/auth.store';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { map, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {
    // this.chatGroups$.subscribe((c) => {
    //   console.log('GOT GROUPS: ', c);
    // });
  }
  private wsService = inject(WebsocketService);
  private http = inject(HttpClient);
  private ws = this.wsService.getWebSocket();
  private readonly authStore = inject(AuthStore);

  chatGroups$ = toSignal(
    this.http
      .get(environment.backendUrl + '/ug')
      .pipe
      // map((v) => new Map(v as any[])),
      // tap((g) => console.log('GROUPS: ', g, g.entries))
      ()
  );
  getGroups() {
    return this.http.get(environment.backendUrl + '/ug');
  }

  getChatGroups() {
    return this.chatGroups$;
  }
  sendChatMessage(message: any) {
    const builtMessagePayload = {
      ...message,
      name: this.authStore.user().name,
    };
    this.wsService.emit('test-msg', builtMessagePayload);
    // this.ws.send(

    // );
  }
}
