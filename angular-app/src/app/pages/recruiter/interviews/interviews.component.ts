import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { InterviewsStore } from '../../../stores/interviews.store';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { Interview } from '../../../services/interviews.service';
import {
  ReasonDialogComponent,
  ReasonDialogResult,
} from '../../../core/layout/reason-dialog/reason-dialog.component';
import {
  InterviewStatus,
  interviewFormatKey,
  interviewStatusColor,
  interviewStatusKey,
} from '../../../core/workflow/workflow';

@Component({
  selector: 'app-recruiter-interviews',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TranslatePipe,
  ],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.scss',
})
export class InterviewsComponent {
  private store = inject(InterviewsStore);
  private dialog = inject(MatDialog);

  // Enum → i18n-key helpers for the template.
  interviewFormatKey = interviewFormatKey;
  interviewStatusKey = interviewStatusKey;
  interviewStatusColor = interviewStatusColor;

  isLoading = computed(() => this.store.isLoading());
  error = computed(() => this.store.error());
  hasInterviews = computed(() => this.store.hasInterviews());

  upcoming = computed(() => this.store.upcomingInterviews());
  past = computed(() => {
    const upcomingIds = new Set(this.upcoming().map((i) => i.id));
    return this.store
      .interviews()
      .filter((i) => !upcomingIds.has(i.id))
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  });

  constructor() {
    void this.store.loadMyInterviews();
  }

  /** Scheduled / rescheduled interviews are still "live". */
  isActive(i: Interview): boolean {
    return i.status === InterviewStatus.Scheduled || i.status === InterviewStatus.Rescheduled;
  }

  reload(): void {
    void this.store.loadMyInterviews();
  }

  async cancel(i: Interview): Promise<void> {
    const ref = this.dialog.open(ReasonDialogComponent, {
      autoFocus: false,
      restoreFocus: true,
      data: {
        titleKey: 'wf.interviews.cancelTitle',
        labelKey: 'wf.interviews.cancelReason',
        confirmKey: 'wf.interviews.cancel',
        danger: true,
      },
    });
    const res: ReasonDialogResult | undefined = await firstValueFrom(ref.afterClosed());
    if (res) {
      await this.store.cancelInterview(i.id, res.reason || undefined);
    }
  }
}
