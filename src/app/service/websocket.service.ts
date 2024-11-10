import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  parseMessage(ev: MessageEvent<any>) {
    console.log('RECEIVED DATA: ', JSON.parse(ev.data));
    const data = JSON.parse(ev.data).message;
    console.log(data);
    console.log(ev);
    if (data.type === 'Buffer') {
      const decoder = new TextDecoder('UTF-8');
      const b = new Uint8Array(data.data);
      console.log(
        'got buffer: ',
        data,
        'DECODED: ',
        JSON.parse(decoder.decode(b))
      );
      return JSON.parse(decoder.decode(b));
    } else {
      console.log('Got data: ', data);
    }
  }
  constructor() {
    this.webSocketConnection = this.connectWebSocket();
    this.webSocketConnection.onmessage = (ev) => {
      console.log('MSG FROM SERVER: ', ev);
      const message = this.parseMessage(ev);
      this.chatMessages.update((messages) => [...messages, message]);
      console.log('GOT MESSAGE: ', message);
    };
  }
  chatMessages = signal(new Array());
  webSocketConnection: WebSocket;

  connectWebSocket() {
    return new WebSocket('ws://' + environment.websocketUrl);
  }

  getWebSocket() {
    return this.webSocketConnection;
  }
}
