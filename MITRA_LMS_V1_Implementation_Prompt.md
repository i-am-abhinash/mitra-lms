# MITRA LMS V1 — Focused Course Authoring & Assignments/Quizzes Merge Prompt

## IMPORTANT: WORK ONLY ON THIS SCOPE

You are modifying the existing `mitra-lms` repository.

Do **not** rebuild the application.
Do **not** redesign the entire LMS.
Do **not** scan the entire repository repeatedly.
Do **not** implement future LMS features.

This task has TWO independent areas:

### AREA A — COURSE AUTHORING

Build/fix the Admin course creation → Course Card → Course Panel → Module → Video/Theory/Course Assignment → Member Course Viewer flow.

### AREA B — EXISTING ASSIGNMENTS + QUIZZES

Merge the existing **Assignments** and **Quizzes** navigation/buttons into ONE button called:

> **Assignments & Quizzes**

This merged section must allow Admin to create BOTH standalone assignments and standalone quizzes.

### CRITICAL SEPARATION

These two systems MUST remain separate.

```text
COURSES
│
└── Course
    │
    ├── Module
    │   ├── Video
    │   ├── Theory
    │   └── Course Assignment
    │
    └── Module
        ├── Video
        ├── Theory
        └── Course Assignment


ASSIGNMENTS & QUIZZES
│
├── Standalone Assignment
└── Standalone Quiz
```

A **Course Assignment is NOT an External Assignment**.

Do not merge their data models or UI unless the existing architecture already requires a shared low-level submission component.

---

# 1. CREDIT-EFFICIENCY RULES

Before changing anything, inspect ONLY the files directly related to these features.

Prioritize:

```text
src/
├── pages/
├── components/
├── routes/
├── services/
├── context/
├── types/
└── firebase/

firestore.rules
storage.rules
package.json
```

Search specifically for existing implementations containing:

`Course`, `Module`, `Lesson`, `Assignment`, `Quiz`, `Submission`, `Admin`, `TeamLeader`, `Member`, `AuthContext`, `Firebase`.

Also search for the CURRENT navigation entries:

`Assignments` and `Quizzes`

Determine where they are rendered, which routes they use, which pages they open, and which Firebase services they use.

### DO NOT

- scan unrelated files
- rewrite authentication
- rewrite Firebase initialization
- recreate existing services
- recreate existing components
- create `CourseV2`
- create `AssignmentV2`
- create `QuizV2`
- create duplicate Firebase services
- redesign unrelated dashboards

If an existing component/service already performs part of the required functionality, extend it.

---

# 2. EXISTING APPLICATION MUST BE PRESERVED

Preserve:

- existing Firebase project
- existing authentication
- existing roles
- existing users collection
- existing teams collection
- existing MITRA visual theme
- existing routing architecture
- existing RadialNavigation
- existing reusable components

Only change what is required for this task.

---

# 3. AREA A — COURSE AUTHORING

The current course creation UI behaves like a survey/wizard.

That is not the desired architecture.

Do NOT simply add more steps to the existing wizard.

The correct flow is:

```text
Admin
 ↓
Create Course
 ↓
Course is created
 ↓
Course Card appears
 ↓
Admin clicks Course Card
 ↓
Course Panel opens
 ↓
Admin creates Modules
 ↓
Admin edits each Module
 ↓
Video / Theory / Course Assignment
 ↓
Save
 ↓
Publish
```

---

# 4. COURSE CREATION

The initial Create Course screen should contain ONLY course-level information.

Example:

```text
CREATE COURSE

Course Title
[................................]

Description
[................................]

Category
[................................]

Difficulty
[................................]

Estimated Duration
[................................]

Thumbnail
[Optional]

[Cancel]        [Create Course]
```

Do NOT force Admin to create modules during this step.

Do NOT make this a long multi-step survey.

After clicking Create Course, the course must actually be created in Firebase.

---

# 5. COURSE CARD

After successful creation, the course must appear as a real course card.

Example:

```text
┌──────────────────────────────────────┐
│        COURSE THUMBNAIL              │
│                                      │
│ PyTorch Fundamentals                 │
│ Learn PyTorch fundamentals...        │
│                                      │
│ 0 Modules                            │
│ Draft                                │
│                                      │
│       [ Open Course ]                │
└──────────────────────────────────────┘
```

The card must use actual Firestore data.

Do not use mock data.

Clicking the card opens the Course Panel.

---

# 6. COURSE PANEL

The Course Panel is the Admin's main workspace for constructing the course.

Admin must be able to:

- create module
- edit module
- delete module
- reorder modules

Use existing components where possible.

Example structure:

```text
┌──────────────────────────────────────────────────────┐
│ ← Courses                                            │
│                                                      │
│ PyTorch Fundamentals                    Draft        │
│                                                      │
│ Course Overview                                      │
│                                                      │
│ MODULES                                              │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Module 1 — PyTorch Basics                        │ │
│ │ 1.1 Introduction                                 │ │
│ │ 1.2 Tensors                                      │ │
│ │ 1.3 Autograd                                     │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ [+ Create Module]                                    │
│                         [Save Draft] [Publish]       │
└──────────────────────────────────────────────────────┘
```

---

# 7. MODULE STRUCTURE

Every module can contain THREE independent sections:

```text
MODULE
│
├── VIDEO
├── THEORY
└── COURSE ASSIGNMENT
```

### NONE OF THESE ARE MANDATORY.

Valid modules include:

- Video only
- Theory only
- Assignment only
- Video + Theory
- Video + Assignment
- Theory + Assignment
- Video + Theory + Assignment
- Empty module

If the existing UI requires content, remove that requirement.

---

# 8. MODULE EDITOR

When Admin clicks Create Module, show a proper content-authoring interface, NOT a survey wizard.

```text
MODULE

Module Title
[................................]

────────────────────────────────
VIDEO
────────────────────────────────

Video URL
[................................]

Optional.

────────────────────────────────
THEORY
────────────────────────────────

Theory / Lesson Content

[ Rich educational content.................... ]

Optional.

────────────────────────────────
COURSE ASSIGNMENT
────────────────────────────────

[ + Add Course Assignment ]

Optional.

────────────────────────────────

[Cancel]                     [Save Module]
```

All three sections must remain optional.

---

# 9. VIDEO SECTION

Video must appear at the TOP of the module.

It is optional.

For V1 use a video URL.

Do NOT add video file storage/upload unless it already exists and works.

If no video exists:

- do not render an empty player
- do not show an error
- omit the video section for the Member

---

# 10. THEORY SECTION

Theory appears BELOW the video.

It is optional.

At minimum support:

- headings
- paragraphs
- lists
- links
- code blocks

Reuse an existing editor if present.

Do NOT introduce a large new editor library unless absolutely necessary.

---

# 11. COURSE ASSIGNMENT

This assignment belongs ONLY to the course/module.

Example:

```text
PyTorch Fundamentals
│
└── Module 3 — ANN Regression
    ├── Video
    ├── Theory
    └── Course Assignment
          "Build an ANN Regression Model"
```

It:

- belongs to the module
- is visible inside the course
- is part of the course learning experience
- can be submitted by the Member

It is NOT the same thing as the standalone assignments in `Assignments & Quizzes`.

---

# 12. COURSE ASSIGNMENT SUBMISSION

For V1, the Member must submit at least ONE of:

- GitHub Repository
- Files
- Folder

Example:

```text
COURSE ASSIGNMENT

Build an ANN Regression Model

GitHub Repository
[................................]

OR

Upload Files
[ Choose Files ]

OR

Upload Folder
[ Choose Folder ]

At least one submission is required.

[Submit Assignment]
```

Do NOT add LinkedIn video, YouTube video, documentation URL, deployment URL, complex evidence, or peer review.

---

# 13. FILE/FOLDER STORAGE

Use Firebase Storage for actual files.

Use Firestore for submission metadata.

Architecture:

```text
GitHub URL
     ↓
Firestore

Files
     ↓
Firebase Storage
     ↓
Firestore metadata

Folder
     ↓
Firebase Storage
     ↓
Firestore metadata
```

Do NOT store binary project files inside Firestore.

For folder upload, preserve relative paths where the browser/API supports directory selection.

---

# 14. COURSE VIEWER

The Member-facing course viewer should follow the same TYPE of learning structure as the reference:

https://rishir123.github.io/MITRA-Students/#/module-1/1.1

Use it only as a structural/UX reference. Do NOT copy the website.

The course viewer should provide:

```text
Course
│
├── Module navigation
│
└── Selected Module
    ├── Video if available
    ├── Theory if available
    └── Course Assignment if available
```

If a module has no video, do not leave a giant empty video area.

If it has no theory, omit the theory section.

If it has no assignment, omit the assignment section.

---

# 15. COURSE PUBLISHING

Course lifecycle:

```text
Draft
Published
```

Only published courses should be visible to Members and Team Leaders.

Do not introduce complicated versioning for V1.

---

# 16. AREA B — MERGE ASSIGNMENTS AND QUIZZES

The CURRENT application has TWO buttons:

```text
Assignments
Quizzes
```

Replace them with ONE button:

```text
Assignments & Quizzes
```

### CRITICAL

This is a NAVIGATION/UI merge.

It does NOT mean:

- merge course assignments into this area
- merge course modules into this area
- make course assignments appear here
- change course assignment relationships

Course assignments remain inside courses.

---

# 17. ASSIGNMENTS & QUIZZES PAGE

When Admin clicks Assignments & Quizzes, show ONE page containing both standalone assessment types.

```text
ASSIGNMENTS & QUIZZES

[ + Create Assessment ]

All
Assignments
Quizzes

────────────────────────────────────────

Python Challenge
Type: Assignment

────────────────────────────────────────

Machine Learning Fundamentals
Type: Quiz

────────────────────────────────────────

Neural Networks Assessment
Type: Assignment
```

The filters are optional, but the top-level navigation MUST remain a single button.

---

# 18. CREATE ASSESSMENT

Admin clicks `+ Create Assessment` and can choose:

```text
Assignment
Quiz
```

Then use the existing appropriate creation flow.

Do not create two top-level navigation systems again.

---

# 19. STANDALONE ASSIGNMENTS

These assignments are NOT associated with courses for this V1.

Example:

```text
Assignments & Quizzes
        ↓
Python Challenge
        ↓
Assignment
        ↓
Member Submission
```

Their submission mechanism should use:

- GitHub
- Files
- Folder

At least one is required.

---

# 20. STANDALONE QUIZZES

Quizzes are managed from Assignments & Quizzes.

Do not create a separate top-level Quiz button.

Preserve the existing quiz implementation as much as possible.

Only modify the navigation and parent management page required to merge Assignments and Quizzes.

Do NOT unnecessarily rewrite the quiz engine.

---

# 21. SUBMISSION RECORDS

Admin needs to know:

> Who submitted and who did not submit?

Monitoring applies to:

- standalone assignments
- standalone quizzes
- course assignments

Keep the UI logically organized and do not mix the authoring structures.

At minimum show:

- Assessment
- Member
- Team
- Submission Status
- Submission Date

Status:

- Submitted
- Not Submitted

---

# 22. ADMIN SUBMISSION MONITORING

Example:

```text
SUBMISSION RECORDS

Assessment:
Python Challenge

Total Members: 50
Submitted: 37
Not Submitted: 13

------------------------------------------------
Member       Team        Status
------------------------------------------------
Abhinash     AI          Submitted
Rahul        AI          Submitted
Sai          Vibe        Not Submitted
Kiran        AI          Submitted
------------------------------------------------
```

Use the existing `users` collection as the source of current club members.

Do NOT create a duplicate member collection.

---

# 23. TEAM LEADER

Team Leaders have the same learning access as Members.

They can:

- access published courses
- open modules
- watch available videos
- read theory
- submit course assignments
- access Assignments & Quizzes
- submit standalone assignments
- take quizzes

Additionally, Team Leaders can monitor submissions of ONLY their own team.

They MUST NOT see:

- other teams
- other teams' members
- other teams' submission records

Do NOT implement team objectives, constraints, tasks, growth metrics, project targets, or team performance analytics in this phase.

---

# 24. MEMBER

Members only need:

```text
Courses
    ↓
Learn
    ↓
Course Assignments

Assignments & Quizzes
    ↓
Standalone Assignments
Standalone Quizzes
    ↓
Submit / Complete
```

Do not add other member functionality.

---

# 25. RADIAL NAVIGATION

Do NOT fix or redesign the existing RadialNavigation in this task unless it directly blocks these pages.

The existing radial button overlap is a separate issue.

Do not consume credits on unrelated UI fixes.

---

# 26. EXISTING UI THEME

Preserve the existing MITRA / ClubAttendance visual language:

- colors
- typography
- cards
- spacing
- buttons
- icons
- RadialNavigation
- existing layout components

The new Course Panel should feel like it belongs to the same MITRA application.

Do not introduce a completely different design system.

---

# 27. COURSE CREATION UI BUGS

Fix ONLY the issues that directly affect the new Course Builder:

- wizard content going underneath the header
- Cancel button not visible
- action buttons hidden
- course creation feeling like a survey

The solution should be structural:

```text
Header
   ↓
Content
   ↓
Actions
```

Do not rely on absolute positioning that causes overlap.

Cancel / Save / Publish must remain visible.

---

# 28. FIREBASE

Continue using the existing Firebase project.

Do NOT create:

- another Firebase project
- another authentication system
- another users collection
- another teams collection

Reuse existing Firebase services.

If existing collections already exist, extend them rather than creating duplicates.

---

# 29. SECURITY

Apply the smallest required security-rule changes.

### Admin

Can manage:

- Courses
- Modules
- Course Assignments
- Standalone Assignments
- Quizzes
- Submission Records

### Team Leader

Can:

- Read published courses
- Read assessments
- Submit own work
- Read own team's submission status

### Member

Can:

- Read published courses
- Read assessments
- Submit own work
- Read own submission

Members cannot modify course content.

Team Leaders cannot modify course content.

Team Leaders cannot read another team's submissions.

---

# 30. IMPORTANT DATA SEPARATION

Maintain this conceptual separation:

```text
COURSE DATA

courses
   ↓
modules
   ↓
course assignments
   ↓
course submissions
```

and:

```text
STANDALONE ASSESSMENTS

assignments
quizzes
   ↓
submissions
```

If the existing database uses different collection names, reuse the existing structure.

Do not create duplicate collections simply to match these names.

---

# 31. DEVELOPMENT ACCOUNTS

Keep the existing development/test accounts:

- Admin
- Team Leader
- Member

Do NOT create large amounts of fake data.

Use those accounts to verify the three roles.

---

# 32. IMPLEMENTATION ORDER

Work in this exact order:

```text
1. Inspect existing relevant course files
2. Inspect existing assignment/quiz navigation
3. Inspect existing submission implementation
4. Fix Course Creation
5. Implement Course Card → Course Panel
6. Implement Module creation
7. Implement optional Video
8. Implement optional Theory
9. Implement Course Assignment inside Module
10. Fix Member Course Viewer
11. Merge Assignments + Quizzes navigation
12. Preserve existing standalone Assignment functionality
13. Preserve existing Quiz functionality
14. Ensure Admin can create both from merged area
15. Verify submission handling
16. Add/verify Admin submission records
17. Add/verify Team Leader own-team monitoring
18. Update only required security rules
19. Run build/typecheck
20. Test the three roles
```

Do not jump ahead.

---

# 33. DO NOT OVER-ENGINEER

For V1, do NOT implement:

- complex analytics
- charts
- AI
- recommendations
- advanced grading
- rubrics
- peer review
- notifications
- certificates
- badges
- gamification
- team objectives
- project tracking
- growth scoring
- team constraints
- video uploads
- LinkedIn integration

The objective is a stable functional foundation.

---

# 34. ACCEPTANCE TEST

## TEST 1 — COURSE CREATION

Login as Admin.

Create:

`PyTorch Fundamentals`

Verify a Course Card appears.

Open the card.

Verify Course Panel opens.

Create Module 1:

```text
Title:
PyTorch Basics

Video:
empty

Theory:
provided

Assignment:
provided
```

Save and verify it works.

Create Module 2:

```text
Video:
provided

Theory:
empty

Assignment:
empty
```

Verify it works.

Create Module 3:

```text
Video:
empty

Theory:
provided

Assignment:
empty
```

Verify it works.

This proves that NONE of the three sections is mandatory.

---

## TEST 2 — MEMBER COURSE VIEWER

Login as Member.

Open the published course.

Verify:

```text
Course
 ↓
Module
 ↓
Video if present
 ↓
Theory if present
 ↓
Course Assignment if present
```

No empty sections should appear.

Submit the course assignment using GitHub, then verify File and Folder submission paths as supported.

---

## TEST 3 — ASSIGNMENTS & QUIZZES MERGE

Verify the application no longer has separate top-level:

```text
Assignments
Quizzes
```

Instead it has:

```text
Assignments & Quizzes
```

Open it.

Verify both existing assessment types are accessible.

Admin can create:

- Standalone Assignment
- Standalone Quiz

from this single area.

---

## TEST 4 — SEPARATION

Verify that a Course Assignment does NOT incorrectly appear as a Standalone Assignment inside the Assignments & Quizzes management area.

Course assignments remain inside their course/module.

Standalone assignments and quizzes remain inside Assignments & Quizzes.

---

## TEST 5 — ADMIN SUBMISSION RECORDS

Admin creates a standalone assignment.

Member submits.

Admin opens submission records.

Verify:

- Member
- Team
- Assessment
- Status
- Submission date

are correct.

Verify current club members who did not submit are shown as:

`Not Submitted`

---

## TEST 6 — TEAM LEADER

Login as Team Leader.

Verify:

- courses accessible
- course assignments accessible
- Assignments & Quizzes accessible
- own submissions possible
- own team's submission records visible

Verify another team's members are NOT visible.

---

# 35. FINAL RULE

If something is not explicitly required in this prompt, DO NOT add it.

If an existing feature is outside this scope and already works, DO NOT modify it.

If a new implementation can reuse an existing component/service, REUSE IT.

If an existing component only needs a small modification, MODIFY IT rather than creating a replacement.

Keep the implementation focused and minimize unnecessary file changes.

At the end, report ONLY:

```text
Files analyzed
Files changed
Course Creation: PASS/FAIL
Course Panel: PASS/FAIL
Module Creation: PASS/FAIL
Course Viewer: PASS/FAIL
Course Assignment: PASS/FAIL
Assignments & Quizzes merge: PASS/FAIL
Standalone Assignment: PASS/FAIL
Standalone Quiz: PASS/FAIL
Submission: PASS/FAIL
Admin Submission Records: PASS/FAIL
Team Leader Monitoring: PASS/FAIL
Security Rules: PASS/FAIL
Build/Typecheck: PASS/FAIL

Remaining blockers:
<only actual blockers>
```
