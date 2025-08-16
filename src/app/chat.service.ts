import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Update this to your local backend URL
  private apiUrl = 'http://localhost:4200/'; // Use your backend server port

  constructor(private http: HttpClient) {}

  // Fetch messages between two users
  getMessages(sender_id: number, receiver_id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}get_messages.php?sender_id=${sender_id}&receiver_id=${receiver_id}`
    );
  }

  // Send a new message
  sendMessage(sender_id: number, receiver_id: number, message: string): Observable<any> {
    const formData = new FormData();
    formData.append('sender_id', sender_id.toString());
    formData.append('receiver_id', receiver_id.toString());
    formData.append('message', message);

    return this.http.post(`${this.apiUrl}send_message.php`, formData);
  }

  // Fetch all users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}get_users.php`);
  }
}
