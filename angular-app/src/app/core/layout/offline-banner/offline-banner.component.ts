import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConnectivityService } from '../../services/connectivity.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

/**
 * App-wide banner shown when the browser loses its connection. Uses the reactive
 * ConnectivityService signal so it appears/disappears automatically; "Retry" forces a re-check.
 */
@Component({
  selector: 'app-offline-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    @if (!connectivity.isOnline()) {
      <div class="offline-banner" role="status" aria-live="polite">
        <mat-icon aria-hidden="true">cloud_off</mat-icon>
        <span class="offline-text">{{ 'offline.banner' | translate }}</span>
        <button mat-button class="retry" (click)="connectivity.refresh()">
          {{ 'offline.retry' | translate }}
        </button>
      </div>
    }
  `,
  styles: [`
    .offline-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--afriwork-spacing-sm);
      padding: 8px var(--afriwork-spacing-md);
      background: var(--afriwork-dark);
      color: #fff;
      font-size: var(--afriwork-font-size-sm);
      font-weight: 500;
    }
    .offline-banner mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .retry {
      color: var(--afriwork-et-yellow);
      min-width: 0;
    }
    @media (max-width: 480px) {
      .offline-text { display: none; }
    }
  `],
})
export class OfflineBannerComponent {
  readonly connectivity = inject(ConnectivityService);
}
