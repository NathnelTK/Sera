/**
 * Shared recruitment-workflow domain model.
 *
 * The .NET backend serialises every enum as its INTEGER value (Program.cs uses plain
 * AddControllers() with no JsonStringEnumConverter), so these enums mirror the server
 * numbers exactly. Helpers return i18n KEYS (run them through the `translate` pipe) and a
 * small set of semantic colour tokens rendered by the global `.wf-chip--*` classes.
 */

// --- Enums (values must match TalentOS.Domain.Enums) -------------------------------------

export enum ApplicationStatus {
  Submitted = 1,
  UnderReview = 2,
  Shortlisted = 3,
  Rejected = 4,
  Accepted = 5,
  Withdrawn = 6,
}

export enum JobStatus {
  Draft = 1,
  Published = 2,
  Closed = 3,
  Archived = 4,
}

export enum InterviewStatus {
  Scheduled = 1,
  Completed = 2,
  Cancelled = 3,
  Rescheduled = 4,
}

export enum InterviewFormat {
  InPerson = 1,
  Video = 2,
  Phone = 3,
}

export enum JobType {
  FullTime = 1,
  PartTime = 2,
  Contract = 3,
  Freelance = 4,
  Internship = 5,
  Temporary = 6,
}

export enum WorkMode {
  OnSite = 1,
  Remote = 2,
  Hybrid = 3,
}

export enum ExperienceLevel {
  Entry = 1,
  Junior = 2,
  Mid = 3,
  Senior = 4,
  Lead = 5,
  Executive = 6,
}

/** Semantic colour token consumed by the global `.wf-chip--{token}` classes. */
export type StatusColor = 'info' | 'progress' | 'shortlist' | 'success' | 'danger' | 'muted';

export interface SelectOption<T> {
  value: T;
  /** i18n key for the option label. */
  labelKey: string;
}

// --- Application status ------------------------------------------------------------------

const APPLICATION_STATUS_KEYS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Submitted]: 'wf.appStatus.submitted',
  [ApplicationStatus.UnderReview]: 'wf.appStatus.underReview',
  [ApplicationStatus.Shortlisted]: 'wf.appStatus.shortlisted',
  [ApplicationStatus.Rejected]: 'wf.appStatus.rejected',
  [ApplicationStatus.Accepted]: 'wf.appStatus.accepted',
  [ApplicationStatus.Withdrawn]: 'wf.appStatus.withdrawn',
};

const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, StatusColor> = {
  [ApplicationStatus.Submitted]: 'info',
  [ApplicationStatus.UnderReview]: 'progress',
  [ApplicationStatus.Shortlisted]: 'shortlist',
  [ApplicationStatus.Rejected]: 'danger',
  [ApplicationStatus.Accepted]: 'success',
  [ApplicationStatus.Withdrawn]: 'muted',
};

export function applicationStatusKey(status: ApplicationStatus): string {
  return APPLICATION_STATUS_KEYS[status] ?? 'wf.appStatus.submitted';
}

export function applicationStatusColor(status: ApplicationStatus): StatusColor {
  return APPLICATION_STATUS_COLORS[status] ?? 'muted';
}

/**
 * Forward pipeline the applicant progresses through. Rejected / Withdrawn are terminal
 * states that sit off this track and are handled separately by the UI.
 */
export const APPLICATION_PROGRESS: ApplicationStatus[] = [
  ApplicationStatus.Submitted,
  ApplicationStatus.UnderReview,
  ApplicationStatus.Shortlisted,
  ApplicationStatus.Accepted,
];

/** Columns for the Greenhouse-style recruiter pipeline board, left to right. */
export const PIPELINE_COLUMNS: ApplicationStatus[] = [
  ApplicationStatus.Submitted,
  ApplicationStatus.UnderReview,
  ApplicationStatus.Shortlisted,
  ApplicationStatus.Accepted,
  ApplicationStatus.Rejected,
];

/**
 * Statuses a recruiter can move a candidate to. Withdrawn is excluded — the backend only
 * lets applicants withdraw (UpdateApplicationStatusCommandHandler rejects it).
 */
export const RECRUITER_MOVE_TARGETS: ApplicationStatus[] = [
  ApplicationStatus.Submitted,
  ApplicationStatus.UnderReview,
  ApplicationStatus.Shortlisted,
  ApplicationStatus.Accepted,
  ApplicationStatus.Rejected,
];

export function isTerminalStatus(status: ApplicationStatus): boolean {
  return status === ApplicationStatus.Rejected || status === ApplicationStatus.Withdrawn;
}

// --- Job status --------------------------------------------------------------------------

const JOB_STATUS_KEYS: Record<JobStatus, string> = {
  [JobStatus.Draft]: 'wf.jobStatus.draft',
  [JobStatus.Published]: 'wf.jobStatus.published',
  [JobStatus.Closed]: 'wf.jobStatus.closed',
  [JobStatus.Archived]: 'wf.jobStatus.archived',
};

const JOB_STATUS_COLORS: Record<JobStatus, StatusColor> = {
  [JobStatus.Draft]: 'muted',
  [JobStatus.Published]: 'success',
  [JobStatus.Closed]: 'danger',
  [JobStatus.Archived]: 'muted',
};

export function jobStatusKey(status: JobStatus): string {
  return JOB_STATUS_KEYS[status] ?? 'wf.jobStatus.draft';
}

export function jobStatusColor(status: JobStatus): StatusColor {
  return JOB_STATUS_COLORS[status] ?? 'muted';
}

// --- Interview status / format -----------------------------------------------------------

const INTERVIEW_STATUS_KEYS: Record<InterviewStatus, string> = {
  [InterviewStatus.Scheduled]: 'wf.intStatus.scheduled',
  [InterviewStatus.Completed]: 'wf.intStatus.completed',
  [InterviewStatus.Cancelled]: 'wf.intStatus.cancelled',
  [InterviewStatus.Rescheduled]: 'wf.intStatus.rescheduled',
};

const INTERVIEW_STATUS_COLORS: Record<InterviewStatus, StatusColor> = {
  [InterviewStatus.Scheduled]: 'info',
  [InterviewStatus.Completed]: 'success',
  [InterviewStatus.Cancelled]: 'danger',
  [InterviewStatus.Rescheduled]: 'progress',
};

export function interviewStatusKey(status: InterviewStatus): string {
  return INTERVIEW_STATUS_KEYS[status] ?? 'wf.intStatus.scheduled';
}

export function interviewStatusColor(status: InterviewStatus): StatusColor {
  return INTERVIEW_STATUS_COLORS[status] ?? 'muted';
}

const INTERVIEW_FORMAT_KEYS: Record<InterviewFormat, string> = {
  [InterviewFormat.InPerson]: 'wf.intFormat.inPerson',
  [InterviewFormat.Video]: 'wf.intFormat.video',
  [InterviewFormat.Phone]: 'wf.intFormat.phone',
};

export function interviewFormatKey(format: InterviewFormat): string {
  return INTERVIEW_FORMAT_KEYS[format] ?? 'wf.intFormat.video';
}

export const INTERVIEW_FORMAT_OPTIONS: SelectOption<InterviewFormat>[] = [
  { value: InterviewFormat.Video, labelKey: 'wf.intFormat.video' },
  { value: InterviewFormat.InPerson, labelKey: 'wf.intFormat.inPerson' },
  { value: InterviewFormat.Phone, labelKey: 'wf.intFormat.phone' },
];

// --- Job taxonomy (labels + form options) ------------------------------------------------

const JOB_TYPE_KEYS: Record<JobType, string> = {
  [JobType.FullTime]: 'wf.jobType.fullTime',
  [JobType.PartTime]: 'wf.jobType.partTime',
  [JobType.Contract]: 'wf.jobType.contract',
  [JobType.Freelance]: 'wf.jobType.freelance',
  [JobType.Internship]: 'wf.jobType.internship',
  [JobType.Temporary]: 'wf.jobType.temporary',
};

export function jobTypeKey(type: JobType): string {
  return JOB_TYPE_KEYS[type] ?? 'wf.jobType.fullTime';
}

const WORK_MODE_KEYS: Record<WorkMode, string> = {
  [WorkMode.OnSite]: 'wf.workMode.onSite',
  [WorkMode.Remote]: 'wf.workMode.remote',
  [WorkMode.Hybrid]: 'wf.workMode.hybrid',
};

export function workModeKey(mode: WorkMode): string {
  return WORK_MODE_KEYS[mode] ?? 'wf.workMode.onSite';
}

const EXPERIENCE_LEVEL_KEYS: Record<ExperienceLevel, string> = {
  [ExperienceLevel.Entry]: 'wf.expLevel.entry',
  [ExperienceLevel.Junior]: 'wf.expLevel.junior',
  [ExperienceLevel.Mid]: 'wf.expLevel.mid',
  [ExperienceLevel.Senior]: 'wf.expLevel.senior',
  [ExperienceLevel.Lead]: 'wf.expLevel.lead',
  [ExperienceLevel.Executive]: 'wf.expLevel.executive',
};

export function experienceLevelKey(level: ExperienceLevel): string {
  return EXPERIENCE_LEVEL_KEYS[level] ?? 'wf.expLevel.mid';
}

export const JOB_TYPE_OPTIONS: SelectOption<JobType>[] = [
  { value: JobType.FullTime, labelKey: 'wf.jobType.fullTime' },
  { value: JobType.PartTime, labelKey: 'wf.jobType.partTime' },
  { value: JobType.Contract, labelKey: 'wf.jobType.contract' },
  { value: JobType.Freelance, labelKey: 'wf.jobType.freelance' },
  { value: JobType.Internship, labelKey: 'wf.jobType.internship' },
  { value: JobType.Temporary, labelKey: 'wf.jobType.temporary' },
];

export const WORK_MODE_OPTIONS: SelectOption<WorkMode>[] = [
  { value: WorkMode.OnSite, labelKey: 'wf.workMode.onSite' },
  { value: WorkMode.Remote, labelKey: 'wf.workMode.remote' },
  { value: WorkMode.Hybrid, labelKey: 'wf.workMode.hybrid' },
];

export const EXPERIENCE_LEVEL_OPTIONS: SelectOption<ExperienceLevel>[] = [
  { value: ExperienceLevel.Entry, labelKey: 'wf.expLevel.entry' },
  { value: ExperienceLevel.Junior, labelKey: 'wf.expLevel.junior' },
  { value: ExperienceLevel.Mid, labelKey: 'wf.expLevel.mid' },
  { value: ExperienceLevel.Senior, labelKey: 'wf.expLevel.senior' },
  { value: ExperienceLevel.Lead, labelKey: 'wf.expLevel.lead' },
  { value: ExperienceLevel.Executive, labelKey: 'wf.expLevel.executive' },
];
