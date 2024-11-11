import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  parseMessage(ev: MessageEvent<any>) {
    console.log('RECEIVED DATA: ', JSON.parse(ev.data));
    // const data = JSON.parse(ev.data).message;
    const data = JSON.parse(ev.data);
    console.log(data);
    console.log(ev);
    if (data.type && data.type === 'Buffer') {
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
      return data;
    }
  }
  emit(event: string, payload: any) {
    // this.webSocketConnection.send();
    this.webSocketConnection.send(JSON.stringify(event, payload));
  }
  chatMessages!: WritableSignal<any>;
  constructor() {
    this.chatMessages = signal(new Array([]));
    console.log('chatmessages after set:');
    console.log(this.chatMessages, this.chatMessages());
    this.webSocketConnection = this.connectWebSocket();
    this.webSocketConnection.onmessage = (ev) => {
      const message = this.parseMessage(ev);
      const socketMsgEv = new CustomEvent(message.event, {
        detail: message.payload,
      });
      this.webSocketConnection.dispatchEvent(socketMsgEv);
      return;
      // this.chatMessages.update((messages) => [...messages, message]);
    };
    this.initListeners();
  }
  onChatMessage = (ev: any) => {
    console.log('MSGS', this.chatMessages);
    console.log('MSGS: ', this.chatMessages());
    this.chatMessages.update((msgs) => [...msgs, ev.detail]);
  };
  webSocketConnection: WebSocket;

  connectWebSocket() {
    return new WebSocket('ws://' + environment.websocketUrl);
  }
  initListeners() {
    this.webSocketConnection.addEventListener(
      'chat-message',
      this.onChatMessage //(ev: any) => {
      // console.log('CHAT MESSAGE LISTENER');
      // console.log('FISCHEV MSG', ev.detail);
      // }
    );
  }

  getWebSocket() {
    return this.webSocketConnection;
  }
}
