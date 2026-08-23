import { Injectable, signal } from '@angular/core';

/**
 * Tracks browser online/offline state as a signal so the UI can show an offline banner and
 * components can react. zone.js patches the window events, so signal writes inside the handlers
 * are picked up by change detection.
 */
@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  private readonly _isOnline = signal(this.readInitial());

  /** `true` while the browser reports a network connection. */
  readonly isOnline = this._isOnline.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this._isOnline.set(true));
      window.addEventListener('offline', () => this._isOnline.set(false));
    }
  }

  /** Called by the HTTP error interceptor when a request fails with a network-level error. */
  markOffline(): void {
    this._isOnline.set(false);
  }

  /** Re-check against the browser's current state (e.g. after a successful retry). */
  refresh(): void {
    this._isOnline.set(this.readInitial());
  }

  private readInitial(): boolean {
    return typeof navigator === 'undefined' ? true : navigator.onLine;
  }
}
