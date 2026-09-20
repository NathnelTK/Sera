import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '../../stores/auth.store';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
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
  showPassword = signal(false);

  // Form getters for template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

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
    // Honour a returnUrl set by the auth guard (e.g. "apply" deep-links), but only
    // accept safe in-app paths to avoid open-redirects.
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      this.router.navigateByUrl(returnUrl);
      return;
    }
    if (this.authStore.isApplicant()) {
      this.router.navigate(['/applicant/dashboard']);
    } else if (this.authStore.isRecruiter()) {
      this.router.navigate(['/recruiter/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
