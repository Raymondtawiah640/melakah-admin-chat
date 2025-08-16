import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth';

interface LoginResponse {
  success: boolean;
  message: string;
  admin?: { id: number; username: string };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';
  passwordVisible = false; // 🔑 toggle password visibility

  constructor(private auth: AuthService, private router: Router, private http: HttpClient) {}

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  login() {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.http.post<LoginResponse>('http://localhost:8000/api/admin-login.php', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success && res.admin) {
          const adminWithRole = { ...res.admin, role: 'admin' };
          this.auth.login(adminWithRole);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        this.errorMessage = 'Server error. Please try again.';
        console.error('Login error:', err);
      }
    });
  }
}
