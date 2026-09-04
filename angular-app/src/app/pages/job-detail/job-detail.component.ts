import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobsStore } from '../../stores/jobs.store';
import { ApplicationsStore } from '../../stores/applications.store';
import { SavedJobsService } from '../../services/saved-jobs.service';
import { DocumentRecord, DocumentsService } from '../../services/documents.service';
import { ApplicationMode } from '../../services/application-mode';
import { AuthStore } from '../../stores/auth.store';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { JobDetails } from '../../services/jobs.service';
import {
  ApplicationStatus,
  experienceLevelKey,
  JobStatus,
  jobStatusColor,
  jobStatusKey,
  jobTypeKey,
  workModeKey,
} from '../../core/workflow/workflow';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.scss',
})
export class JobDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private jobsStore = inject(JobsStore);
  private appsStore = inject(ApplicationsStore);
  private auth = inject(AuthStore);
  private savedJobs = inject(SavedJobsService);
  private documents = inject(DocumentsService);

  // Enum → i18n-key helpers for the template.
  jobTypeKey = jobTypeKey;
  workModeKey = workModeKey;
  experienceLevelKey = experienceLevelKey;
  jobStatusKey = jobStatusKey;
  jobStatusColor = jobStatusColor;

  readonly jobId: string;

  isLoading = computed(() => this.jobsStore.isLoading());
  error = computed(() => this.jobsStore.error());
  job = computed(() => this.jobsStore.currentJob());

  isAuthenticated = computed(() => this.auth.isAuthenticated());
  isApplicant = computed(() => this.auth.isApplicant());
  isRecruiter = computed(() => this.auth.isRecruiter());

  applyError = computed(() => this.appsStore.error());
  submitting = signal(false);
  submittedAppId = signal<string | null>(null);
  saved = signal(false);
  saving = signal(false);
  applicationMode = signal<'quick' | 'manual'>('quick');
  applicantDocuments = signal<DocumentRecord[]>([]);
  selectedCvId = signal<string | null>(null);

  coverForm = this.fb.group({
    coverLetter: ['', [Validators.maxLength(5000)]],
  });

  /** An existing, non-withdrawn application by this user for this job (if any). */
  private existingApplication = computed(() =>
    this.appsStore
      .applications()
      .find((a) => a.jobId === this.jobId && a.status !== ApplicationStatus.Withdrawn),
  );

  isPublished = computed(() => this.job()?.status === JobStatus.Published);

  /** Application id to link to after applying, or an existing one. */
  appliedId = computed(() => this.submittedAppId() ?? this.existingApplication()?.id ?? null);
  hasApplied = computed(() => this.appliedId() !== null);
  canApply = computed(() => this.isApplicant() && this.isPublished() && !this.hasApplied());

  constructor() {
    this.jobId = this.route.snapshot.paramMap.get('id') ?? '';
    void this.jobsStore.loadJobById(this.jobId);
    // Applicants: check whether they've already applied so we show the right call to action.
    if (this.auth.isApplicant()) {
      void this.appsStore.loadMyApplications();
      void this.loadSavedState();
      void this.loadDocuments();
    }
  }

  formatSalary(job: JobDetails): string {
    const currency = job.salaryCurrency || 'ETB';
    if (job.minSalary && job.maxSalary) {
      return `${currency} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
    }
    if (job.minSalary) return `${currency} ${job.minSalary.toLocaleString()}+`;
    if (job.maxSalary) return `${currency} ${job.maxSalary.toLocaleString()}`;
    return '';
  }

  async apply(): Promise<void> {
    if (!this.canApply() || this.coverForm.invalid) return;
    this.submitting.set(true);
    const coverLetter = this.coverForm.value.coverLetter?.trim() || undefined;
    const id = await this.appsStore.apply({ jobId: this.jobId, coverLetter, cvId: this.selectedCvId() ?? undefined, mode: this.applicationMode() === 'quick' ? ApplicationMode.Quick : ApplicationMode.Manual });
    this.submitting.set(false);
    if (id) {
      this.submittedAppId.set(id);
    }
  }

  signInToApply(): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl: `/jobs/${this.jobId}` } });
  }

  async toggleSaved(): Promise<void> {
    if (!this.isApplicant() || this.saving()) return;
    this.saving.set(true);
    try {
      if (this.saved()) await this.savedJobs.remove(this.jobId).toPromise();
      else await this.savedJobs.save(this.jobId).toPromise();
      this.saved.update(value => !value);
    } finally { this.saving.set(false); }
  }

  private async loadSavedState(): Promise<void> {
    try { this.saved.set((await this.savedJobs.getMine().toPromise())?.some(job => job.jobId === this.jobId) ?? false); } catch { this.saved.set(false); }
  }

  private async loadDocuments(): Promise<void> {
    try {
      const documents = await this.documents.getMine().toPromise() ?? [];
      this.applicantDocuments.set(documents.filter(document => document.documentType === 1));
      this.selectedCvId.set(this.applicantDocuments()[0]?.id ?? null);
    } catch { this.applicantDocuments.set([]); }
  }
}
