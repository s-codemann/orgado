import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}
  private wsService = inject(WebsocketService);
  private ws = this.wsService.getWebSocket();
  sendChatMessage(message: any) {
    this.ws.send(message);
  }
}
