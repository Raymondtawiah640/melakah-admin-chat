import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private adminUser: { id: number, username: string, role: string } | null = null;

  constructor() { 
    this.loadAdminFromStorage(); // auto-load admin on service init
  }

  // Log in admin and persist to localStorage
  login(user: { id: number, username: string, role: string }) {
    this.loggedIn = true;
    this.adminUser = user;
    localStorage.setItem('admin', JSON.stringify(user));
  }

  // Log out admin and remove from localStorage
  logout() {
    this.loggedIn = false;
    this.adminUser = null;
    localStorage.removeItem('admin');
  }

  // Check if admin is logged in
  isLoggedIn(): boolean {
    return this.loggedIn || !!localStorage.getItem('admin');
  }

  // Get the full admin object
  getAdmin(): { id: number, username: string, role: string } | null {
    return this.adminUser;
  }

  // Get numeric admin ID
  getAdminId(): number | null {
    return this.adminUser ? this.adminUser.id : null;
  }

  // Private helper: load admin from localStorage on service init
  private loadAdminFromStorage() {
    const user = localStorage.getItem('admin');
    if (user) {
      this.adminUser = JSON.parse(user);
      this.loggedIn = true;
    }
  }
}
