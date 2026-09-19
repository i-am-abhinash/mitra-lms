# MITRA LMS V1 — Phase-Wise Implementation Plan & Agent Build Prompt

Based on: `MITRA_LMS_V1_PRD.docx` and `MITRA_LMS_V1_SRS.docx`. This groups the SRS's 14-step Implementation Sequence into 8 gated phases, each with an entry point, deliverables, and an exit check drawn directly from the FR-IDs / acceptance criteria already defined in those documents. No new scope is introduced — this is the same plan, organized so each phase has a clear "done" signal before the next starts.

---

## Phase 0 — Foundation & Shared Integration
*(SRS Implementation Sequence steps 1–4)*

**Do:**
- Audit the existing `mitra-lms` repo; preserve working components and the current visual language.
- Wire the shared Firebase project: read-only integration with `users` and `teams` (no duplicate identity/team collections — FR-CORE-01).
- Implement role-aware routing and route guards per the Route family table (§9 SRS).
- Stand up an initial Firestore Security Rules skeleton that resolves role/team from trusted core data/claims, never from client-supplied values (FR-AUTH-02, FR-AUTH-03).
- Complete the MITRA application shell: ClubAttendance theme tokens + RadialNavigation hover parity.

**Exit check:** All three roles can authenticate via the shared Firebase project; sidebar/shell visually matches ClubAttendance; an unauthorized route is blocked both in the UI and by a security rule (not just hidden client-side).

---

## Phase 1 — Learning Core: Courses → Modules → Lessons → Resources
*(Sequence step 5)*

**Do:**
- Implement `courses`, `modules`, `lessons`, `resources` collections per §4.
- Admin: create/edit/archive/publish courses; ordered modules and lessons.
- Video source model: external URL is default; uploaded media is optional and explicitly enabled (FR-LEARN-03).
- Member: view published/authorized content; lesson/course progress tracking (FR-LEARN-04).
- Content versioning: material edits create a new `contentVersion`; existing completions stay valid against the version they completed; new learners get the latest version (§8 SRS).

**Exit check:** Admin can publish a complete course with video + resources; a member can consume it and progress is recorded; editing a published lesson does not invalidate prior completions.

---

## Phase 2 — Assignments & Quizzes
*(Sequence step 6)*

**Do:**
- `assignments`, `assignment_submissions`, `quizzes`, `quiz_attempts` collections.
- Assignment creation with deadline, requirements, and rubric linkage (FR-ASG-01).
- Draft-then-submit flow for members (FR-ASG-02).
- Quiz authoring, attempts, and scoring (FR-QUIZ-01).

**Exit check:** A member can save a draft, submit final assignment evidence, and complete a quiz with a recorded attempt/score — all traceable per FR-ASG/FR-QUIZ requirements.

---

## Phase 3 — Team Objectives, Constraints, Tasks, Projects & Milestones
*(Sequence step 7)*

**Do:**
- `objectives`, `constraints`, `tasks`, `task_assignments`, `projects`, `project_milestones` collections.
- Team Leader UI to define objectives/constraints (using only the supported metric types from the Constraint type table — no arbitrary hidden formulas) and assign tasks to *existing* team members only (FR-TEAM-01, FR-OBJ-01, FR-CON-01, FR-TASK-01, FR-PROJ-01).
- Build out the two concrete team configurations as real test cases: **AI Team** (monthly project objective, milestones, demo/presentation completion) and **Vibe Coding** (default 5-projects/member/month target).

**Exit check:** Both AI Team and Vibe Coding objective/constraint/task/project configurations are demonstrable end-to-end for a Team Leader, scoped to their own team only.

---

## Phase 4 — Submission Center & Rubric Evaluation
*(Sequence steps 8–9)*

**Do:**
- `project_submissions` implementing the full lifecycle: Draft → Submitted → Under Review → Changes Requested → Resubmitted → Evaluated → Accepted/Completed (FR-SUB-01, FR-SUB-02).
- Submission fields: GitHub URL, external demo-video URL (default) or uploaded video (if enabled), documentation, description, technologies, reflection, challenges, improvements.
- `rubrics` and `evaluations` collections implementing the exact rubric data model from SRS §5: criteria weights sum to 100, each criterion scored 0–5, weighted result 0–100, configurable passing threshold, rubric version retained on every evaluation (FR-EVAL-01, FR-EVAL-02).
- Reviewer authorization exactly as the Evaluator table specifies: Admin → any authorized submission; Team Leader → only their own team's submissions; Member → no evaluation permission in V1.

**Exit check:** A full submission cycle — including at least one "Changes Requested" → "Resubmitted" loop — works end to end, and the resulting evaluation retains the rubric version, per-criterion scores, and feedback.

---

## Phase 5 — Growth, Skills & Member Profiles
*(Sequence step 10)*

**Do:**
- `progress`, `growth`, `skills` collections.
- Metric engine implementing the exact formulas from the Metric table (§Metric Engine, SRS) — deterministic, testable, and always paired with a source/detail view (FR-GROW-01).
- Optional growth snapshots per period with source references, while raw activity/evaluation records remain authoritative (FR-GROW-02).
- Member Profile page: identity/team/role, learning progress, assignments, projects, submission history, evaluation history, tasks/objectives, skills, consistency indicators, growth history, feedback.
- Hard rule: growth is never a manually-editable opaque number (FR-GROW-03) — every metric card must expose its definition/source.

**Exit check:** Every member has a profile where every displayed growth metric can be traced back to the specific evidence (submission, evaluation, task) that produced it.

---

## Phase 6 — Team & Admin Dashboards, Notifications, Audit
*(Sequence steps 11–12)*

**Do:**
- Independent dashboard per team; Team Leader scoped to their own team; Admin can traverse Club Overview → Team Dashboard → Member Profile for any team/member.
- `notifications` for deadlines, submissions, and evaluations (FR-NOT-01, Medium priority — fine to keep minimal in V1).
- `audit_logs` for sensitive admin/configuration/evaluation actions, append-only from the client's perspective (FR-AUD-01).

**Exit check:** Admin can navigate club → team → member without leaving the LMS shell; a Team Leader cannot see another team's dashboard even via direct URL; a sensitive action produces an audit log entry.

---

## Phase 7 — Security Hardening, NFR Validation & Launch
*(Sequence steps 13–14)*

**Do:**
- Full Firestore + Storage Security Rules covering every boundary in SRS §13, tested with the Firebase Emulator (or equivalent) for **all three roles**, not just Admin.
- Validate against the stated NFR targets: shell load ≤3s, in-app navigation ≤2s, pagination on large lists, WCAG 2.1 AA on core workflows, no silent data loss on failed submissions/uploads.
- Run the six SRS End-to-End Workflows explicitly, including the unauthorized-access denial workflow.
- Walk the full Definition of Done checklist (SRS §18) and confirm every line before deploying.

**Exit check:** Definition of Done is fully satisfied; deploy V1 only after this phase passes, not before.

---

# Agent Build Prompt

Use this as the standing instruction for any coding agent (Claude Code, Cursor, etc.) working on this project. Paste it at the start of the session or store it as the project's system-level instructions.

```
You are building MITRA LMS V1. Before writing or modifying any code, and before
making any decision about data model, routing, permissions, UI behavior, or
scope, you must consult these two documents, which are the single source of
truth for this project:

  - MITRA_LMS_V1_PRD.docx  (product definition, goals, boundaries, requirements)
  - MITRA_LMS_V1_SRS.docx  (architecture, data model, security rules, NFRs,
                             implementation sequence, Definition of Done)

Rules for how you use them:

1. Before implementing any feature, find and cite the specific requirement ID
   (e.g. FR-SUB-01, FR-EVAL-02) or section in the PRD/SRS that it satisfies.
   If a requested feature has no corresponding requirement, stop and ask
   before building it rather than inventing scope.

2. Follow the phase order in MITRA_LMS_V1_Phase_Plan.md (Phase 0 through
   Phase 7). Do not start a later phase's work until the current phase's
   exit check is met, unless explicitly told to work out of order.

3. Treat the "Explicit V1 Boundaries" section of the PRD as hard constraints,
   not suggestions. In particular:
   - Do not add, remove, or reassign members/teams from the LMS — that is
     MITRA Core / ClubAttendance's responsibility only.
   - Do not implement peer review — only Admin and the responsible Team
     Leader may evaluate submissions.
   - Default every video field to an external URL; uploaded media is opt-in
     and must be explicitly enabled, never the default path.
   - Do not add AI-generated scoring, recommendations, automated judgment,
     or any AI-agent behavior. V1 must only produce clean, structured,
     evidence-based data that a future V2 could consume.
   - Never implement growth as a manually-editable number. Every growth
     metric must be derived from evidence and must expose that evidence.

4. Treat the SRS's data model (§4 Firestore Collections, §5 Rubric Data
   Model) as the authoritative schema. Do not rename fields, add
   undocumented collections, or change relationships without flagging the
   deviation and the reason for it.

5. Security is a backend concern first. Any permission check you add in the
   UI must have a matching Firestore/Storage Security Rule — client-side
   role checks alone are never sufficient (NFR-SEC-01). When you implement
   a new collection or route, also write or update its security rule and
   its emulator test in the same change, not as a follow-up.

6. Preserve the existing ClubAttendance visual language and the
   RadialNavigation hover interaction exactly as implemented — this is a
   named requirement (§15 PRD, §14 SRS), not a nice-to-have. Do not
   introduce a competing navigation pattern or a visually inconsistent page.

7. Every asynchronous view you build must have loading, empty, error, and
   permission-denied states before it is considered complete (§14 SRS).
   A view with only a "happy path" is not done.

8. When you finish a phase, check its exit criteria from
   MITRA_LMS_V1_Phase_Plan.md explicitly and report which are met and which
   are not, rather than declaring the phase complete by default.

9. If anything in a request conflicts with the PRD/SRS (scope, data model,
   security posture, or the V1→V2 AI boundary), say so explicitly and ask
   for direction instead of silently complying or silently ignoring the
   request.

Your first action in any new session on this project should be to locate
and re-read MITRA_LMS_V1_PRD.docx and MITRA_LMS_V1_SRS.docx if they are not
already in context, rather than relying on a prior summary of them.
```
