import {
  Component,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ChatService } from './service/chat.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WebsocketService } from '../../shared/websocket/websocket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private chatService = inject(ChatService);
  private messageField = viewChild('currentMessageField');
  private wsService = inject(WebsocketService);
  public minified = signal(true);
  @HostListener('keydown', ['$event'])
  handleEv(ev: any) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      console.log('SEND MESSAGE: ' + this.currentMessage());
      this.sendCurrentMessage();
    }
  }
  messages = this.wsService.chatMessages;
  currentMessage = signal('');
  sendCurrentMessage() {
    this.chatService.sendChatMessage(
      JSON.stringify({ chatMessage: this.currentMessage() })
    );
    this.currentMessage.set('');
  }
}
