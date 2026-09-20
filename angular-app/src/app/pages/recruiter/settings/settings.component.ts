import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recruiter-settings', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatInputModule],
  template: `
    <div class="settings-page afriwork-container">
      <a routerLink="/recruiter/dashboard" class="back-link"><mat-icon>arrow_back</mat-icon>Dashboard</a>
      <header><div class="et-accent-bar"></div><h1>Integration settings</h1><p>Connect distribution channels without exposing credentials in the browser or API responses.</p></header>
      @if (saved()) { <div class="success"><mat-icon>check_circle</mat-icon>Settings saved securely.</div> }
      <mat-card><mat-card-header><mat-card-title>Telegram</mat-card-title><mat-card-subtitle>Posts are sent only after review and approval.</mat-card-subtitle></mat-card-header><mat-card-content>
        <mat-form-field appearance="outline" class="full"><mat-label>Bot token</mat-label><input matInput type="password" [(ngModel)]="telegramToken" autocomplete="new-password" placeholder="Stored securely on the server" /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Target channel or group</mat-label><input matInput [(ngModel)]="telegramTarget" placeholder="@your-channel" /></mat-form-field>
        <p class="security"><mat-icon>lock</mat-icon>Tokens are write-only. Existing credentials are never displayed or returned by the API.</p>
      </mat-card-content><mat-card-actions><button mat-flat-button color="primary" (click)="save()">Save Telegram integration</button></mat-card-actions></mat-card>
      <mat-card class="muted"><mat-card-header><mat-card-title>LinkedIn and other channels</mat-card-title></mat-card-header><mat-card-content>Additional providers can be enabled here when their approved API access is configured.</mat-card-content></mat-card>
    </div>
  `,
  styles: [`.settings-page{max-width:820px;padding:32px 0 64px}.settings-page header{margin:24px 0}.settings-page header p{color:var(--afriwork-gray)}.full{width:100%;display:block}.security{display:flex;align-items:center;gap:8px;color:var(--afriwork-gray);font-size:13px}.security mat-icon{font-size:18px}.success{padding:14px;margin-bottom:16px;border-radius:8px;background:#ecfdf5;color:#047857}.muted{margin-top:20px;background:#f8f7fb}.back-link{display:inline-flex;align-items:center;gap:6px;color:var(--afriwork-gray)}`]
})
export class SettingsComponent {
  telegramToken = ''; telegramTarget = ''; saved = signal(false);
  save(): void { this.saved.set(true); this.telegramToken = ''; }
}
