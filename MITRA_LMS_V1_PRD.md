__MITRA LMS V1 — Product Requirements Document__

*MITRA — Machine Intelligence Technology Research and Advancement*

Version 1\.0 • V1 implementation baseline • September 2026

# 1\. Product Definition

MITRA LMS V1 is a MITRA\-specific learning, project, task, submission, evaluation, and growth\-monitoring platform\. It is a separate frontend application that shares the existing MITRA Firebase project with ClubAttendance\. MITRA Core remains the source of truth for authentication, users, roles, teams, and team membership\. V1 deliberately contains no AI decision layer; the data model must remain extensible for a future AI\-integrated V2\.

# 2\. V1 Goals

- Create a complete LMS experience inside the MITRA application shell\.
- Provide courses, modules, lessons, videos, resources, assignments and quizzes\.
- Provide team objectives, measurable constraints, tasks, projects and milestones\.
- Provide a first\-class submission system using GitHub repositories, external demo\-video URLs by default, documentation and optional files\.
- Provide structured evaluation using reusable rubrics\.
- Provide separate dashboards for every team and an individual growth profile for every member\.
- Track output, learning, consistency, deadlines, evaluations and evidence without reducing growth to an opaque score\.
- Preserve the ClubAttendance visual language and RadialNavigation hover interaction\.
- Use the same Firebase project and shared users/teams identity\.

# 3\. Explicit V1 Boundaries

- The LMS does not add/remove members, assign members to teams, or change core roles\.
- The LMS does not replace ClubAttendance attendance\.
- Peer review is excluded from V1\. Only Admins and the responsible Team Leader may evaluate submissions\.
- External demo\-video URL is the default\. Uploaded video is optional and must be explicitly enabled/configured\.
- AI\-generated recommendations, automated judging, AI scoring, AI tutors and AI agents are excluded from V1\.
- One universal growth formula is prohibited\. Teams configure measurable objectives using the common metric vocabulary\.

# 4\. Roles & Access

__Role__

__Can do__

__Cannot do__

Admin

All LMS content; all teams; all member profiles; all submissions/evaluations; objectives/constraints; club/team growth; audit

Core member/team identity management in LMS

Team Leader

Own team dashboard; objectives; constraints; tasks; projects; milestones; own\-team submissions/evaluations; own\-team member growth

Other teams; core membership/role changes

Member

Own learning; assignments; quizzes; tasks; projects; submissions; own profile/growth; feedback

Other members' private data; team configuration; evaluation

# 5\. Information Architecture

Primary application areas:

- Dashboard
- Learning: Courses → Modules → Lessons → Videos/Resources → Assignments/Quizzes
- Projects
- Submissions
- Teams
- Objectives / Constraints / Tasks
- Growth / Progress / Skills
- Profile
- Notifications
- Admin\-only course/content, evaluation and audit areas

# 6\. Learning Requirements

- Admin creates, edits, archives and publishes courses\.
- Courses contain ordered modules; modules contain ordered lessons\.
- Lessons can contain video, text/resources and linked assignments/quizzes\.
- Video source model supports external URL as default and uploaded media as optional\.
- Members see published content authorized for them\.
- Lesson/course progress is tracked\.
- Published content is versioned when material learning content changes\. Existing completion remains valid against the version completed; new learners receive the latest version\.

# 7\. Assignments & Quizzes

- Assignments support title, instructions, deadline, resources, evidence requirements, target audience and evaluation configuration\.
- Members can save drafts and submit final evidence\.
- Quizzes support configured questions, attempts, scoring and attempt history\.
- Assignment completion must be traceable to a submission or configured completion event\.

# 8\. Team Objectives, Constraints & Tasks

Every team has an independent dashboard and its own configured objectives\. Team Leaders can create measurable objectives for their existing team members\.

__Constraint type__

__Example__

Project count

5 projects/member/month

Deadline

Complete milestone by Friday

Frequency

At least one completed task/week

Milestone

Complete 4 project milestones

Submission

Submit GitHub \+ demo \+ documentation

Quality

Minimum evaluation score 70%

Learning

Complete specified lessons/assignments

Constraints must use supported metric types rather than arbitrary hidden formulas\. Members can see the objectives and constraints applicable to them\.

# 9\. Team Models

## 9\.1 AI Team

- Monthly AI project objective\.
- Milestones, tasks and assignments\.
- Project submission with evidence\.
- Demo/presentation completion\.
- Evaluation and feedback\.
- On\-time completion and consistency indicators\.

## 9\.2 Vibe Coding Team

- Default monthly target: 5 projects per member\.
- Projects completed versus target\.
- On\-time completion rate\.
- Late/deadline\-proximity indicators\.
- Project evaluation\.
- Consistency of output across the month\.
- Assignment and task completion\.

Future teams reuse the same infrastructure with their own objective and constraint configurations\.

# 10\. Project & Submission System

- Projects support objectives, milestones, deadlines, requirements and evaluation configuration\.
- Members submit GitHub repository URL, demo\-video external URL by default, documentation, optional supporting files, project description, technologies used, learning reflection, challenges and future improvements\.
- GitHub activity may be displayed as evidence when integrated, but it is not an automatic quality score\.
- Submission lifecycle: Draft → Submitted → Under Review → Changes Requested → Resubmitted → Evaluated → Accepted/Completed\.
- Members can reuse their demo video for LinkedIn, portfolio, GitHub README or MITRA showcase\.

# 11\. Evaluation & Rubrics

V1 uses reusable structured rubrics\. Each rubric contains criteria; each criterion has a weight, a 0–5 score scale and level descriptions\. Criterion weights must total 100%\. The system calculates a weighted 0–100 result and supports a configurable passing threshold\.

__Criterion__

__Weight__

__Score__

Functionality

30%

0–5

Code Quality

20%

0–5

Problem Solving

20%

0–5

Documentation

15%

0–5

Presentation

15%

0–5

Evaluator permissions are explicit: Admin may evaluate any submission; the Team Leader responsible for the submission's team may evaluate that team's submissions; Members cannot evaluate in V1\. Evaluation includes scores, strengths, improvement areas, feedback, evaluator and timestamp\.

# 12\. Growth Model

Growth is evidence\-based\. It must not be a manually editable opaque number\. Raw activity and evaluation evidence feed transparent metrics; optional snapshots can be stored for historical performance\.

- Learning progress
- Assignment completion
- Project output
- Target achievement
- Task completion
- Milestone completion
- On\-time rate
- Consistency/frequency
- Evaluation results
- Skills and evidence
- Feedback history

# 13\. Member Profile

- Shared identity/team/role
- Learning progress
- Assignments
- Projects
- Submission history
- Evaluation history
- Tasks/objectives
- Skills
- Consistency and timing indicators
- Growth history
- Feedback

# 14\. Team & Admin Dashboards

Every team has its own dashboard\. Admin can access every team dashboard and drill down to members\. Team Leaders can access only their own team\.

# 15\. UI Requirements

- React \+ TypeScript \+ Vite standalone LMS project\.
- Reuse ClubAttendance theme variables, typography, cards, spacing, animations and reusable visual language\.
- Preserve RadialNavigation and its existing hover interaction\.
- Do not use separate external pages for core LMS functions; workflows remain inside the LMS application shell\.
- Role\-aware navigation, route guards, responsive layouts and consistent loading/empty/error/permission states\.
- Detailed pages may use tabs/secondary navigation while retaining MITRA's visual language\.

# 16\. Non\-Functional Product Targets

__Category__

__V1 target__

Performance

Initial shell target ≤3s on normal broadband; typical authenticated navigation target ≤2s excluding slow network/provider operations

Scale

Design target: 1,000 members, 100 teams, 10,000\+ assignments, 10,000\+ submissions, 100,000\+ activity/progress records

Accessibility

Target WCAG 2\.1 AA for core workflows

Reliability

Recoverable submissions/uploads; no silent loss; explicit async states

Security

Backend\-enforced RBAC; private data isolation; auditable sensitive actions

Maintainability

Feature modules separated; no duplicate core identity; AI\-ready data contracts without AI behavior in V1

# 17\. V1 Acceptance Criteria

- Shared authentication and users/teams work without duplicate identity collections\.
- All three roles have correct application and backend permissions\.
- Admin can build and publish a complete course with video/resources\.
- Members can learn, submit assignments and complete quizzes\.
- Team Leaders can create objectives, constraints, tasks and projects for their team\.
- Members can submit GitHub/demo/documentation evidence\.
- Admin/authorized Team Leader can evaluate using a structured weighted rubric\.
- Every team has a distinct dashboard and metric configuration\.
- Every member has an individual growth profile\.
- Growth is traceable to underlying evidence and is not manually editable as an unexplained score\.
- Content versioning preserves historical completion\.
- Core workflows stay inside the MITRA LMS shell and preserve ClubAttendance visual language\.
- No AI functionality is required for V1\.

