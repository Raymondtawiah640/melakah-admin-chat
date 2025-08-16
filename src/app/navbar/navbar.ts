import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth'; // your auth service
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  sidebarOpen = true;

  counts = {
    incoming_chats: 0,
    active_chats: 0,
    starred_chats: 0
  };

  private apiUrl = 'http://localhost:4300/api'; // backend URL
  private adminId = 1; // admin ID
  private refreshSub: Subscription | undefined;

  constructor(private auth: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadChatCounts();

    // Auto-refresh every 10 seconds
    this.refreshSub = interval(10000).subscribe(() => this.loadChatCounts());
  }

  ngOnDestroy() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  loadChatCounts() {
    this.http.get<any>(`${this.apiUrl}/chat-counts.php?admin_id=${this.adminId}`)
      .subscribe({
        next: res => {
          if (res.success && res.counts) {
            this.counts = {
              incoming_chats: res.counts.incoming_chats ?? 0,
              active_chats: res.counts.active_chats ?? 0,
              starred_chats: res.counts.starred_chats ?? 0
            };
          }
        },
        error: err => console.error('Failed to load chat counts', err)
      });
  }
}
