import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { FaydaVerificationComponent } from './fayda-verification.component';

@Component({
  selector: 'app-verification-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, TranslatePipe, FaydaVerificationComponent],
  template: `
    <div class="verification-page afriwork-container afriwork-fade-in">
      <a mat-button routerLink="/applicant/profile"><mat-icon>arrow_back</mat-icon>{{ 'profile.back' | translate }}</a>
      <header><h1>{{ 'profile.verificationTitle' | translate }}</h1><p>{{ 'profile.verificationSubtitle' | translate }}</p></header>
      <app-fayda-verification />
    </div>
  `,
  styles: [`.verification-page { padding: var(--afriwork-spacing-xl) var(--afriwork-spacing-md); max-width: 820px; } header { margin: 1rem 0 1.5rem; } header h1 { margin: 0 0 .25rem; } header p { color: var(--afriwork-gray); margin: 0; }`],
})
export class VerificationPageComponent {}
