import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { TalentProfile, TalentService } from '../../../services/talent.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-talent-detail', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  template: `
    <div class="detail-page afriwork-container afriwork-fade-in">
      <a mat-button routerLink="/recruiter/talent"><mat-icon>arrow_back</mat-icon>{{ 'talent.back' | translate }}</a>
      @if (loading()) { <div class="state"><mat-spinner diameter="42" /></div> }
      @else if (error()) { <div class="state error"><mat-icon>error_outline</mat-icon>{{ 'talent.error.detail' | translate }}</div> }
      @else {
      @if (profile(); as p) {
        <section class="hero"><div class="avatar">@if (p.avatarUrl) { <img [src]="p.avatarUrl" [alt]="p.firstName + ' ' + p.lastName" /> } @else { <mat-icon>person</mat-icon> }</div><div><h1>{{ p.firstName }} {{ p.lastName }}</h1><p>{{ p.headline || ('talent.noHeadline' | translate) }}</p>@if (p.location) { <span class="meta"><mat-icon>location_on</mat-icon>{{ p.location.city }}, {{ p.location.country }}</span> }</div></section>
        <div class="grid"><mat-card><mat-card-header><mat-card-title>{{ 'profile.about' | translate }}</mat-card-title></mat-card-header><mat-card-content><p>{{ p.summary || ('talent.noSummary' | translate) }}</p></mat-card-content></mat-card><mat-card><mat-card-header><mat-card-title>{{ 'profile.skills' | translate }}</mat-card-title></mat-card-header><mat-card-content><div class="skills">@for (skill of p.skills; track skill.name) { <span>{{ skill.name }}</span> } @empty { <em>{{ 'profile.empty.skills' | translate }}</em> }</div></mat-card-content></mat-card><mat-card class="wide"><mat-card-header><mat-card-title>{{ 'profile.experience' | translate }}</mat-card-title></mat-card-header><mat-card-content>@for (item of p.experiences; track item.companyName + item.title) { <article><strong>{{ item.title }}</strong><span>{{ item.companyName }}</span><small>{{ item.startDate | date:'MMM y' }} – {{ item.isCurrentPosition ? ('profile.present' | translate) : (item.endDate | date:'MMM y') }}</small><p>{{ item.description }}</p></article> } @empty { <em>{{ 'profile.empty.experience' | translate }}</em> }</mat-card-content></mat-card></div>
      }
      }
    </div>
  `,
  styles: [` .detail-page { padding: var(--afriwork-spacing-xl) var(--afriwork-spacing-md); max-width: 1000px; } .state { min-height: 280px; display: grid; place-content: center; justify-items: center; gap: 1rem; color: var(--afriwork-gray); } .error { color: var(--afriwork-error); } .hero { display: flex; align-items: center; gap: 1.25rem; margin: 1rem 0 1.5rem; padding: 1.5rem; border-radius: var(--afriwork-radius-lg); background: #f2f8f5; } .hero h1 { margin: 0; } .hero p { color: var(--afriwork-gray-dark); } .avatar { width: 104px; height: 104px; border-radius: 24px; overflow: hidden; display: grid; place-items: center; background: var(--afriwork-primary); color: white; } .avatar img { width: 100%; height: 100%; object-fit: cover; } .avatar mat-icon { font-size: 56px; width: 56px; height: 56px; } .meta { display: flex; align-items: center; gap: .25rem; color: var(--afriwork-gray); } .meta mat-icon { font-size: 17px; width: 17px; height: 17px; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; } .wide { grid-column: 1 / -1; } .skills { display: flex; flex-wrap: wrap; gap: .4rem; } .skills span { padding: .3rem .6rem; border-radius: 999px; background: #edf5f0; color: #236044; } article { display: grid; gap: .2rem; padding: .75rem 0; border-top: 1px solid var(--afriwork-gray-light); } article:first-child { border-top: 0; } article span, article small { color: var(--afriwork-gray); } @media (max-width: 700px) { .hero { align-items: flex-start; flex-direction: column; } .grid { grid-template-columns: 1fr; } .wide { grid-column: auto; } } `],
})
export class TalentDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TalentService);
  readonly profile = signal<TalentProfile | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() { void this.load(); }
  async load(): Promise<void> {
    try { const id = this.route.snapshot.paramMap.get('id'); if (!id) throw new Error(); this.profile.set(await firstValueFrom(this.service.getById(id))); }
    catch { this.error.set(true); }
    finally { this.loading.set(false); }
  }
}
