import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../../stores/auth.store';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private router = inject(Router);
  private authStore = inject(AuthStore);

  // Route is already protected by authGuard + recruiterGuard, so we just read the user.
  currentUser = computed(() => this.authStore.currentUser());

  navigateToJobs() {
    this.router.navigate(['/recruiter/jobs']);
  }

  navigateToCreateJob() {
    this.router.navigate(['/recruiter/jobs/create']);
  }

  navigateToInterviews() {
    this.router.navigate(['/recruiter/interviews']);
  }

  navigateToProfile() {
    this.router.navigate(['/recruiter/profile']);
  }

  navigateToNotifications() {
    this.router.navigate(['/recruiter/notifications']);
  }

  navigateToAiTools() {
    this.router.navigate(['/recruiter/ai-tools']);
  }
}
