__MITRA LMS V1 — Software Requirements Specification__

*MITRA — Machine Intelligence Technology Research and Advancement*

Version 1\.0 • V1 implementation baseline • September 2026

# 1\. System Architecture

Standalone React 19 \+ TypeScript \+ Vite frontend; shared Firebase Authentication and Firestore project; optional Firebase Storage for explicitly enabled uploads\. ClubAttendance remains the owner of core identity/team/attendance data\. LMS adds only LMS\-domain collections\.

# 2\. Technology Stack

__Layer__

__V1 requirement__

Frontend

React 19, TypeScript, Vite

Routing

React Router

Styling

Tailwind CSS using existing MITRA tokens

Icons

Lucide React where consistent with ClubAttendance

Auth

Existing Firebase Authentication

Database

Existing Firebase Firestore project

Storage

External demo URL by default; Firebase Storage only for enabled uploaded files/video

State

Existing auth/context pattern plus localized feature state

Security

Firestore Security Rules \+ Storage Rules

Deployment

Compatible with existing MITRA deployment

# 3\. Shared Core Data Contract

- users is the identity source of truth: existing fields such as email, name, role and teamId must be consumed rather than duplicated\.
- teams is the team source of truth\.
- Firebase UID is memberId\.
- attendance remains a ClubAttendance domain collection and is not reimplemented by LMS\.
- LMS documents reference memberId/teamId from shared core\.

# 4\. Firestore Collections

__Collection__

__Required purpose__

__Important fields/references__

users

Existing core identity

uid, email, name, role, teamId

teams

Existing core team identity

teamId, name, configuration

courses

Course metadata

title, description, status, version, createdBy

modules

Ordered modules

courseId, title, order

lessons

Versioned lesson content

courseId, moduleId, title, contentVersion, order

resources

Lesson/course resources

lessonId/courseId, sourceType, url/storagePath

assignments

Assignment definitions

courseId/lessonId/teamId/objectiveId, deadline, rubricId

assignment\_submissions

Assignment evidence

assignmentId, memberId, status, submittedAt

quizzes

Quiz definitions

courseId/lessonId, questions, scoring

quiz\_attempts

Attempts

quizId, memberId, score, attemptNo

projects

Projects

teamId, objectiveId, courseId, deadline, rubricId

project\_milestones

Milestones

projectId, title, deadline, status

project\_submissions

Project evidence

projectId, memberId, githubUrl, demoVideo, documentation, status

objectives

Team objectives

teamId, period, target, metricType

constraints

Measurable rules

teamId, objectiveId, type, target, period, threshold

tasks

Team task definitions

teamId, objectiveId, constraintId, title, deadline

task\_assignments

Member task state

taskId, memberId, status, completedAt

rubrics

Reusable evaluation definitions

criteria\[\], passingScore, version

evaluations

Evaluation results

submissionId, evaluatorId, memberId, criterionScores\[\], weightedScore, feedback

progress

Learning/activity progress

memberId, lesson/course references, status

growth

Historical/derived snapshots

memberId/teamId, period, metric values, sourceRefs

skills

Skill records/evidence

memberId, skillId, evidenceRefs

notifications

In\-app alerts

recipientId, type, readAt

audit\_logs

Sensitive actions

actorId, action, targetId, timestamp

# 5\. Rubric Data Model

Required logical shape:

rubric = \{ name, description, version, passingScore, criteria\[\] \}

criterion = \{ id, name, description, weight, maxScore: 5, levels\[\] \}

level = \{ score: 0\.\.5, description \}

- Criteria weights must sum to 100\.
- Every criterion uses a 0–5 score\.
- Weighted percentage = Σ\(\(criterionScore / 5\) × criterionWeight\)\.
- Final weighted score is 0–100\.
- Passing threshold is configurable per rubric\.
- Rubrics are versioned; historical evaluations retain the rubric version used\.
- Criteria descriptions and level descriptions are stored so an evaluation remains interpretable\.

# 6\. Reviewer Authorization

__Actor__

__Can evaluate__

Admin

Any authorized LMS submission

Team Leader

Submission whose teamId equals the leader's teamId

Member

No evaluation permissions in V1

A reviewer must not evaluate outside their authorization scope\. Security Rules must derive the actor's role/team from trusted core identity data or protected claims; client\-supplied role/team values are never trusted\.

# 7\. Video/File Storage

- External demo\-video URL is the default V1 mechanism\.
- Uploaded video/media is optional and must be explicitly enabled\.
- video/sourceType must distinguish external from uploaded content\.
- External URL validation must follow an allowlist/configuration policy where required\.
- If uploaded media is enabled, binary content is stored outside Firestore \(Firebase Storage\), while Firestore stores metadata and ownership\.
- Storage rules must enforce authenticated ownership and authorized access\.
- Uploads require type/size validation and recoverable failure handling\.

# 8\. Content Versioning

- Material edits to published learning content create a new content version\.
- Progress records retain the contentVersion completed\.
- Existing completion is not invalidated by a later edit\.
- New learners receive the latest published version\.
- If a new version must be completed by existing members, the Admin explicitly creates/marks a new required activity; the system does not silently reset completion\.

# 9\. Routing

__Route family__

__Access__

/dashboard

All roles; role\-aware content

/courses

Authorized learning content

/profile

Member: self; Admin/Leader: authorized member detail as applicable

/growth

Member: self; Leader: own team; Admin: all

/submissions

Member: own; Leader: own team; Admin: authorized global

/team/\*

Team Leader: own team; Admin: all; Member: read\-only permitted team views

/admin/\*

Admin only

# 10\. Functional Requirements

__ID__

__Requirement__

__Priority__

FR\-AUTH\-01

Authenticate through existing Firebase Authentication\.

Critical

FR\-AUTH\-02

Resolve role and teamId from shared core identity\.

Critical

FR\-AUTH\-03

Enforce authorization in backend rules, not only route guards\.

Critical

FR\-CORE\-01

Read existing users and teams; do not duplicate them\.

Critical

FR\-LEARN\-01

Create/edit/archive/publish/version courses\.

High

FR\-LEARN\-02

Create ordered modules and lessons\.

High

FR\-LEARN\-03

Attach external video/resource URLs and optionally uploaded media\.

High

FR\-LEARN\-04

Track version\-aware learning progress\.

High

FR\-ASG\-01

Create assignments with requirements/deadlines/rubrics\.

High

FR\-ASG\-02

Save draft and final assignment submissions\.

Critical

FR\-QUIZ\-01

Create quizzes and record attempts/scores\.

High

FR\-TEAM\-01

Give each team an independent dashboard configuration\.

Critical

FR\-OBJ\-01

Create team objectives with periods and targets\.

Critical

FR\-CON\-01

Create measurable constraints using supported metric types\.

Critical

FR\-TASK\-01

Create and assign tasks to existing team members\.

Critical

FR\-PROJ\-01

Create projects and milestones\.

Critical

FR\-SUB\-01

Submit GitHub/demo/documentation evidence\.

Critical

FR\-SUB\-02

Implement submission lifecycle and resubmission\.

Critical

FR\-EVAL\-01

Evaluate using weighted reusable rubrics\.

Critical

FR\-EVAL\-02

Persist evaluator, rubric version, criterion scores and feedback\.

Critical

FR\-GROW\-01

Calculate transparent metrics from evidence\.

Critical

FR\-GROW\-02

Store optional snapshots with source references\.

High

FR\-GROW\-03

Never expose an unexplained manually editable growth score as authoritative\.

Critical

FR\-NOT\-01

Generate relevant deadline/submission/evaluation notifications\.

Medium

FR\-AUD\-01

Audit sensitive configuration/evaluation/admin actions\.

High

# 11\. Metric Engine

__Metric__

__Formula/meaning__

Project Count

Count of qualifying completed projects in period

Target Achievement

Completed qualifying target / configured target × 100, capped/displayed according to UI policy

Task Completion

Completed assigned tasks / assigned tasks × 100

Assignment Completion

Completed required assignments / required assignments × 100

Milestone Completion

Completed milestones / milestones × 100

On\-Time Rate

On\-time completed items / completed items × 100; empty denominator is N/A

Evaluation Score

Weighted rubric score 0–100

Learning Progress

Configured completed learning units / required units × 100

Consistency

Regularity metric based on distribution of qualifying completed work across configured time intervals; must show its definition

Quality Threshold

Boolean/percentage indicating whether configured evaluation threshold is met

Metric calculations must be deterministic, testable and explainable\. The UI must expose the source activity/detail view for important metrics\.

# 12\. Growth Snapshots

The growth collection may store monthly/period snapshots for fast dashboard rendering\. A snapshot must contain the period, metric values, calculation/configuration version where relevant, and references or enough metadata to trace the underlying evidence\. Raw activity/evaluation records remain authoritative\.

# 13\. Security Rules Requirements

- Admin can access all LMS data allowed by domain policy\.
- Team Leader reads/writes only records belonging to their team and only permitted management domains\.
- Members read/write only their own private submissions, progress, tasks and profile\-owned data\.
- Members cannot alter evaluator scores, audit logs, objective definitions or team configuration\.
- Team Leaders cannot change core user role/team membership\.
- Published content access follows course enrollment/publishing policy\.
- Evaluation writes require Admin or matching\-team Team Leader authorization\.
- Audit logs are append\-only from client perspective\.
- Storage access mirrors document ownership/authorization\.
- All critical authorization paths must be tested with Firebase Emulator or equivalent rules tests\.

# 14\. UI/UX Technical Requirements

- Preserve existing ClubAttendance theme tokens and RadialNavigation interaction\.
- Use responsive layouts\.
- Every asynchronous view has loading, empty, error and permission\-denied states\.
- Forms validate required fields before submission and display backend validation errors\.
- Destructive actions require confirmation\.
- Submission pages clearly display deadline, current status and reviewer feedback\.
- Metric cards provide definitions/details instead of unexplained numbers\.
- Video playback must not auto\-load on dashboards\.

# 15\. Non\-Functional Requirements

__ID__

__Requirement__

NFR\-PERF\-01

Initial app shell target ≤3 seconds on normal broadband\.

NFR\-PERF\-02

Typical authenticated navigation target ≤2 seconds excluding slow external/network operations\.

NFR\-PERF\-03

Paginate or incrementally load large lists\.

NFR\-SCALE\-01

Design target: 1,000 members, 100 teams, 10,000\+ assignments, 10,000\+ submissions, 100,000\+ activity/progress records\.

NFR\-A11Y\-01

Core workflows target WCAG 2\.1 AA\.

NFR\-SEC\-01

Backend rules are the security boundary\.

NFR\-REL\-01

Drafts/submissions/uploads must fail visibly and recover where possible\.

NFR\-MAINT\-01

Feature modules must be isolated enough to add future AI services without replacing core domain models\.

NFR\-OBS\-01

Critical errors and audit events must be diagnosable without exposing private member data\.

# 16\. End\-to\-End Workflows

1. Admin signs in → publishes course → adds modules/lessons/video/resources → assigns/opens learning → member completes lesson → progress records update\.
2. Member receives assignment → saves draft → submits evidence → authorized reviewer opens → evaluates rubric → feedback is stored → progress/growth metrics update\.
3. Team Leader creates monthly objective → configures constraints → creates milestones/tasks → assigns to existing members → members complete work → submit project evidence → leader evaluates → team/member dashboards update\.
4. Vibe Coding leader configures 5\-project monthly target → members submit projects during month → system records completion and timing → dashboard shows target achievement, on\-time rate and consistency\.
5. Admin opens club dashboard → selects team → opens team dashboard → selects member → views member profile, evidence, submissions, evaluations and growth history\.
6. Unauthorized member attempts another team's management route or private submission → UI denies access and backend rules reject the request\.

# 17\. Implementation Sequence

1. Audit existing mitra\-lms repository; preserve working components and current visual language\.
2. Integrate shared Firebase configuration and users/teams read model\.
3. Implement role\-aware routing and backend security rules/tests\.
4. Complete MITRA application shell and ClubAttendance theme/RadialNavigation parity\.
5. Implement course/module/lesson/video/resource/version model\.
6. Implement assignments and quizzes\.
7. Implement objectives, constraints, tasks, projects and milestones\.
8. Implement submission center with external demo URL default and optional upload abstraction\.
9. Implement rubric builder and evaluation workflow\.
10. Implement progress, skills, member profile and evidence\-backed growth\.
11. Implement team\-specific dashboards and AI Team/Vibe Coding configurations\.
12. Implement Admin cross\-team dashboard, notifications and audit logs\.
13. Run full three\-role security and end\-to\-end workflow tests\.
14. Deploy V1 only after Definition of Done is satisfied\.

# 18\. Definition of Done

- All Critical requirements are implemented and tested\.
- Firebase Security Rules enforce all three role boundaries\.
- Rubrics, reviewers, video storage, NFRs and content versioning behave exactly as specified\.
- Courses/videos/assignments/quizzes work end to end\.
- Projects/tasks/objectives/constraints/milestones work end to end\.
- GitHub/demo/documentation submission works end to end\.
- Evaluation retains rubric version, criterion scores and feedback\.
- Growth is evidence\-backed and traceable\.
- AI Team and Vibe Coding dashboards meet their V1 requirements\.
- Every team has a dashboard and every member has a profile/growth view\.
- No required feature remains a placeholder\.
- AI functionality is not included in V1\.
- Existing ClubAttendance functionality is not broken by shared backend changes\.

# 19\. V1 → V2 AI Boundary

V1 must collect clean, structured, timestamped and attributable evidence\. V2 may later consume that data for AI\-assisted insights, recommendations, feedback or other approved capabilities\. V1 must not contain AI\-generated scores, hidden profiling, automated member judgments, or speculative AI features\.

