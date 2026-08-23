import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { JobsStore } from '../../stores/jobs.store';
import { Job } from '../../services/jobs.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private jobsStore = inject(JobsStore);
  
  // Search form
  searchForm = this.fb.group({
    search: ['']
  });
  
  // Signals from store
  isLoading = computed(() => this.jobsStore.isLoading());
  error = computed(() => this.jobsStore.error());
  jobs = computed(() => this.jobsStore.jobs());
  hasJobs = computed(() => this.jobsStore.hasJobs());
  
  constructor() {
    // Load jobs on component init
    effect(() => {
      this.jobsStore.loadPublishedJobs();
    });
  }
  
  onSearch() {
    const searchQuery = this.searchForm.get('search')?.value;
    if (searchQuery && searchQuery.trim()) {
      this.jobsStore.loadJobs(1, 20, searchQuery.trim());
    } else {
      this.jobsStore.loadPublishedJobs();
    }
  }
  
  viewJobDetails(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }
  
  formatSalary(job: Job): string {
    if (job.minSalary && job.maxSalary) {
      return `${job.salaryCurrency || '$'}${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
    } else if (job.minSalary) {
      return `${job.salaryCurrency || '$'}${job.minSalary.toLocaleString()}+`;
    }
    return 'Competitive';
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'Published': return 'success';
      case 'Draft': return 'warning';
      case 'Closed': return 'error';
      default: return 'info';
    }
  }
}
