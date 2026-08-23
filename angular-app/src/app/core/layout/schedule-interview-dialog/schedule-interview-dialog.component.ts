import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { ScheduleInterviewRequest } from '../../../services/interviews.service';
import { InterviewFormat, INTERVIEW_FORMAT_OPTIONS } from '../../workflow/workflow';

export interface ScheduleInterviewDialogData {
  jobApplicationId: string;
  applicantName?: string;
}

/**
 * Recruiter dialog that captures interview details and returns a ready-to-send
 * ScheduleInterviewRequest (or `undefined` when dismissed). The datetime-local value is
 * converted to an ISO string for the .NET API.
 */
@Component({
  selector: 'app-schedule-interview-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title>{{ 'wf.schedule.title' | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="grid">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'wf.schedule.format' | translate }}</mat-label>
          <mat-select formControlName="format">
            @for (opt of formatOptions; track opt.value) {
              <mat-option [value]="opt.value">{{ opt.labelKey | translate }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'wf.schedule.when' | translate }}</mat-label>
          <input matInput type="datetime-local" formControlName="scheduledAt" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'wf.schedule.duration' | translate }}</mat-label>
          <input matInput type="number" min="5" step="5" formControlName="durationMinutes" />
        </mat-form-field>

        @if (isVideo()) {
          <mat-form-field appearance="outline">
            <mat-label>{{ 'wf.schedule.meetingLink' | translate }}</mat-label>
            <input matInput formControlName="meetingLink" />
          </mat-form-field>
        } @else if (isInPerson()) {
          <mat-form-field appearance="outline">
            <mat-label>{{ 'wf.schedule.location' | translate }}</mat-label>
            <input matInput formControlName="locationDescription" />
          </mat-form-field>
        }

        <mat-form-field appearance="outline" class="span">
          <mat-label>{{ 'wf.schedule.notes' | translate }}</mat-label>
          <textarea matInput rows="2" formControlName="notes"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button class="primary" [disabled]="form.invalid" (click)="confirm()">
        {{ 'wf.schedule.confirm' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 var(--afriwork-spacing-md); min-width: 420px; }
    .span { grid-column: 1 / -1; }
    mat-dialog-actions { gap: var(--afriwork-spacing-sm); }
    button.primary { background: var(--afriwork-primary); color: #fff; }
    @media (max-width: 520px) { .grid { grid-template-columns: 1fr; min-width: 0; } }
  `],
})
export class ScheduleInterviewDialogComponent {
  readonly data = inject<ScheduleInterviewDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ScheduleInterviewDialogComponent, ScheduleInterviewRequest>);
  private readonly fb = inject(FormBuilder);

  readonly formatOptions = INTERVIEW_FORMAT_OPTIONS;

  form = this.fb.group({
    format: [InterviewFormat.Video, Validators.required],
    scheduledAt: ['', Validators.required],
    durationMinutes: [30, [Validators.required, Validators.min(5)]],
    meetingLink: [''],
    locationDescription: [''],
    notes: [''],
  });

  private format = signal<InterviewFormat>(InterviewFormat.Video);
  isVideo = computed(() => this.format() === InterviewFormat.Video);
  isInPerson = computed(() => this.format() === InterviewFormat.InPerson);

  constructor() {
    this.form.controls.format.valueChanges.subscribe((v) =>
      this.format.set(v ?? InterviewFormat.Video),
    );
  }

  cancel(): void {
    this.ref.close(undefined);
  }

  confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const trimmed = (s: string | null | undefined) => {
      const t = (s ?? '').trim();
      return t ? t : undefined;
    };
    this.ref.close({
      jobApplicationId: this.data.jobApplicationId,
      format: v.format ?? InterviewFormat.Video,
      scheduledAt: new Date(v.scheduledAt as string).toISOString(),
      durationMinutes: Number(v.durationMinutes) || 30,
      meetingLink: trimmed(v.meetingLink),
      locationDescription: trimmed(v.locationDescription),
      notes: trimmed(v.notes),
    });
  }
}
