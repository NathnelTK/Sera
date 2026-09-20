import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslationService } from '../i18n/translation.service';

type ToastType = 'error' | 'success' | 'info';

/**
 * Thin wrapper over MatSnackBar for app-wide toasts. Centralizes styling/duration so callers
 * just pass a message (already translated, or a translation key via {@link showKey}).
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly i18n = inject(TranslationService);

  error(message: string): void {
    this.show(message, 'error');
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  /** Resolve a translation key, then show it. */
  showKey(key: string, type: ToastType = 'info'): void {
    this.show(this.i18n.instant(key), type);
  }

  private show(message: string, type: ToastType): void {
    const config: MatSnackBarConfig = {
      duration: type === 'error' ? 6000 : 3500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`toast-${type}`],
    };
    this.snackBar.open(message, this.i18n.instant('common.close'), config);
  }
}
