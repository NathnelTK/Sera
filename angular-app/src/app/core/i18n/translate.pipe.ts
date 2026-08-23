import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

/**
 * `{{ 'nav.findJobs' | translate }}` — resolves a key against the active language.
 *
 * Marked impure so it re-evaluates when the language changes. The dictionaries are small and
 * lookups are O(1), so the per-change-detection cost is negligible.
 */
@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(TranslationService);

  transform(key: string, params?: Record<string, string | number>): string {
    return this.i18n.instant(key, params);
  }
}
