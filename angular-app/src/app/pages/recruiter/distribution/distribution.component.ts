import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Distribution, DistributionChannel, DistributionService } from '../../../services/distribution.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
@Component({ selector: 'app-distribution', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, TranslatePipe], templateUrl: './distribution.component.html', styleUrl: './distribution.component.scss' })
export class DistributionComponent { private readonly route = inject(ActivatedRoute); private readonly service = inject(DistributionService); readonly jobId = this.route.snapshot.paramMap.get('id')!; readonly drafts = signal<Distribution[]>([]); readonly loading = signal(true); readonly error = signal(false); readonly channels = [DistributionChannel.Website, DistributionChannel.Telegram, DistributionChannel.LinkedIn, DistributionChannel.Facebook, DistributionChannel.X]; readonly selected = signal<DistributionChannel[]>([DistributionChannel.Website]); readonly labels: Record<number, string> = { 1: 'distribution.website', 2: 'distribution.telegram', 3: 'distribution.linkedin', 4: 'distribution.facebook', 5: 'distribution.x' }; constructor() { void this.load(); } async load() { try { this.drafts.set(await firstValueFrom(this.service.get(this.jobId))); } catch { this.error.set(true); } finally { this.loading.set(false); } } toggle(channel: DistributionChannel) { this.selected.update(items => items.includes(channel) ? items.filter(x => x !== channel) : [...items, channel]); } async prepare() { await firstValueFrom(this.service.prepare(this.jobId, this.selected())); await this.load(); } async approve(draft: Distribution) { await firstValueFrom(this.service.approve(draft.id, draft.content)); await this.load(); } }
