import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    // Replace with real authentication API call
    if (this.username === 'admin' && this.password === 'password') {
      this.router.navigate(['/chat-dashboard']);
    } else {
      alert('Invalid username or password');
    }
  }
}
