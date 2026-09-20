import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, query, style, animate } from '@angular/animations';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { OfflineBannerComponent } from './core/layout/offline-banner/offline-banner.component';
import { TranslationService } from './core/i18n/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, OfflineBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  // Subtle page-enter transition on every navigation. Enter-only (no leaving
  // clone) so there's no absolute-positioning jump, and it animates opacity +
  // transform only, so it composites on the GPU and stays cheap.
  animations: [
    trigger('routeAnimations', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            animate('300ms ease-out', style({ opacity: 1, transform: 'none' })),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'TalentOS';

  // Instantiate early so the active language is applied to <html lang> before pages render.
  private readonly i18n = inject(TranslationService);

  /** A per-route key so the enter animation re-fires on each navigation. */
  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.isActivated
      ? outlet.activatedRoute.snapshot.url.map(s => s.path).join('/')
      : '';
  }
}
