import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AuthStore } from '../../../stores/auth.store';
import { ApplicationsStore } from '../../../stores/applications.store';
import { InterviewsStore } from '../../../stores/interviews.store';
import { NotificationsStore } from '../../../stores/notifications.store';
import { VerificationStore } from '../../../stores/verification.store';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private router = inject(Router);
  private authStore = inject(AuthStore);
  private applicationsStore = inject(ApplicationsStore);
  private interviewsStore = inject(InterviewsStore);
  private notificationsStore = inject(NotificationsStore);
  private verificationStore = inject(VerificationStore);

  // Signals from stores
  currentUser = computed(() => this.authStore.currentUser());
  isAuthenticated = computed(() => this.authStore.isAuthenticated());

  // Identity verification (Fayda)
  isVerified = computed(() => this.verificationStore.isApproved());
  verificationPending = computed(() => this.verificationStore.isPending());
  
  // Application stats
  totalApplications = computed(() => this.applicationsStore.applications().length);
  pendingApplications = computed(() => this.applicationsStore.pendingApplications().length);
  acceptedApplications = computed(() => this.applicationsStore.acceptedApplications().length);
  
  // Interview stats
  upcomingInterviews = computed(() => this.interviewsStore.upcomingInterviews());
  totalInterviews = computed(() => this.interviewsStore.interviews().length);
  
  // Notification stats
  unreadNotifications = computed(() => this.notificationsStore.unreadCount());
  
  // Loading states
  isLoadingApplications = computed(() => this.applicationsStore.isLoading());
  isLoadingInterviews = computed(() => this.interviewsStore.isLoading());
  isLoadingNotifications = computed(() => this.notificationsStore.isLoading());
  
  constructor() {
    // Read the current Fayda verification status once (non-reactive — avoids signal writes in an effect).
    void this.verificationStore.loadStatus();

    // Load data on component init
    effect(() => {
      if (this.isAuthenticated()) {
        this.applicationsStore.loadMyApplications();
        this.interviewsStore.loadMyInterviews();
        this.notificationsStore.loadNotifications();
      }
    });
  }
  
  navigateToApplications() {
    this.router.navigate(['/applicant/applications']);
  }

  navigateToProfile() {
    this.router.navigate(['/applicant/profile']);
  }

  navigateToVerification() {
    this.router.navigate(['/applicant/verification']);
  }

  navigateToJobs() {
    this.router.navigate(['/jobs']);
  }

  navigateToInterviews() {
    this.router.navigate(['/applicant/interviews']);
  }

  navigateToDocuments() {
    this.router.navigate(['/applicant/documents']);
  }

  navigateToNotifications() {
    this.router.navigate(['/applicant/notifications']);
  }

  navigateToAiTools() {
    this.router.navigate(['/applicant/ai-tools']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
