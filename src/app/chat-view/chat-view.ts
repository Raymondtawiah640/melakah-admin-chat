import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';

interface ChatMessage {
  sender_id: number;
  receiver_id: number;
  message: string;
}

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-view.html',
  styleUrls: ['./chat-view.css']
})
export class ChatView implements OnChanges {
  @Input() chat: any;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUserId = 1;

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat'] && this.chat) {
      this.loadMessages();
    }
  }

  loadMessages() {
    this.chatService.getMessages(this.currentUserId, this.chat.id)
      .subscribe((data: any) => {
        if (data && data.success) {
          this.messages = data.messages || [];
          setTimeout(() => this.scrollToBottom(), 100);
        }
      }, (error) => {
        console.error('Error fetching messages:', error);
      });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.currentUserId, this.chat.id, this.newMessage)
      .subscribe((data: any) => {
        if (data && data.success) {
          this.newMessage = '';
          this.loadMessages(); // reload messages after sending
        }
      }, (error) => {
        console.error('Error sending message:', error);
      });
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }
}
