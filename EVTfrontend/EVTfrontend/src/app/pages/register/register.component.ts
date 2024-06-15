import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  nickname: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isAuthenticated: boolean = false;  // This remains false because registration does not mean authentication
  private authSub!: Subscription;

  constructor(public authService: AuthService, private router: Router) {
    console.log("RegisterComponent: Constructor initialized. AuthService injected.");
  }

  ngOnInit() {
    console.log("RegisterComponent: ngOnInit started. Subscribing to authService.isLoggedIn$.");
    // Only subscribe to check the authentication state, but do not set isAuthenticated here based on isLoggedIn
    this.authSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      console.log(`RegisterComponent: Received isLoggedIn$ update: ${isLoggedIn}`);
      if (isLoggedIn) {
        console.log("User is already logged in, navigating away from registration page.");
        this.router.navigate(['/home']);
      }
    });
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  signup() {
    console.log("Attempting to register with email:", this.email);
    if (!this.isValidEmail(this.email)) {
      console.log("Invalid email format.");
      this.errorMessage = 'Invalid email format';
      return;
    }

    this.authService.createUser(this.email, this.nickname, this.password).subscribe({
      next: () => {
        console.log('Registration successful, please log in.');
        this.router.navigate(['/login']);  // Redirect to login page after successful registration
      },
      error: error => {
        console.error('Registration failed:', error);
        this.errorMessage = error.error.message || 'Failed to register. Please try again.';
      }
    });
  }

  ngOnDestroy() {
    console.log("RegisterComponent: ngOnDestroy called, unsubscribing from auth subscription.");
    this.authSub.unsubscribe();
  }
}
