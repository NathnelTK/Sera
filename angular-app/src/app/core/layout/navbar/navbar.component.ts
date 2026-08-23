import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../../../stores/auth.store';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/**
 * App-wide top navigation. Rendered once in the root shell so every page gets the same header,
 * the top-right language switcher, and a logout flow guarded by a confirmation dialog.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    LanguageSwitcherComponent,
    TranslatePipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  readonly auth = inject(AuthStore);

  /** Ask for confirmation before signing out, to prevent accidental logout. */
  async confirmLogout(): Promise<void> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      restoreFocus: true,
      data: {
        titleKey: 'logout.title',
        messageKey: 'logout.message',
        confirmKey: 'logout.confirm',
        cancelKey: 'logout.cancel',
        danger: true,
      },
    });

    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.auth.logout();
      this.router.navigate(['/home']);
    }
  }

  /** Destination for the "Dashboard" link, based on the signed-in user's role. */
  dashboardLink(): string {
    if (this.auth.isRecruiter()) return '/recruiter/dashboard';
    if (this.auth.isApplicant()) return '/applicant/dashboard';
    return '/home';
  }
}
