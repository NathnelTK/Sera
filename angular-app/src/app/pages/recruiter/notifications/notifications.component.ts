import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../../core/layout/coming-soon/coming-soon.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [ComingSoonComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

}
