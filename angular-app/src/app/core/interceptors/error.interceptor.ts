import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TranslationService } from '../i18n/translation.service';
import { NotificationService } from '../services/notification.service';
import { ConnectivityService } from '../services/connectivity.service';

/**
 * Translates HTTP failures into user-friendly toasts and tracks connectivity.
 *
 * - status 0        → network/offline: mark offline + "no connection" toast
 * - 503             → service unavailable (e.g. database down) — the API's RFC 7807 title/detail
 * - 5xx             → generic server error
 * - 403             → forbidden
 * 401 (handled by the auth interceptor's redirect) and 400 (validation shown inline on forms)
 * are re-thrown without a toast so we don't double-message the user.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const i18n = inject(TranslationService);
  const notify = inject(NotificationService);
  const connectivity = inject(ConnectivityService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        connectivity.markOffline();
        notify.error(i18n.instant('error.network'));
      } else if (error.status === 503) {
        notify.error(problemDetail(error) ?? i18n.instant('error.unavailable'));
      } else if (error.status >= 500) {
        notify.error(i18n.instant('error.server'));
      } else if (error.status === 403) {
        notify.error(problemDetail(error) ?? i18n.instant('error.forbidden'));
      } else if (error.status === 404) {
        notify.error(problemDetail(error) ?? i18n.instant('error.notFound'));
      }
      // 400 (validation) and 401 (auth redirect) fall through silently.
      return throwError(() => error);
    }),
  );
};

/** Extract a human-readable message from an RFC 7807 problem+json body, if present. */
function problemDetail(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (body && typeof body === 'object') {
    return (body.detail as string) || (body.title as string) || null;
  }
  return null;
}
