import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

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
