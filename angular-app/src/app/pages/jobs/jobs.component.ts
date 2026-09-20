import { Component, DestroyRef, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { JobsStore } from '../../stores/jobs.store';
import { JobSearchFilters, JobSummary } from '../../services/jobs.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import {
  experienceLevelKey,
  jobStatusColor,
  jobStatusKey,
  jobTypeKey,
  workModeKey,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
  JobType,
  WorkMode,
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
    MatSelectModule,
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
  private destroyRef = inject(DestroyRef);

  // Enum → i18n-key helpers for the template.
  jobTypeKey = jobTypeKey;
  workModeKey = workModeKey;
  experienceLevelKey = experienceLevelKey;
  jobStatusKey = jobStatusKey;
  jobStatusColor = jobStatusColor;
  jobTypeOptions = JOB_TYPE_OPTIONS;
  workModeOptions = WORK_MODE_OPTIONS;

  readonly categories = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Sales',
    'Engineering',
    'Administration',
    'Hospitality',
  ];

  searchForm = this.fb.group({
    search: [''],
    category: [''],
    location: [''],
    jobType: [null as JobType | null],
    workMode: [null as WorkMode | null],
  });

  isLoading = computed(() => this.jobsStore.isLoading());
  error = computed(() => this.jobsStore.error());
  jobs = computed(() => this.jobsStore.jobs());
  hasJobs = computed(() => this.jobsStore.hasJobs());

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.searchForm.patchValue({
        search: params.get('search')?.trim() ?? '',
        category: params.get('category')?.trim() ?? '',
        location: params.get('location')?.trim() ?? '',
        jobType: this.enumParam(params.get('jobType'), JobType),
        workMode: this.enumParam(params.get('workMode'), WorkMode),
      });
      this.loadJobs();
    });
  }

  onSearch() {
    const filters = this.filtersFromForm();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filters,
      replaceUrl: true,
    });
  }

  clearFilters() {
    this.searchForm.reset({ search: '', category: '', location: '', jobType: null, workMode: null });
    void this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
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

  formatLocation(job: JobSummary): string {
    return [job.locationCity, job.locationCountry].filter(Boolean).join(', ');
  }

  private loadJobs(filters = this.filtersFromForm()): void {
    void this.jobsStore.loadJobs(1, 50, filters);
  }

  private filtersFromForm(): JobSearchFilters {
    const value = this.searchForm.getRawValue();
    return {
      search: value.search?.trim() || undefined,
      category: value.category || undefined,
      location: value.location?.trim() || undefined,
      jobType: value.jobType ?? undefined,
      workMode: value.workMode ?? undefined,
    };
  }

  private enumParam<T extends object>(value: string | null, enumType: T): T[keyof T] | null {
    if (!value) return null;
    const parsed = Number(value);
    return Object.values(enumType).includes(parsed) ? (parsed as T[keyof T]) : null;
  }
}
