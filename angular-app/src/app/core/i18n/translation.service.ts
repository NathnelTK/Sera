import { Injectable, signal, computed } from '@angular/core';
import { DEFAULT_LANG, Lang, LANGUAGES, TRANSLATIONS } from './translations';

const STORAGE_KEY = 'talentos.lang';

/**
 * Signal-based translation service. Holds the active language, persists the choice, and resolves
 * keys against the bundled dictionaries with English fallback and simple {{param}} interpolation.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _lang = signal<Lang>(this.readInitialLang());

  /** The active language as a signal — read it in templates/computeds to react to changes. */
  readonly lang = this._lang.asReadonly();

  /** The dictionary for the active language. */
  private readonly dictionary = computed(() => TRANSLATIONS[this._lang()]);

  readonly languages = LANGUAGES;

  constructor() {
    this.applyToDocument(this._lang());
  }

  setLang(lang: Lang): void {
    if (lang === this._lang()) return;
    this._lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
    this.applyToDocument(lang);
  }

  /**
   * Resolve a key to a string in the active language. Falls back to English, then to the raw key.
   * Supports `{{name}}` placeholders replaced from `params`.
   */
  instant(key: string, params?: Record<string, string | number>): string {
    const value = this.dictionary()[key] ?? TRANSLATIONS.en[key] ?? key;
    if (!params) return value;
    return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) =>
      params[name] != null ? String(params[name]) : `{{${name}}}`,
    );
  }

  private readInitialLang(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && LANGUAGES.some(l => l.code === stored)) return stored;
    } catch {
      /* ignore */
    }
    return DEFAULT_LANG;
  }

  private applyToDocument(lang: Lang): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }
}
