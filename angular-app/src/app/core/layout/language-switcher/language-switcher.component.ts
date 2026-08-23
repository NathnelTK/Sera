import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from '../../i18n/translation.service';
import { Lang } from '../../i18n/translations';
import { TranslatePipe } from '../../i18n/translate.pipe';

/** Top-right language switcher (English / አማርኛ). Persists the choice via TranslationService. */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, TranslatePipe],
  template: `
    <button
      mat-button
      class="lang-trigger"
      [matMenuTriggerFor]="menu"
      [attr.aria-label]="'lang.label' | translate"
    >
      <mat-icon>language</mat-icon>
      <span class="lang-label">{{ activeLabel() }}</span>
    </button>
    <mat-menu #menu="matMenu">
      @for (option of languages; track option.code) {
        <button mat-menu-item (click)="select(option.code)">
          <mat-icon>{{ option.code === current() ? 'check' : '' }}</mat-icon>
          <span>{{ option.nativeLabel }}</span>
        </button>
      }
    </mat-menu>
  `,
  styles: [`
    .lang-trigger { display: inline-flex; align-items: center; gap: 6px; font-weight: 500; }
    .lang-label { text-transform: none; }
  `],
})
export class LanguageSwitcherComponent {
  private readonly i18n = inject(TranslationService);

  readonly languages = this.i18n.languages;
  readonly current = this.i18n.lang;
  readonly activeLabel = computed(
    () => this.languages.find(l => l.code === this.current())?.nativeLabel ?? 'English',
  );

  select(code: Lang): void {
    this.i18n.setLang(code);
  }
}
