import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobsStore } from '../../../stores/jobs.store';
import { JobFormPayload } from '../../../services/jobs.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import {
  ExperienceLevel,
  EXPERIENCE_LEVEL_OPTIONS,
  JobType,
  JOB_TYPE_OPTIONS,
  WorkMode,
  WORK_MODE_OPTIONS,
} from '../../../core/workflow/workflow';

@Component({
  selector: 'app-job-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './job-create.component.html',
  styleUrl: './job-create.component.scss',
})
export class JobCreateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobsStore = inject(JobsStore);

  readonly jobTypeOptions = JOB_TYPE_OPTIONS;
  readonly workModeOptions = WORK_MODE_OPTIONS;
  readonly experienceLevelOptions = EXPERIENCE_LEVEL_OPTIONS;

  private readonly jobId = this.route.snapshot.paramMap.get('id');
  isEdit = computed(() => !!this.jobId);

  isLoading = computed(() => this.jobsStore.isLoading());
  error = computed(() => this.jobsStore.error());
  saved = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    requirements: [''],
    benefits: [''],
    jobType: [JobType.FullTime, [Validators.required]],
    workMode: [WorkMode.OnSite, [Validators.required]],
    experienceLevel: [ExperienceLevel.Mid, [Validators.required]],
    minSalary: [null as number | null],
    maxSalary: [null as number | null],
    salaryCurrency: ['ETB'],
    deadline: [''],
  });

  constructor() {
    if (this.jobId) {
      void this.load();
    }
  }

  private async load(): Promise<void> {
    await this.jobsStore.loadJobById(this.jobId!);
    const job = this.jobsStore.currentJob();
    if (!job) return;
    this.form.patchValue({
      title: job.title,
      description: job.description,
      requirements: job.requirements ?? '',
      benefits: job.benefits ?? '',
      jobType: job.jobType,
      workMode: job.workMode,
      experienceLevel: job.experienceLevel,
      minSalary: job.minSalary ?? null,
      maxSalary: job.maxSalary ?? null,
      salaryCurrency: job.salaryCurrency ?? 'ETB',
      deadline: job.deadline ? job.deadline.substring(0, 10) : '',
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const text = (s: string | null | undefined) => {
      const t = (s ?? '').trim();
      return t ? t : undefined;
    };
    const num = (n: number | null | undefined) =>
      n === null || n === undefined || Number.isNaN(Number(n)) ? undefined : Number(n);

    const payload: JobFormPayload = {
      title: (v.title ?? '').trim(),
      description: (v.description ?? '').trim(),
      requirements: text(v.requirements),
      benefits: text(v.benefits),
      jobType: v.jobType ?? JobType.FullTime,
      workMode: v.workMode ?? WorkMode.OnSite,
      experienceLevel: v.experienceLevel ?? ExperienceLevel.Mid,
      minSalary: num(v.minSalary),
      maxSalary: num(v.maxSalary),
      salaryCurrency: text(v.salaryCurrency),
      deadline: v.deadline ? new Date(v.deadline).toISOString() : undefined,
    };

    if (this.jobId) {
      const ok = await this.jobsStore.updateJob(this.jobId, payload);
      if (ok) this.router.navigate(['/recruiter/jobs']);
    } else {
      const id = await this.jobsStore.createJob(payload);
      if (id) this.router.navigate(['/recruiter/jobs']);
    }
  }
}
