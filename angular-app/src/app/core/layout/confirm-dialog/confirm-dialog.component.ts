import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../i18n/translate.pipe';

export interface ConfirmDialogData {
  titleKey: string;
  messageKey: string;
  confirmKey?: string;
  cancelKey?: string;
  /** Style the confirm button as a destructive action. */
  danger?: boolean;
}

/**
 * Reusable confirmation dialog. Opened via MatDialog; closes with `true` (confirmed) or
 * `false`/`undefined` (dismissed). Labels are translation keys resolved with the translate pipe.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ data.titleKey | translate }}</h2>
    <mat-dialog-content>
      <p>{{ data.messageKey | translate }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">
        {{ (data.cancelKey ?? 'common.cancel') | translate }}
      </button>
      <button
        mat-flat-button
        [class.danger]="data.danger"
        [class.primary]="!data.danger"
        (click)="close(true)"
        cdkFocusInitial
      >
        {{ (data.confirmKey ?? 'common.confirm') | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; max-width: 420px; }
    h2 { font-size: var(--afriwork-font-size-xl); margin-bottom: var(--afriwork-spacing-sm); }
    p { color: var(--afriwork-gray); margin: 0; }
    mat-dialog-actions { gap: var(--afriwork-spacing-sm); padding-top: var(--afriwork-spacing-md); }
    button.primary { background: var(--afriwork-primary); color: #fff; }
    button.danger { background: var(--afriwork-error); color: #fff; }
  `],
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ConfirmDialogComponent, boolean>);

  close(result: boolean): void {
    this.ref.close(result);
  }
}
