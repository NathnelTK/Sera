import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { FooterComponent } from '../../core/layout/footer/footer.component';

/**
 * Public employer landing page (Greenhouse-inspired). Accessible without an account; cross-links
 * to the job-seeker home and routes hiring CTAs to registration.
 */
@Component({
  selector: 'app-employers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, TranslatePipe, FooterComponent],
  templateUrl: './employers.component.html',
  styleUrl: './employers.component.scss',
})
export class EmployersComponent {
  readonly valueProps = [
    { icon: 'verified_user', titleKey: 'employers.value.verifiedTitle', descKey: 'employers.value.verifiedDesc' },
    { icon: 'view_kanban', titleKey: 'employers.value.pipelineTitle', descKey: 'employers.value.pipelineDesc' },
    { icon: 'groups', titleKey: 'employers.value.reachTitle', descKey: 'employers.value.reachDesc' },
  ];

  readonly steps = [
    { n: 1, titleKey: 'employers.how.step1Title', descKey: 'employers.how.step1Desc' },
    { n: 2, titleKey: 'employers.how.step2Title', descKey: 'employers.how.step2Desc' },
    { n: 3, titleKey: 'employers.how.step3Title', descKey: 'employers.how.step3Desc' },
  ];
}
