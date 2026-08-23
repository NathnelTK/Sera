import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { JobsStore } from '../../stores/jobs.store';
import { JobSummary } from '../../services/jobs.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import {
  experienceLevelKey,
  jobStatusColor,
  jobStatusKey,
  jobTypeKey,
  workModeKey,
} from '../../core/workflow/workflow';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
})
export class JobsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private jobsStore = inject(JobsStore);

  // Enum → i18n-key helpers for the template.
  jobTypeKey = jobTypeKey;
  workModeKey = workModeKey;
  experienceLevelKey = experienceLevelKey;
  jobStatusKey = jobStatusKey;
  jobStatusColor = jobStatusColor;

  searchForm = this.fb.group({ search: [''] });

  isLoading = computed(() => this.jobsStore.isLoading());
  error = computed(() => this.jobsStore.error());
  jobs = computed(() => this.jobsStore.jobs());
  hasJobs = computed(() => this.jobsStore.hasJobs());

  constructor() {
    // Honor a ?search= query param (e.g. arriving from the homepage search bar).
    const initialSearch = this.route.snapshot.queryParamMap.get('search')?.trim() ?? '';
    if (initialSearch) {
      this.searchForm.patchValue({ search: initialSearch });
    }

    effect(() => {
      if (initialSearch) {
        this.jobsStore.loadJobs(1, 20, initialSearch);
      } else {
        this.jobsStore.loadPublishedJobs();
      }
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

  formatSalary(job: JobSummary): string {
    const currency = job.salaryCurrency || 'ETB';
    if (job.minSalary && job.maxSalary) {
      return `${currency} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
    }
    if (job.minSalary) {
      return `${currency} ${job.minSalary.toLocaleString()}+`;
    }
    if (job.maxSalary) {
      return `${currency} ${job.maxSalary.toLocaleString()}`;
    }
    return '';
  }
}
