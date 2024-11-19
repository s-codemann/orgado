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
    const serializedEvent = JSON.stringify({ event, payload });
    this.webSocketConnection.send(serializedEvent);
  }

  chatMessages!: WritableSignal<any>;
  constructor() {
    this.chatMessages = signal(new Array());
    this.webSocketConnection = this.connectWebSocket();
    this.webSocketConnection.onopen = (e: any) => {
      this.emit('chat-connect', null);
      // th
      // console.log('WS CONNECT!');
      // this.webSocketConnection.
      // console.log(this.webSocketConnection.readyState);
    };
    // this.webSocketConnection.
    // this.webSocketConnection.on;
    this.webSocketConnection.onmessage = (ev) => {
      console.log(ev);
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
    // this.emit('test-msg', { test: 'test' });
    console.log('GOT MSG:', ev);
    this.chatMessages.update((msgs) => [...msgs, ev.detail]);
  };
  onChatConnect = (ev: any) => {
    console.log('GOT MSG CONN:', ev);
    // this.chatMessages.update((msgs) => [...msgs, ev.detail]);

    this.chatMessages.set(ev.detail);
  };
  webSocketConnection: WebSocket;

  connectWebSocket() {
    const ws = new WebSocket('ws://' + environment.websocketUrl);
    ws.onerror = (e) => console.log('WS ERR', e);
    ws.onclose = (e) => console.log('WS CLOSDE', e);
    return ws;
  }
  initListeners() {
    this.webSocketConnection.addEventListener(
      'chat-message',
      this.onChatMessage
    );
    this.webSocketConnection.addEventListener(
      'chat-history',
      this.onChatConnect
    );
  }

  getWebSocket() {
    return this.webSocketConnection;
  }
}
