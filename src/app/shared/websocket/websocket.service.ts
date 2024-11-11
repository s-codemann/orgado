import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  parseMessage(ev: MessageEvent<any>) {
    const data = JSON.parse(ev.data);
    if (data.type && data.type === 'Buffer') {
      const decoder = new TextDecoder('UTF-8');
      const b = new Uint8Array(data.data);
      return JSON.parse(decoder.decode(b));
    } else {
      return data;
    }
  }
  emit(event: string, payload: any) {
    this.webSocketConnection.send(JSON.stringify(event, payload));
  }
  chatMessages!: WritableSignal<any>;
  constructor() {
    this.chatMessages = signal(new Array([]));
    this.webSocketConnection = this.connectWebSocket();
    this.webSocketConnection.onmessage = (ev) => {
      const message = this.parseMessage(ev);
      const socketMsgEv = new CustomEvent(message.event, {
        detail: message.payload,
      });
      this.webSocketConnection.dispatchEvent(socketMsgEv);
      return;
    };
    this.initListeners();
  }
  onChatMessage = (ev: any) => {
    this.chatMessages.update((msgs) => [...msgs, ev.detail]);
  };
  webSocketConnection: WebSocket;

  connectWebSocket() {
    return new WebSocket('ws://' + environment.websocketUrl);
  }
  initListeners() {
    this.webSocketConnection.addEventListener(
      'chat-message',
      this.onChatMessage
    );
  }

  getWebSocket() {
    return this.webSocketConnection;
  }
}
