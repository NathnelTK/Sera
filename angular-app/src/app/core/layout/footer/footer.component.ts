import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';

/** Shared marketing footer used by the public home and employer landing pages. */
@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer class="footer">
      <div class="afriwork-container footer-grid">
        <div class="footer-section">
          <h4>{{ 'app.name' | translate }}</h4>
          <p>{{ 'footer.tagline' | translate }}</p>
        </div>
        <div class="footer-section">
          <h4>{{ 'footer.forSeekers' | translate }}</h4>
          <a routerLink="/jobs">{{ 'footer.browseJobs' | translate }}</a>
          <a routerLink="/register">{{ 'footer.createProfile' | translate }}</a>
        </div>
        <div class="footer-section">
          <h4>{{ 'footer.forEmployers' | translate }}</h4>
          <a routerLink="/employers">{{ 'footer.postJob' | translate }}</a>
          <a routerLink="/register">{{ 'footer.findTalent' | translate }}</a>
        </div>
        <div class="footer-section">
          <h4>{{ 'footer.company' | translate }}</h4>
          <a routerLink="/home">{{ 'footer.about' | translate }}</a>
          <a routerLink="/home">{{ 'footer.contact' | translate }}</a>
        </div>
      </div>
      <div class="footer-bottom afriwork-container">
        <p>&copy; {{ year }} {{ 'app.name' | translate }}. {{ 'footer.rights' | translate }}</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer { background: var(--afriwork-light); border-top: 1px solid var(--afriwork-border); padding: var(--afriwork-spacing-2xl) 0 var(--afriwork-spacing-lg); }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: var(--afriwork-spacing-lg); }
    .footer-section h4 { font-size: var(--afriwork-font-size-base); margin-bottom: var(--afriwork-spacing-sm); }
    .footer-section p { color: var(--afriwork-gray); font-size: var(--afriwork-font-size-sm); margin: 0; }
    .footer-section a { display: block; color: var(--afriwork-gray); font-size: var(--afriwork-font-size-sm); padding: 4px 0; }
    .footer-section a:hover { color: var(--afriwork-primary); }
    .footer-bottom { margin-top: var(--afriwork-spacing-xl); padding-top: var(--afriwork-spacing-md); border-top: 1px solid var(--afriwork-border); text-align: center; }
    .footer-bottom p { color: var(--afriwork-gray); font-size: var(--afriwork-font-size-sm); margin: 0; }
    @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
  `],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
