import { inject, Injectable } from '@angular/core';
import { WebsocketService } from '../../../shared/websocket/websocket.service';
import { AuthStore } from '../../../core/auth/store/auth.store';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}
  private wsService = inject(WebsocketService);
  private ws = this.wsService.getWebSocket();
  private readonly authStore = inject(AuthStore);
  sendChatMessage(message: any) {
    this.ws.send(
      JSON.stringify({ ...message, name: this.authStore.user().name })
    );
  }
}
