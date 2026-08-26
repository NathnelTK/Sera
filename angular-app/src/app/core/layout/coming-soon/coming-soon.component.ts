import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../i18n/translate.pipe';

/**
 * Shared placeholder for routes whose feature is not built yet. Keeps unfinished
 * pages on-brand and localized instead of showing raw "… works!" scaffold text.
 * Pass i18n keys (not literal text) so the content follows the active language.
 */
@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
})
export class ComingSoonComponent {
  /** i18n key for the page heading. */
  @Input() title = 'comingSoon.title';
  /** i18n key for the line describing what the page will offer. */
  @Input() description = 'comingSoon.body';
  /** Material icon name shown in the badge circle. */
  @Input() icon = 'construction';
  /** Optional in-app path for the "back" button; the button is hidden when null. */
  @Input() backLink: string | null = null;
}
