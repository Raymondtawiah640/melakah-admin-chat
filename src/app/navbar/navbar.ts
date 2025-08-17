import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth';
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
  loggedIn = false;

  counts = {
    incoming_chats: 0,
    active_chats: 0,
    starred_chats: 0
  };

  private apiUrl = 'http://localhost:8000/api';
  adminId: number | null = null;
  private refreshSub: Subscription | undefined;

  constructor(private auth: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // ✅ Check login
    this.loggedIn = this.auth.isLoggedIn();

    if (!this.loggedIn) {
      this.resetCounts();
      console.warn('Admin not logged in. Redirecting to login page...');
      this.router.navigate(['/login']);
      return;
    }

    // ✅ Get numeric admin ID safely
    const id = this.auth.getAdminId();
    if (!id) {
      console.error('Admin ID not found. Cannot load chat counts.');
      this.resetCounts();
      return;
    }
    this.adminId = id;
    console.log('Admin ID:', this.adminId);

    // ✅ Load initial counts
    this.loadChatCounts();

    // ✅ Auto-refresh counts every 10s
    this.refreshSub = interval(10000).subscribe(() => this.loadChatCounts());
  }

  ngOnDestroy() {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.loggedIn = false;
    this.adminId = null;
    this.resetCounts();
    this.router.navigate(['/login']);
  }

  loadChatCounts() {
    if (!this.adminId) return;

    // Make sure we send numeric ID in request
    this.http.get<any>(`${this.apiUrl}/chat-counts.php?admin_id=${this.adminId}`)
      .subscribe({
        next: res => {
          if (res.success && res.counts) {
            this.counts = {
              incoming_chats: Number(res.counts.incoming_chats) || 0,
              active_chats: Number(res.counts.active_chats) || 0,
              starred_chats: Number(res.counts.starred_chats) || 0
            };
          } else {
            console.warn('No counts returned from backend:', res);
            this.resetCounts();
          }
        },
        error: err => {
          console.error('Failed to load chat counts', err);
          this.resetCounts();
        }
      });
  }

  private resetCounts() {
    this.counts = { incoming_chats: 0, active_chats: 0, starred_chats: 0 };
  }
}
