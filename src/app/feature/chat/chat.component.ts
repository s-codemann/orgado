import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  viewChildren,
  WritableSignal,
} from '@angular/core';
import { ChatService } from './service/chat.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WebsocketService } from '../../shared/websocket/websocket.service';
import { AuthStore } from '../../core/auth/store/auth.store';
import { JsonPipe } from '@angular/common';
import { ChatStore } from './store/chat.store';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule, JsonPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewInit {
  protected readonly authStore = inject(AuthStore);
  private messagesContainer =
    viewChild<ElementRef<HTMLDivElement>>('messagesContainer');
  private messageRefs = viewChildren<ElementRef<HTMLDivElement>>('msg');
  private chatService = inject(ChatService);
  private messageField = viewChild('currentMessageField');
  private wsService = inject(WebsocketService);
  public minified = signal(true);
  public showGroups = signal(true);
  //  computed(() => {
  //   this.chatStore.activatedGroups();
  //   return false;
  // });
  protected hideGroups = effect(
    () => {
      this.chatStore.activeGroups();
      this.showGroups.set(false);
      console.log('ACTIVE GROUPS EFFECT; ', this.chatStore.activeGroups());
    },
    { allowSignalWrites: true }
  );
  protected readonly chatStore = inject(ChatStore);
  @HostListener('keydown', ['$event'])
  handleEv(ev: any) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      console.log('SEND MESSAGE: ' + this.currentMessage());
      this.sendCurrentMessage();
    }
  }
  seeLastMessage = effect(() => {
    if (this.minified()) {
      return;
    }
    this.messageRefs();
    const msgsContainer = this.messagesContainer();
    msgsContainer && (msgsContainer.nativeElement.scrollTop = 1000000);
  });
  onOpenChat = effect(() => {
    this.minified();
    console.log('MSGREFS', this.messageRefs());
    // const ms = new MutationObserver((entries) => {
    //   entries.forEach((e) => {
    //     console.log('MUT OBS: ', e);
    //   });
    // });
    // const os = new ResizeObserver((entries) => {
    //   entries.forEach((e) => {
    //     console.log('OBSERVED: ', e);
    //   });
    // });
    // if (!this.messagesContainer()) {
    //   console.log('no container');
    //   return;
    // }
    // os.observe(this.messagesContainer()?.nativeElement!);
    // ms.observe(this.messagesContainer()?.nativeElement!, { childList: true });
  });
  chatGroups = this.chatService.getChatGroups()! as Signal<any>;
  ngOnInit(): void {
    this.chatStore.initialize();
  }
  ngAfterViewInit(): void {
    console.log('MSGREFS', this.messageRefs());
    // this.messagesContainer;
  }
  t = effect(() => {
    this.wsService.chatMessages();
    console.log('NEW MSGs');
    const container = this.messagesContainer();
    // setTimeout(() => {
    container && (container.nativeElement.scrollTop = 10000);
    // }, 10);
  });
  scrollToLastMessage = effect(() => {
    console.log('scroll', this.wsService.chatMessages());
    this.wsService.chatMessages();
    const container = this.messagesContainer();
    container && (container.nativeElement.scrollTop = 10000);
    console.log('CONTAINERSCROLLTOP,', container?.nativeElement.scrollTop);
    // }, 1000);

    // const msgContainer = this.messagesContainer();
    // if (msgContainer) {
    //   console.log('SE CONTAINER', msgContainer);
    // }
  });
  messages = this.wsService.chatMessages;
  currentMessage = signal('');
  // showGroups = "fisch";
  sendCurrentMessage() {
    this.chatService.sendChatMessage({ chatMessage: this.currentMessage() });
    this.currentMessage.set('');
  }
}
