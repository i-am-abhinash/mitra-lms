# MITRA LMS V1 — Agent Instructions

This file is read automatically at the start of every session. Do not ask
whether to follow it — it is a standing instruction for this repository.

## Source of truth

Before writing or modifying any code, and before making any decision about
data model, routing, permissions, UI behavior, or scope, consult:

- `MITRA_LMS_V1_PRD.docx` — product definition, goals, boundaries, requirements
- `MITRA_LMS_V1_SRS.docx` — architecture, data model, security rules, NFRs,
  implementation sequence, Definition of Done
- `MITRA_LMS_V1_Phase_Plan.md` — the 8-phase build order with exit checks

If these files are not already open in context, locate and read them before
doing anything else. Do not rely on a prior session's summary of them —
re-read the actual files.

## Working rules

1. **Cite before you build.** Before implementing any feature, name the
   specific requirement ID (e.g. `FR-SUB-01`, `FR-EVAL-02`) or PRD/SRS
   section it satisfies. If a requested feature has no corresponding
   requirement, stop and ask before building it — do not invent scope.

2. **Follow phase order.** Work through `MITRA_LMS_V1_Phase_Plan.md`
   Phase 0 → Phase 7 in sequence. Do not start a later phase until the
   current phase's exit check is met, unless explicitly told to skip ahead.

3. **Explicit V1 boundaries are hard constraints:**
   - Never add, remove, or reassign members/teams from the LMS — that
     belongs to MITRA Core / ClubAttendance only.
   - Never implement peer review. Only Admin and the responsible Team
     Leader may evaluate submissions.
   - Default every video field to an external URL. Uploaded media is
     opt-in and must be explicitly enabled — never the default path.
   - Never add AI-generated scoring, recommendations, automated judgment,
     or agent behavior. V1 only produces clean, structured, evidence-based
     data for a future V2 to consume.
   - Never implement growth as a manually-editable number. Every growth
     metric must be derived from evidence and expose that evidence.

4. **Schema is authoritative.** Treat SRS §4 (Firestore Collections) and
   §5 (Rubric Data Model) as fixed. Do not rename fields, add undocumented
   collections, or change relationships without explicitly flagging the
   deviation and its reason.

5. **Security is backend-first.** Every UI permission check needs a
   matching Firestore/Storage Security Rule — client-side checks alone are
   never sufficient. When you add a collection or route, write/update its
   security rule and emulator test in the same change, not as a follow-up.

6. **Preserve the visual language.** Keep the existing ClubAttendance theme
   tokens and the RadialNavigation hover interaction exactly as implemented.
   Do not introduce a competing navigation pattern or an inconsistent page.

7. **No happy-path-only views.** Every async view needs loading, empty,
   error, and permission-denied states before it's considered done.

8. **Report against exit criteria.** When you finish a phase, check its
   exit criteria from the Phase Plan explicitly and report which are met
   and which aren't — don't declare a phase done by default.

9. **Flag conflicts, don't resolve them silently.** If a request conflicts
   with the PRD/SRS (scope, data model, security posture, or the V1→V2 AI
   boundary), say so and ask for direction rather than silently complying
   or silently ignoring it.

## Session efficiency

- Keep sessions scoped to one phase where possible. Start a new session
  for the next phase rather than continuing an already-long one.
- Batch related work into one request (e.g. "feature + its security rule +
  its test") rather than asking for each separately.
- For anything nontrivial, propose a short plan and wait for approval
  before writing code.
- Don't re-summarize the PRD/SRS back to the user once you've confirmed
  you have them — that's overhead, not progress.
