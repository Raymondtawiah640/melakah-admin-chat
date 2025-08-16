import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth'; // your auth service

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  sidebarOpen = false;

  // Dynamic chat counts
  counts = {
    active_chats: 0,
    incoming_chats: 0,
    completed_chats: 0,   // optional, if you want to track
    starred_chats: 0      // optional
  };

  private apiUrl = 'http://localhost:4300/api'; // your backend URL
  private adminId = 1; // admin ID

  constructor(private auth: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadChatCounts();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.auth.logout();          // clear session or admin data
    this.router.navigate(['/']); // redirect to login
  }

  // Fetch chat counts from backend
  loadChatCounts() {
    this.http.get<any>(`${this.apiUrl}/chat-counts.php?admin_id=${this.adminId}`)
      .subscribe({
        next: res => {
          if (res.success) {
            this.counts.active_chats = res.active_chats;
            this.counts.incoming_chats = res.incoming_chats;
            this.counts.completed_chats = res.completed_chats ?? 0;
            this.counts.starred_chats = res.starred_chats ?? 0;
          }
        },
        error: err => console.error('Failed to load chat counts', err)
      });
  }
}
