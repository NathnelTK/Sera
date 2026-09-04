import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { DocumentRecord, DocumentType, DocumentsService } from '../../../services/documents.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({ selector: 'app-documents', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe], templateUrl: './documents.component.html', styleUrl: './documents.component.scss' })
export class DocumentsComponent {
  private readonly service = inject(DocumentsService);
  readonly documents = signal<DocumentRecord[]>([]); readonly loading = signal(true); readonly error = signal(false); readonly uploading = signal(false); readonly removing = signal<string | null>(null);
  readonly resumeType = DocumentType.Resume;
  constructor() { void this.load(); }
  async load() { this.loading.set(true); this.error.set(false); try { this.documents.set(await firstValueFrom(this.service.getMine())); } catch { this.error.set(true); } finally { this.loading.set(false); } }
  async upload(event: Event) { const input = event.target as HTMLInputElement; const file = input.files?.[0]; input.value = ''; if (!file) return; if (file.type !== 'application/pdf') { this.error.set(true); return; } this.uploading.set(true); try { await firstValueFrom(this.service.upload(file, DocumentType.Resume)); await this.load(); } catch { this.error.set(true); } finally { this.uploading.set(false); } }
  async remove(document: DocumentRecord) { this.removing.set(document.id); try { await firstValueFrom(this.service.remove(document.id)); this.documents.update(items => items.filter(item => item.id !== document.id)); } finally { this.removing.set(null); } }
}
