import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { FooterComponent } from '../../core/layout/footer/footer.component';

/**
 * Public job-seeker landing page (Indeed-style). Accessible without an account; the hero search
 * routes into the jobs list with query params, and the page cross-links to the employer homepage.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly searchForm = this.fb.group({
    keyword: [''],
    location: [''],
  });

  /** Popular job categories. `query` is the (English) term sent to the jobs search. */
  readonly categories = [
    { labelKey: 'home.cat.tech', icon: 'code', query: 'Technology' },
    { labelKey: 'home.cat.finance', icon: 'account_balance', query: 'Finance' },
    { labelKey: 'home.cat.health', icon: 'local_hospital', query: 'Healthcare' },
    { labelKey: 'home.cat.education', icon: 'school', query: 'Education' },
    { labelKey: 'home.cat.sales', icon: 'campaign', query: 'Sales' },
    { labelKey: 'home.cat.engineering', icon: 'engineering', query: 'Engineering' },
    { labelKey: 'home.cat.admin', icon: 'business_center', query: 'Administration' },
    { labelKey: 'home.cat.hospitality', icon: 'restaurant', query: 'Hospitality' },
  ];

  readonly valueProps = [
    { icon: 'verified', titleKey: 'home.value.verifiedTitle', descKey: 'home.value.verifiedDesc' },
    { icon: 'badge', titleKey: 'home.value.faydaTitle', descKey: 'home.value.faydaDesc' },
    { icon: 'bolt', titleKey: 'home.value.fastTitle', descKey: 'home.value.fastDesc' },
  ];

  /** Submit the hero search — carries keyword/location into the jobs list. */
  search(): void {
    const keyword = this.searchForm.value.keyword?.trim();
    const location = this.searchForm.value.location?.trim();
    const queryParams: Record<string, string> = {};
    if (keyword) queryParams['search'] = keyword;
    if (location) queryParams['location'] = location;
    this.router.navigate(['/jobs'], { queryParams });
  }

  searchCategory(query: string): void {
    this.router.navigate(['/jobs'], { queryParams: { category: query } });
  }
}
