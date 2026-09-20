import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { JobsStore } from '../../../stores/jobs.store';
import { ApplicationsStore } from '../../../stores/applications.store';
import { InterviewsStore } from '../../../stores/interviews.store';
import { JobsService, JobApplicationSummary } from '../../../services/jobs.service';
import { TranslationService } from '../../../core/i18n/translation.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import {
  ReasonDialogComponent,
  ReasonDialogResult,
} from '../../../core/layout/reason-dialog/reason-dialog.component';
import { ScheduleInterviewDialogComponent } from '../../../core/layout/schedule-interview-dialog/schedule-interview-dialog.component';
import { ScheduleInterviewRequest } from '../../../services/interviews.service';
import {
  ApplicationStatus,
  applicationStatusColor,
  applicationStatusKey,
  PIPELINE_COLUMNS,
  RECRUITER_MOVE_TARGETS,
} from '../../../core/workflow/workflow';

interface PipelineColumn {
  status: ApplicationStatus;
  key: string;
  color: string;
  items: JobApplicationSummary[];
}

/**
 * Greenhouse-style candidate board for one job. Columns follow PIPELINE_COLUMNS; a recruiter
 * moves a candidate between stages (rejection captures optional feedback) and can schedule an
 * interview. Withdrawn candidates leave the active board, matching how applicant-initiated
 * withdrawals work on the backend.
 */
@Component({
  selector: 'app-job-applications',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TranslatePipe,
  ],
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.scss',
})
export class JobApplicationsComponent {
  private route = inject(ActivatedRoute);
  private jobsStore = inject(JobsStore);
  private jobsService = inject(JobsService);
  private appsStore = inject(ApplicationsStore);
  private interviewsStore = inject(InterviewsStore);
  private dialog = inject(MatDialog);
  private i18n = inject(TranslationService);

  applicationStatusKey = applicationStatusKey;
  applicationStatusColor = applicationStatusColor;

  readonly jobId: string;

  private candidates = signal<JobApplicationSummary[]>([]);
  loading = signal(false);
  loadError = signal<string | null>(null);
  flash = signal<string | null>(null);
  busyId = signal<string | null>(null);

  jobTitle = computed(() => this.jobsStore.currentJob()?.title ?? '');
  hasCandidates = computed(() => this.candidates().length > 0);
  mutationError = computed(() => this.appsStore.error() ?? this.interviewsStore.error());

  columns = computed<PipelineColumn[]>(() => {
    const list = this.candidates();
    return PIPELINE_COLUMNS.map((status) => ({
      status,
      key: applicationStatusKey(status),
      color: applicationStatusColor(status),
      items: list.filter((c) => c.status === status),
    }));
  });

  constructor() {
    this.jobId = this.route.snapshot.paramMap.get('id') ?? '';
    void this.jobsStore.loadJobById(this.jobId);
    void this.loadCandidates();
  }

  async loadCandidates(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(null);
    try {
      const list = await firstValueFrom(this.jobsService.getJobApplications(this.jobId));
      this.candidates.set(list ?? []);
    } catch {
      this.loadError.set(this.i18n.instant('wf.error.loadApplications'));
    } finally {
      this.loading.set(false);
    }
  }

  /** Statuses this candidate can be moved to (all pipeline stages except the current one). */
  moveTargets(current: ApplicationStatus): ApplicationStatus[] {
    return RECRUITER_MOVE_TARGETS.filter((s) => s !== current);
  }

  /** Scheduling an interview only makes sense for candidates still in contention. */
  canSchedule(candidate: JobApplicationSummary): boolean {
    return candidate.status !== ApplicationStatus.Rejected;
  }

  async move(candidate: JobApplicationSummary, target: ApplicationStatus): Promise<void> {
    if (target === ApplicationStatus.Rejected) {
      await this.reject(candidate);
      return;
    }
    await this.applyStatus(candidate, target);
  }

  private async reject(candidate: JobApplicationSummary): Promise<void> {
    const ref = this.dialog.open(ReasonDialogComponent, {
      autoFocus: false,
      restoreFocus: true,
      data: {
        titleKey: 'wf.pipeline.rejectTitle',
        labelKey: 'wf.pipeline.rejectReason',
        confirmKey: 'wf.pipeline.reject',
        danger: true,
      },
    });
    const res: ReasonDialogResult | undefined = await firstValueFrom(ref.afterClosed());
    if (!res) return;
    await this.applyStatus(candidate, ApplicationStatus.Rejected, res.reason);
  }

  private async applyStatus(
    candidate: JobApplicationSummary,
    target: ApplicationStatus,
    reason?: string,
  ): Promise<void> {
    this.busyId.set(candidate.applicationId);
    const ok = await this.appsStore.updateStatus(candidate.applicationId, target, reason);
    this.busyId.set(null);
    if (ok) {
      this.candidates.update((list) =>
        list.map((c) =>
          c.applicationId === candidate.applicationId ? { ...c, status: target } : c,
        ),
      );
    }
  }

  async schedule(candidate: JobApplicationSummary): Promise<void> {
    const ref = this.dialog.open(ScheduleInterviewDialogComponent, {
      autoFocus: false,
      restoreFocus: true,
      data: { jobApplicationId: candidate.applicationId, applicantName: candidate.applicantName },
    });
    const req: ScheduleInterviewRequest | undefined = await firstValueFrom(ref.afterClosed());
    if (!req) return;
    const id = await this.interviewsStore.scheduleInterview(req);
    if (id) {
      this.flash.set(this.i18n.instant('wf.pipeline.scheduled', { name: candidate.applicantName }));
    }
  }

  dismissFlash(): void {
    this.flash.set(null);
  }

  scoreParts(candidate: JobApplicationSummary): { label: string; value: number }[] {
    return [
      { label: 'Skills match', value: candidate.skillsMatch ?? candidate.matchScore ?? 0 },
      { label: 'Experience match', value: candidate.experienceMatch ?? candidate.matchScore ?? 0 },
      { label: 'Education match', value: candidate.educationMatch ?? candidate.matchScore ?? 0 },
      { label: 'Requirements match', value: candidate.requirementsMatch ?? candidate.matchScore ?? 0 },
      { label: 'Location / availability', value: candidate.locationMatch ?? candidate.matchScore ?? 0 },
    ];
  }
}
