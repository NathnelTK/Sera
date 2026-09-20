import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { JobsStore } from '../../../stores/jobs.store';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ConfirmDialogComponent } from '../../../core/layout/confirm-dialog/confirm-dialog.component';
import { JobSummary } from '../../../services/jobs.service';
import {
  experienceLevelKey,
  JobStatus,
  jobStatusColor,
  jobStatusKey,
  jobTypeKey,
  workModeKey,
} from '../../../core/workflow/workflow';

@Component({
  selector: 'app-recruiter-jobs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TranslatePipe,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
})
export class JobsComponent {
  private router = inject(Router);
  private jobsStore = inject(JobsStore);
  private dialog = inject(MatDialog);

  // Enum → i18n-key helpers for the template.
  jobStatusKey = jobStatusKey;
  jobStatusColor = jobStatusColor;
  jobTypeKey = jobTypeKey;
  workModeKey = workModeKey;
  experienceLevelKey = experienceLevelKey;
  readonly JobStatus = JobStatus;

  isLoading = computed(() => this.jobsStore.isLoading());
  error = computed(() => this.jobsStore.error());
  myJobs = computed(() => this.jobsStore.myJobs());

  constructor() {
    void this.jobsStore.loadMyJobs();
  }

  reload(): void {
    void this.jobsStore.loadMyJobs();
  }

  publish(id: string): void {
    void this.jobsStore.publishJob(id);
  }

  async close(job: JobSummary): Promise<void> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      restoreFocus: true,
      data: {
        titleKey: 'wf.myJobs.closeTitle',
        messageKey: 'wf.myJobs.closeBody',
        confirmKey: 'wf.myJobs.close',
        danger: true,
      },
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.jobsStore.closeJob(job.id);
    }
  }
}
