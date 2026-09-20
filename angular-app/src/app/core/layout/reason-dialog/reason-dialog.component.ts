import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '../../i18n/translate.pipe';

export interface ReasonDialogData {
  titleKey: string;
  labelKey: string;
  confirmKey?: string;
  cancelKey?: string;
  /** Require a non-empty reason before the confirm button is enabled. */
  required?: boolean;
  /** Style the confirm button as a destructive action. */
  danger?: boolean;
}

export interface ReasonDialogResult {
  reason: string;
}

/**
 * Reusable dialog that collects a free-text reason (used for rejecting a candidate and
 * cancelling an interview). Closes with `{ reason }` on confirm or `undefined` on dismiss.
 */
@Component({
  selector: 'app-reason-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ data.titleKey | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>{{ data.labelKey | translate }}</mat-label>
          <textarea matInput rows="4" formControlName="reason" cdkFocusInitial></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">
        {{ (data.cancelKey ?? 'common.cancel') | translate }}
      </button>
      <button
        mat-flat-button
        [class.danger]="data.danger"
        [class.primary]="!data.danger"
        [disabled]="data.required && form.invalid"
        (click)="confirm()"
      >
        {{ (data.confirmKey ?? 'common.confirm') | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; min-width: 320px; max-width: 440px; }
    h2 { font-size: var(--afriwork-font-size-xl); margin-bottom: var(--afriwork-spacing-sm); }
    .full { width: 100%; }
    mat-dialog-actions { gap: var(--afriwork-spacing-sm); }
    button.primary { background: var(--afriwork-primary); color: #fff; }
    button.danger { background: var(--afriwork-error); color: #fff; }
  `],
})
export class ReasonDialogComponent {
  readonly data = inject<ReasonDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ReasonDialogComponent, ReasonDialogResult>);
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    reason: ['', this.data.required ? [Validators.required, Validators.maxLength(1000)] : [Validators.maxLength(1000)]],
  });

  cancel(): void {
    this.ref.close(undefined);
  }

  confirm(): void {
    if (this.data.required && this.form.invalid) return;
    this.ref.close({ reason: (this.form.value.reason ?? '').trim() });
  }
}
