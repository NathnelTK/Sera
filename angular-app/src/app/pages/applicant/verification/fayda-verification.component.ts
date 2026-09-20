import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { FaydaDecoderService, FaydaDecodeResult } from '../../../services/fayda-decoder.service';
import { VerificationStore } from '../../../stores/verification.store';
import { SubmitFaydaVerificationRequest } from '../../../services/verification.service';

/**
 * Self-contained Fayda identity-verification flow, embedded in the applicant profile.
 *
 * Two paths: scan a card photo (decoded on-device via `fayda-decoder`) or type the details in.
 * A valid card signature auto-approves server-side; anything else is queued for manual review.
 */
@Component({
  selector: 'app-fayda-verification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './fayda-verification.component.html',
  styleUrl: './fayda-verification.component.scss',
})
export class FaydaVerificationComponent {
  private fb = inject(FormBuilder);
  private decoder = inject(FaydaDecoderService);
  readonly store = inject(VerificationStore);

  readonly mode = signal<'scan' | 'manual'>('scan');
  readonly decoding = signal(false);
  /** Holds a translation key, not raw text, so the message follows the active language. */
  readonly decodeError = signal<string | null>(null);
  readonly decoded = signal<FaydaDecodeResult | null>(null);
  readonly signatureVerified = signal(false);

  readonly fields = computed(() => this.decoded()?.fields ?? null);

  readonly manualForm = this.fb.group({
    fan: ['', [Validators.required, Validators.maxLength(64)]],
    fullName: ['', [Validators.required, Validators.maxLength(256)]],
    dateOfBirth: ['', [Validators.maxLength(32)]],
    gender: ['', [Validators.maxLength(32)]],
  });

  constructor() {
    // One-time read of any existing verification (safe outside an effect — no reactive writes).
    void this.store.loadStatus();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.decodeError.set(null);
    this.decoded.set(null);
    this.signatureVerified.set(false);
    this.decoding.set(true);
    try {
      const result = await this.decoder.decodeImageFile(file);
      if (!result.ok) {
        this.decodeError.set(this.errorKey(result.error?.code));
        return;
      }
      this.decoded.set(result);
      this.signatureVerified.set(await this.decoder.verifySignature(result));
    } catch {
      this.decodeError.set('fayda.error.decoderUnavailable');
    } finally {
      this.decoding.set(false);
      input.value = ''; // allow re-selecting the same file
    }
  }

  reset(): void {
    this.decoded.set(null);
    this.decodeError.set(null);
    this.signatureVerified.set(false);
  }

  async submitDecoded(): Promise<void> {
    const d = this.decoded();
    if (!d?.fields) return;
    const req: SubmitFaydaVerificationRequest = {
      fan: (d.fields.fan ?? '').trim(),
      fullName: (d.fields.full_name ?? '').trim(),
      dateOfBirth: d.fields.date_of_birth ?? null,
      gender: d.fields.gender ?? null,
      signatureVerified: this.signatureVerified(),
      rawPayloadJson: d.raw ? JSON.stringify(d.raw) : null,
    };
    if (await this.store.submitFayda(req)) {
      this.reset();
    }
  }

  async submitManual(): Promise<void> {
    if (this.manualForm.invalid) {
      this.manualForm.markAllAsTouched();
      return;
    }
    const v = this.manualForm.getRawValue();
    const req: SubmitFaydaVerificationRequest = {
      fan: (v.fan ?? '').trim(),
      fullName: (v.fullName ?? '').trim(),
      dateOfBirth: (v.dateOfBirth ?? '').trim() || null,
      gender: (v.gender ?? '').trim() || null,
      signatureVerified: false,
      rawPayloadJson: null,
    };
    if (await this.store.submitFayda(req)) {
      this.manualForm.reset();
    }
  }

  private errorKey(code?: string): string {
    switch (code) {
      case 'NO_QR_FOUND':
        return 'fayda.error.noQr';
      case 'QR_UNREADABLE':
        return 'fayda.error.unreadable';
      case 'NOT_FAYDA':
        return 'fayda.error.notFayda';
      case 'UNSUPPORTED_VERSION':
        return 'fayda.error.unsupported';
      default:
        return 'fayda.error.generic';
    }
  }
}
