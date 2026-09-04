import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { applicantGuard } from './guards/applicant.guard';
import { recruiterGuard } from './guards/recruiter.guard';

export const routes: Routes = [
  // Public pages
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'employers', loadComponent: () => import('./pages/employers/employers.component').then(m => m.EmployersComponent) },
  { path: 'jobs', loadComponent: () => import('./pages/jobs/jobs.component').then(m => m.JobsComponent) },
  { path: 'jobs/:id', loadComponent: () => import('./pages/job-detail/job-detail.component').then(m => m.JobDetailComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },

  // Applicant pages (protected)
  {
    path: 'applicant',
    canActivate: [authGuard, applicantGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/applicant/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'applications', loadComponent: () => import('./pages/applicant/applications/applications.component').then(m => m.ApplicationsComponent) },
      { path: 'applications/:id', loadComponent: () => import('./pages/applicant/application-detail/application-detail.component').then(m => m.ApplicationDetailComponent) },
      { path: 'saved-jobs', loadComponent: () => import('./pages/applicant/saved-jobs/saved-jobs.component').then(m => m.SavedJobsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/applicant/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'verification', loadComponent: () => import('./pages/applicant/verification/verification-page.component').then(m => m.VerificationPageComponent) },
      { path: 'documents', loadComponent: () => import('./pages/applicant/documents/documents.component').then(m => m.DocumentsComponent) },
      { path: 'interviews', loadComponent: () => import('./pages/applicant/interviews/interviews.component').then(m => m.InterviewsComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/applicant/notifications/notifications.component').then(m => m.NotificationsComponent) },
      { path: 'ai-tools', loadComponent: () => import('./pages/applicant/ai-tools/ai-tools.component').then(m => m.AiToolsComponent) }
    ]
  },

  // Recruiter pages (protected)
  {
    path: 'recruiter',
    canActivate: [authGuard, recruiterGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/recruiter/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'jobs', loadComponent: () => import('./pages/recruiter/jobs/jobs.component').then(m => m.JobsComponent) },
      { path: 'jobs/create', loadComponent: () => import('./pages/recruiter/job-create/job-create.component').then(m => m.JobCreateComponent) },
      { path: 'jobs/:id/edit', loadComponent: () => import('./pages/recruiter/job-create/job-create.component').then(m => m.JobCreateComponent) },
      { path: 'jobs/:id/distribution', loadComponent: () => import('./pages/recruiter/distribution/distribution.component').then(m => m.DistributionComponent) },
      { path: 'jobs/:id/applications', loadComponent: () => import('./pages/recruiter/job-applications/job-applications.component').then(m => m.JobApplicationsComponent) },
      { path: 'talent', loadComponent: () => import('./pages/recruiter/talent/talent.component').then(m => m.TalentComponent) },
      { path: 'talent/:id', loadComponent: () => import('./pages/recruiter/talent-detail/talent-detail.component').then(m => m.TalentDetailComponent) },
      { path: 'interviews', loadComponent: () => import('./pages/recruiter/interviews/interviews.component').then(m => m.InterviewsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/recruiter/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/recruiter/notifications/notifications.component').then(m => m.NotificationsComponent) },
      { path: 'ai-tools', loadComponent: () => import('./pages/recruiter/ai-tools/ai-tools.component').then(m => m.AiToolsComponent) }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '/home' }
];
