import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { ApplicantProfile, ProfileService } from '../../../services/profile.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const profile: ApplicantProfile = {
    id: 'profile-1',
    userId: 'user-1',
    email: 'applicant@example.com',
    firstName: 'Abebe',
    lastName: 'Kebede',
    headline: 'Software Engineer',
    isOpenToWork: true,
    skills: [],
    educations: [],
    experiences: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const profileService = {
    getMyApplicantProfile: () => of(profile),
    updateMyApplicantProfile: () => of(void 0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
