import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at?: string;
}

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-active-chats',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './active-chats.html',
  styleUrls: ['./active-chats.css']
})
export class ActiveChats implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  users: User[] = [];             // List of all users
  currentUserId: number | null = null;
  messages: Message[] = [];
  newMessage = '';
  senderId = 1;                   // Admin ID
  loading = false;

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  get currentUserName(): string {
    const user = this.users.find(u => u.id === this.currentUserId);
    return user ? user.name : 'Select a user';
  }

  getUsers() {
    this.http.get<any>(`${this.apiUrl}/get-users.php`).subscribe({
      next: res => {
        if (res.success) {
          this.users = res.users;
        }
      },
      error: err => console.error(err)
    });
  }

  selectUser(userId: number) {
    this.currentUserId = userId;
    this.getMessages();
  }

  getMessages() {
    if (!this.currentUserId) return;
    this.loading = true;
    this.http.get<any>(
      `${this.apiUrl}/get-messages.php?admin_id=${this.senderId}&user_id=${this.currentUserId}`
    ).subscribe({
      next: res => {
        if (res.success) {
          this.messages = res.messages;
        }
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentUserId) return;

    const localMsg: Message = {
      sender_id: this.senderId,
      receiver_id: this.currentUserId,
      message: this.newMessage,
      created_at: new Date().toISOString()
    };

    // Show message immediately
    this.messages.push(localMsg);
    this.newMessage = '';

    const payload = {
      sender_id: this.senderId,
      receiver_id: this.currentUserId,
      message: localMsg.message
    };

    this.http.post<any>(`${this.apiUrl}/send-message.php`, payload).subscribe({
      next: res => {
        if (!res.success) {
          console.warn('Failed to send message:', res.message);
          this.messages.pop();
        }
      },
      error: err => {
        console.error('Error sending message:', err);
        this.messages.pop();
      }
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch {}
  }
}
