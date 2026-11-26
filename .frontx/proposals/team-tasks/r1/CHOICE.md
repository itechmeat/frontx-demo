# Proposal record: Tasks

The hand-off between the proposal and the build (references/record.md). Fill every field before the page is shown; a field with nothing to say gets `none`. Until the person answers, every field under "Selection" and "Build hand-off" reads `none yet`. Check it with `scripts/check-proposal.mjs <revision-dir>`.

## Revision

- Page id: team-tasks
- Revision: r1
- Replaces: none
- Status: selected
- Created: 2026-11-26
- Proposal: proposal.html

## Request

- Request: "Add a third page "Tasks" to this app: a team task list where I can see what is in which status and filter by status. Before you build anything, show me how it could look, with three options, so I can choose."
- Purpose: show the team's tasks and what is in which status
- Users: a team member or team lead checking the state of work
- Main task: see the tasks by status and filter by one status
- Assumptions: twelve sample tasks with title, assignee, status and due date; statuses To do, In progress, In review, Done; the page is for looking and filtering, not editing; the chosen status tab is not kept in the address
- Non-goals: adding, editing or deleting tasks; sign-in, accounts or real team data

## Proposal

- Design: options
- Option a: Table with status tabs. Best for: scanning all twelve tasks in one list and comparing due dates. Trade-off: the split by status is read from the tabs and badges, not from the layout.
- Option b: Board, a column per status. Best for: seeing at a glance how much sits in each status. Trade-off: on a phone only one status column shows at a time.
- Option c: Cards grouped by person. Best for: seeing who has what, and who is overloaded or late. Trade-off: comparing due dates across people takes more reading.
- Recommended: A, it shows every task with status and due date at every width and the tabs filter it directly
- Open questions: 1. does the All tab include Done tasks (the status tabs); 2. can a task's status be changed on the page (the status badges)
- Ready answers: 1. All includes Done (suggested), All hides Done; 2. Read only (suggested), Change in place
- Decisions: Tasks as the third header link after Docs (the request): accepted; status tabs with counts directly above the tasks (our proposal): proposed; page head like Docs (the survey): proposed; tasks sorted by due date (our proposal): proposed; red Overdue badge (our proposal): proposed; All includes Done (our proposal): open q-1; read only (our proposal): open q-2
- Reuses: page head and lead, as on Docs (Text, the Docs page head CSS); status tabs (Tabs, TabsList, TabsTrigger, as on Docs and Home); task table (Table in a Card, as on Docs and Home); status and overdue badges (Badge, as on Home); person cards (Card, as on Docs); New: assignee initials (Avatar); board columns in option B (a kit gap, columns of Cards)
- Optional parts: flow: not added, one screen with no decision across screens; storyboard: not added, a status tab is one press between two states the drawings show; guarantees: not added, the page promises nothing of that kind; position cue: added, the page has eleven sections after the head

## Versions and survey

- Kit version: 0.5.0
- Template versions: frontx-template-shell 0.1.0-alpha.9 (applied), frontx-template-mfe 0.1.0-alpha.8 (applied), template-design-guardrails 0.1.0-alpha.9 (applied), frontx-design-proposal skill 0.8.0
- Survey: FrontX, top header with Home and Docs at the far end (survey read it as a side menu, corrected from Layout.tsx), screens Home /home and Docs /docs, links /?screen=<route>, service AccountsApiService, theme default

## Selection

- Person's words: "For the Tasks proposal (page team-tasks, revision r1) I choose option B, "Board, a column per status". / My answers to the open questions: / 1. The All tab shows every task, Done ones included, so its count is the total of the four status tabs. / 2. The Tasks page is read only: a task's status is shown but not changed on the page. / Changes: none"
- Chosen: B
- Answers: 1. All includes Done (the suggested answer, sent by the person); 2. Read only (the suggested answer, sent by the person)
- Requested changes: none
- Selected on: 2026-11-26

## Build hand-off

- Route: /tasks, address /?screen=tasks, new package src-app/mfe_packages/tasks-mfe
- Menu place: label Tasks, order 30, after Home (10) and Docs (20)
- Regions: 1440: page head, status tabs, four board columns side by side; 768: page head, tabs, board columns two by two; 390: page head, tabs scroll sideways (no All tab), one status column at a time
- Blocks: page head (Text as on Docs); status tabs (Tabs, TabsList, TabsTrigger with Badge counts); board columns (a kit gap, columns built from Card); task card (Card with title, Avatar initials, due date, Badge for Overdue)
- Data fields: title, assignee name and email, status, due date: sample data in the project: tasks-mfe src/screens/tasks/tasks.ts, no request
- States to build: All (every task, four columns); one status picked (only its column); a status with no tasks (a short line in the column); loading and could-not-load not applicable, no request is made
- Kit gaps: board column (no kit component; built from Card on kit tokens)
