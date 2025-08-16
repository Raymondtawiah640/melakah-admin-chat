import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatView } from '../chat-view/chat-view';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ChatView, FormsModule],
  templateUrl: './chat-dashboard.html',
  styleUrls: ['./chat-dashboard.css']
})
export class ChatDashboard implements OnInit {
  @Input() chats: any[] = [];            // ✅ Add this
  @Input() selectedChat: any = null;     // ✅ Add this
  @Input() searchQuery: string = '';     // Optional if you want filtering

  constructor() {}

  ngOnInit() {}
  
  selectChat(chat: any) {
    this.selectedChat = chat;
  }
}
