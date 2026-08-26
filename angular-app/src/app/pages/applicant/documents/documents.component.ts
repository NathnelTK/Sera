import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../../core/layout/coming-soon/coming-soon.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [ComingSoonComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {

}
