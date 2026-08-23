import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { FaydaVerificationComponent } from '../verification/fayda-verification.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, FaydaVerificationComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
