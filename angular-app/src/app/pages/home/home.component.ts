import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private router = inject(Router);
  private authStore = inject(AuthStore);
  
  isAuthenticated = computed(() => this.authStore.isAuthenticated());
  
  navigateToJobs() {
    this.router.navigate(['/jobs']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  
  navigateToDashboard() {
    if (this.authStore.isApplicant()) {
      this.router.navigate(['/applicant/dashboard']);
    } else if (this.authStore.isRecruiter()) {
      this.router.navigate(['/recruiter/dashboard']);
    }
  }
}
