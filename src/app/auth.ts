import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private adminUser: { username: string, role: string } | null = null;

  constructor() { }

  login(user: { username: string, role: string }) {
    this.isLoggedIn = true;
    this.adminUser = user;
    localStorage.setItem('admin', JSON.stringify(user)); // optional, persist login
  }

  logout() {
    this.isLoggedIn = false;
    this.adminUser = null;
    localStorage.removeItem('admin');
  }

  isAdmin(): boolean {
    if (this.isLoggedIn) return true;
    // Check localStorage if needed
    const user = localStorage.getItem('admin');
    if (user) {
      this.adminUser = JSON.parse(user);
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  getAdmin(): { username: string, role: string } | null {
    return this.adminUser;
  }
}
