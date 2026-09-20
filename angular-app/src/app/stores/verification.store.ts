import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  VerificationService,
  VerificationResponse,
  VerificationStatus,
  SubmitFaydaVerificationRequest,
} from '../services/verification.service';
import { AuthStore } from './auth.store';
import { TranslationService } from '../core/i18n/translation.service';

/**
 * Holds the current user's Fayda verification state.
 *
 * The backend exposes no "get my latest verification" endpoint, so we remember the id the
 * submit call returns (per user, in localStorage) and re-read it on load. This keeps the
 * badge persistent across sessions without a schema change on the API.
 */
@Injectable({ providedIn: 'root' })
export class VerificationStore {
  private service = inject(VerificationService);
  private auth = inject(AuthStore);
  private i18n = inject(TranslationService);

  isLoading = signal(false);
  error = signal<string | null>(null);
  verification = signal<VerificationResponse | null>(null);

  status = computed<number | null>(() => this.verification()?.status ?? null);
  isApproved = computed(() => this.status() === VerificationStatus.Approved);
  isPending = computed(() => this.status() === VerificationStatus.Pending);
  isRejected = computed(() => this.status() === VerificationStatus.Rejected);

  private statusLoaded = false;

  private storageKey(): string | null {
    const id = this.auth.currentUser()?.id;
    return id ? `talentos.faydaVerification.${id}` : null;
  }

  /** Read the persisted verification (once per session) so we can show the current status. */
  async loadStatus(force = false): Promise<void> {
    if (this.statusLoaded && !force) return;

    const key = this.storageKey();
    if (!key) return;
    const vid = localStorage.getItem(key);
    if (!vid) return;

    this.statusLoaded = true;
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const res = await firstValueFrom(this.service.getVerification(vid));
      this.verification.set(res);
    } catch {
      // Stale/purged id — drop it so we don't keep re-fetching a missing row.
      localStorage.removeItem(key);
      this.verification.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Submit decoded Fayda fields, persist the returned id, then read back the resulting status. */
  async submitFayda(req: SubmitFaydaVerificationRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const { id } = await firstValueFrom(this.service.submitFayda(req));
      const key = this.storageKey();
      if (key) localStorage.setItem(key, id);
      this.statusLoaded = true;
      const res = await firstValueFrom(this.service.getVerification(id));
      this.verification.set(res);
      return true;
    } catch (err: unknown) {
      this.error.set(this.messageFrom(err));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Pull a human message out of either the plain `{ error }` body or an RFC 7807 problem. */
  private messageFrom(err: unknown): string {
    const body = (err as { error?: unknown })?.error;
    if (body && typeof body === 'object') {
      const b = body as { error?: unknown; errors?: Record<string, unknown>; title?: unknown };
      if (typeof b.error === 'string') return b.error;
      if (b.errors && typeof b.errors === 'object') {
        const first = Object.values(b.errors)[0];
        if (Array.isArray(first) && first.length) return String(first[0]);
      }
      if (typeof b.title === 'string') return b.title;
    }
    return this.i18n.instant('fayda.error.submit');
  }
}
