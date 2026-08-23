import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { OfflineBannerComponent } from './core/layout/offline-banner/offline-banner.component';
import { TranslationService } from './core/i18n/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, OfflineBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'TalentOS';

  // Instantiate early so the active language is applied to <html lang> before pages render.
  private readonly i18n = inject(TranslationService);
}
