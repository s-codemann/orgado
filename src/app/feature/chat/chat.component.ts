import {
  Component,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ChatService } from '../../service/chat.service';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../../service/websocket.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
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
    console.log('CLICKI', ev.key);
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
