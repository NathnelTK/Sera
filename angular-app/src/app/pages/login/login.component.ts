import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  
  // Reactive Form
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  
  // Signals
  isLoading = computed(() => this.authStore.isLoading());
  error = computed(() => this.authStore.error());
  
  // Form getters for template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  
  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    const { email, password } = this.loginForm.value;
    if (!email || !password) return;
    
    const success = await this.authStore.login(email, password);
    
    if (success) {
      this.loginForm.reset();
      this.navigateBasedOnRole();
    }
  }
  
  private navigateBasedOnRole() {
    if (this.authStore.isApplicant()) {
      this.router.navigate(['/applicant/dashboard']);
    } else if (this.authStore.isRecruiter()) {
      this.router.navigate(['/recruiter/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
  
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  
  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
