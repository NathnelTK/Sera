import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRadioModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  
  // Reactive Form
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    role: ['Applicant', Validators.required]
  }, { validators: this.passwordMatchValidator });
  
  // Signals
  isLoading = computed(() => this.authStore.isLoading());
  error = computed(() => this.authStore.error());
  
  // Form getters for template
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get role() { return this.registerForm.get('role'); }
  
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }
  
  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    const { email, password, role } = this.registerForm.value;
    if (!email || !password || !role) return;
    
    const success = await this.authStore.register(email, password, role as 'Applicant' | 'Recruiter');
    
    if (success) {
      this.registerForm.reset();
      this.registerForm.patchValue({ role: 'Applicant' });
      this.router.navigate(['/login']);
    }
  }
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  
  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
