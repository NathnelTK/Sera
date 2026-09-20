# TalentOS Recruitment MVP Roadmap

## Goal

Deliver the incomplete recruitment workflows as small, reviewable Pull Requests while preserving the existing Angular standalone-component frontend, ASP.NET Core CQRS backend, EF Core persistence model, authentication model, design system, and seeded development data.

The roadmap replaces the previous all-at-once feature audit. Each phase below is an independently buildable and testable vertical slice and must be merged before work that depends on it begins.

## Confirmed Architecture

- Frontend: Angular 18 standalone components, services, signal stores, guards, interceptors, and bundled English/Amharic translations.
- Backend: ASP.NET Core with controllers, MediatR CQRS handlers, domain repository interfaces, and EF Core repository implementations.
- Recruitment entities already exist for jobs, applications, applicant and recruiter profiles, skills, experience, education, companies, locations, categories, notifications, documents, interviews, and identity verification.
- Public job browsing and job details are separate from authenticated application submission.
- Fayda verification is identity data and must not be used as the applicant's professional profile.

## Delivery Rules

1. Use one branch and Pull Request per phase or independently reviewable slice.
2. Do not mix unrelated cleanup, package upgrades, migrations, or formatting into a feature PR.
3. Reuse the existing controller, CQRS, repository, store, service, routing, and translation patterns.
4. Use backend data for persisted resources. Do not add frontend mock records when corresponding entities or endpoints exist.
5. Browsing and viewing published jobs remain public. Applying, editing a profile, posting jobs, and talent discovery require the appropriate authenticated role.
6. Apply filtering before pagination in the database. Never filter only the current frontend page.
7. Keep URL query parameters as the source of shareable job and talent discovery filters.
8. Every page must have resource-specific loading, error, empty, and success states.
9. A visible feature must either work end to end or be excluded from the current MVP navigation with its limitation documented. Removing a "Coming Soon" label alone is not implementation.
10. Schema changes require a migration, migration review, and compatibility notes.

## PR 1: Job Discovery and Navigation

Status: implementation in progress.

### Scope

- Keep `/jobs` independent from the current user's applications.
- Extend `GET /api/jobs` through the existing CQRS/repository path.
- Support keyword search across title, description, requirements, company, required skills, and tags.
- Support category, location, employment type, and work-mode filters where existing job fields support them.
- Return category and location summaries needed by job cards.
- Initialize filters from URL query parameters.
- Send homepage location and popular-category selections as dedicated query parameters.
- Show "No jobs match your current filters" instead of an applications empty state.
- Allow filters to be changed and cleared.
- Preserve public job details and authenticated application submission behavior.

### Edge Cases

- Normalize whitespace and perform case-insensitive comparisons.
- Reject or ignore invalid enum query values without crashing the page.
- Apply all active filters with AND semantics.
- Treat missing category/location relationships as non-matches only when that filter is active.
- Do not expose draft, closed, or archived jobs.
- Keep page size capped by the existing pagination policy.
- Return an empty result, not an error, when no jobs match.
- Do not treat zero applications as zero available jobs.

### Acceptance Criteria

- `Find Jobs` opens `/jobs` for anonymous and authenticated users.
- Published seeded jobs load without querying applications.
- Keyword, category, location, job type, and work mode alter backend results.
- `/jobs?category=Healthcare` initializes and applies the Healthcare filter.
- `/jobs?location=Addis%20Ababa` initializes and applies the location filter.
- Filters can be combined and cleared.
- Job cards show available company, category, and location values.
- Job details remain accessible and applicants can apply through the existing flow.
- Backend and frontend production builds pass.

### Follow-up

- Replace the frontend's fixed popular-category list with a categories endpoint when category administration is introduced. Until then, unmatched configured categories correctly return an empty result.
- Add repository integration tests against PostgreSQL or a provider with equivalent case-insensitive behavior.

## PR 2: Applicant Professional Profile and Verification Separation

Status: implemented in `feat/applicant-professional-profile`; awaiting review.

### Profile History Editing

Status: implemented in `feat/editable-profile-history`; awaiting review.

- Education and experience entries can be removed through an authenticated self-profile endpoint.
- Updates are validated for required fields, year/date ranges, and collection limits.
- Child collections are loaded as tracked entities so replacement/removal persists correctly.
- Add-entry forms remain a follow-up UI enhancement; existing entries are editable through the profile workflow and the endpoint supports full replacement payloads.

### Scope

- Move Fayda verification to a dedicated applicant route and navigation item.
- Build the professional profile page around the existing applicant endpoint and profile entity.
- Support first name, last name, headline, summary, phone, avatar URL, location, LinkedIn, GitHub, portfolio, and open-to-work status where persistence exists.
- Display persisted skills, education, and experience. Their mutation APIs remain a follow-up because ownership, duplicate handling, and date validation are not yet defined.
- Display profile completion based only on persisted, recruiter-visible fields.
- Keep identity verification status as a separate badge/link, not profile content.

### Required Technical Review

- Verify every update command resolves the current user's profile server-side rather than trusting a route ID.
- Resolve the current controller's unused applicant route ID and standardize self-profile access (`/me` preferred) before exposing editing broadly.
- Define ownership and validation for skill, education, experience, and media-link mutations.
- Decide whether avatar remains URL-based or moves to the document-storage phase.

### Edge Cases

- New accounts with an empty profile.
- Partial profiles and optional fields.
- Duplicate skills and overlapping experience dates.
- Invalid or unsafe external URLs.
- Concurrent profile edits.
- A recruiter viewing a candidate must receive only recruiter-safe fields; private contact and identity data require an explicit policy.

### Acceptance Criteria

- Profile and Fayda routes, labels, and responsibilities are distinct.
- Applicants can create, view, edit, and persist professional data.
- Unauthorized users cannot update another applicant's profile.
- Profile completion updates from persisted data and has documented scoring rules.

## PR 3: Recruiter Talent Discovery

Status: implemented in `feat/recruiter-talent-discovery`; awaiting review.

### Scope

- Add a guarded `/recruiter/talent` route and correct every authenticated `Find Talent` link.
- Implement a paged candidate-discovery query using applicant professional profiles.
- Search by candidate name, headline, summary, and skills.
- Filter by location, skill, open-to-work state, and experience only where reliably represented.
- Add a recruiter-safe candidate details response and profile page.

### Architecture and Privacy

- Do not reuse unrestricted public applicant DTOs without reviewing exposed fields.
- Candidate discovery must be recruiter-authorized at the endpoint, not only route-guarded in Angular.
- Exclude Fayda identifiers, date of birth, document locations, private verification payloads, and other identity data.
- Define whether non-open-to-work candidates are hidden or merely deprioritized before implementation.
- Filter in the repository/query before pagination and use deterministic sorting.

### Edge Cases

- Candidates with no skills, experience, location, or headline.
- Duplicate skill names and case variants.
- Empty queries and no-match queries.
- Deleted/deactivated users.
- Recruiters without a completed recruiter/company profile.

### Acceptance Criteria

- Authenticated recruiters reach talent discovery instead of registration.
- Applicants and anonymous users cannot call talent discovery.
- Search and supported filters affect database results.
- Recruiters can open a safe professional candidate profile.

## PR 4: Recruiter Job Ownership and Applicant Pipeline Hardening

Status: implementation in progress on `feat/harden-recruitment-ownership`.

### Scope

- Replace placeholder recruiter-profile claim handling with a user-to-recruiter-profile lookup.
- Enforce ownership for list, update, publish, close, delete, and job-applications operations.
- Verify applicant application queries are scoped to the current applicant.
- Preserve duplicate-application protection with a database unique constraint.
- Complete shortlist, reject, accept, withdraw, and interview transitions using existing workflow enums.

### Edge Cases

- A recruiter attempts to mutate another recruiter's job or application.
- A job is closed after its details page loads but before application submission.
- An applicant submits twice concurrently.
- Invalid or terminal status transitions.
- Deadline expiry and timezone handling.
- Deleting jobs with applications; define archive/soft-delete behavior before allowing destructive deletion.

### Acceptance Criteria

- Every protected operation derives actor identity from claims and verifies resource ownership.
- Invalid transitions return consistent problem details.
- Concurrent duplicate applications are prevented at database level.
- Applicant and recruiter application lists expose only authorized records.

## PR 5: Dashboard Responsibility and Navigation Audit

### Scope

- Make the applicant dashboard discovery-first: search entry, popular categories, recent/recommended published jobs, profile link, and a separate applications summary.
- Keep application counts as secondary status information, never as the source of available jobs.
- Add recruiter `Find Talent` navigation after PR 3.
- Audit navbar, sidebar, cards, footer, and empty-state links for correct role-aware destinations.
- Add dedicated empty states for jobs, applications, saved jobs, candidates, notifications, interviews, and documents.

### Acceptance Criteria

- Zero applications never causes a job-discovery empty state.
- Every visible navigation action has a valid route and correct authorization behavior.
- Authenticated users are not redirected to registration for role-appropriate features.
- Desktop and mobile navigation expose equivalent core workflows.

## PR 6: Supporting MVP Features

Status: notifications slice implemented in `feat/notifications-mvp`; awaiting review.

### Job Distribution Workflow

Status: channel selection and review workflow implemented in `feat/job-distribution-workflow`; awaiting review.

- Recruiters can select Website, Telegram, LinkedIn, Facebook, or X channels.
- Channel-specific draft content is persisted per job and can be reviewed and edited.
- Drafts are recruiter-owned and require explicit approval before being marked approved.
- External provider credentials and live delivery remain gated work; no provider is falsely reported as published without credentials.
- Local Llama generation can be connected through the existing Ollama adapter in the AI PR.

Implement each item as a separate PR when the prerequisite data model is ready.

### Saved Jobs

Status: implemented in `feat/saved-jobs`; awaiting review.

### Application Documents and Modes

Status: implemented in `feat/document-portal-application-modes`; awaiting review.

- PDF CV uploads are stored in the existing local document storage and linked to both `Document` and `CV` records.
- PDF text is extracted locally with PdfPig without an external API key.
- Applicant document reads are self-scoped.
- Applications require an applicant-owned CV and accept `Quick` or `Manual` mode.
- Quick Apply submits the saved profile and selected CV; Manual Apply additionally requires a cover letter.
- Existing document IDs are resolved to their owned CV records server-side to prevent the previous document/CV ID mismatch.
- Production object storage, virus scanning, and full document type management remain separate operations work.

- Add a persisted applicant-to-job relationship with a unique constraint.
- Add save, unsave, and paged list endpoints plus optimistic UI with rollback.
- Handle jobs closed or deleted after being saved.

### Notifications

- Verify recipient scoping and unread counts.
- Add single/all mark-read behavior and pagination.
- Link notification types only to routes the recipient may access.

### Documents

- Replace placeholder URLs with configured object storage.
- Validate file size, MIME type, extension, ownership, malware-scanning strategy, and signed download access.
- Never expose storage credentials or unrestricted private URLs.

### Recommendations

- Start with deterministic matching using category, skills, location, type, and work mode.
- Document scoring and provide a normal recent-jobs fallback.
- Do not label simulated AI output as production AI.

## PR 7: Quality, Security, and Operations

### Scope

- Add application and repository tests for job search, ownership, authorization, profile updates, candidate privacy, and status transitions.
- Add Angular tests for query-param initialization, filter clearing, role navigation, empty states, and API errors.
- Add CI for `dotnet build`, `dotnet test`, `npm ci`, `npm test -- --watch=false`, and `npm run build`.
- Upgrade vulnerable `Microsoft.OpenApi` and `System.Security.Cryptography.Xml` dependencies in an isolated dependency PR.
- Review Angular initial bundle and component style budget warnings in a performance PR.
- Update README endpoint documentation to match implemented contracts.

## Deferred Features

The following remain outside the MVP unless real infrastructure and product rules are supplied:

- Generative AI resume analysis.
- AI candidate scoring or ranking.
- Automated job posting.
- Advanced recruiter analytics.
- External portfolio ingestion.
- Production file malware scanning without a selected provider.

These features must be hidden or clearly identified as unavailable; simulated responses must not be presented as real production intelligence.

## Definition of Done for Every PR

- Scope is limited to one roadmap slice.
- API contract and authorization behavior are documented.
- Backend and frontend compile.
- Relevant automated tests pass or missing coverage is explicitly documented.
- Loading, empty, error, success, and retry states are implemented.
- Validation and ownership checks exist server-side.
- Database filtering occurs before pagination.
- No unrelated working-tree changes are staged.
- Migration and rollback implications are documented when schema changes occur.
- PR description lists changed endpoints, frontend routes, persistence changes, test evidence, known limitations, and screenshots for visible UI changes.
