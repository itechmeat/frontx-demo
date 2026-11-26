# Proposal record: Tasks page

The hand-off between the proposal and the build (references/record.md). Fill every field before the page is shown; a field with nothing to say gets `none`. Until the person answers, every field under "Selection" and "Build hand-off" reads `none yet`. Check it with `scripts/check-proposal.mjs <revision-dir>`.

## Revision

- Page id: tasks
- Revision: r1
- Replaces: none
- Status: selected
- Created: 2026-11-26
- Proposal: proposal.html

## Request

- Request: "Add a third page "Tasks" to this app: a team task list where I can see what is in which status and filter by status. Before you build anything, show me how it could look, with three options, so I can choose."
- Purpose: one page where the team sees every task's status and filters by status
- Users: anyone on the team; the app has no sign-in or accounts
- Main task: scan the tasks, pick a status, see that status's tasks
- Assumptions: read-only first version, no editing, assigning or dragging; the statuses are To do, In progress, In review, Done; the twelve sample tasks stand in for real data until a source is agreed
- Non-goals: no task details screen, no forms, no sign-in; no change to the Home or Docs pages or to the header beyond the new Tasks link

## Proposal

- Design: options
- Option a: Tabs over a table. Best for: scanning every task at once and filtering to one status in a tap. Trade-off: status is a column you read, not a place you see; the least visual of the three.
- Option b: Board, a column per status. Best for: seeing where the work piles up; the status is the place a task lives in. Trade-off: a phone shows one column at a time, and a twelve-task board spreads wide.
- Option c: Grouped by person. Best for: standups and handovers, who has what and who is free. Trade-off: filtering by status takes a detour through people; a status can sit in several cards.
- Recommended: A, because the request's first job is seeing every status and filtering by it, and the table does both in one view and stays readable at twelve rows
- Open questions: where the tasks come from in this first version (touches the data the page reads)
- Ready answers: 1. the twelve sample tasks ship in the project (suggested), the page can be built, used and judged now and a data request can follow; 2. agree a data source before building, the page reads real tasks from the start
- Decisions: the four statuses To do, In progress, In review, Done (the request): accepted; a Tasks link after Docs in the header (the request's "third page", the survey's menu order): accepted; the address /?screen=tasks in the form the shell's links carry (the survey, Menu.tsx): accepted; the page head like Docs (our proposal, the app's shared page head): proposed; overdue marked with a badge, not colour alone (our proposal): proposed; missing values written out as Unassigned and No due date (our proposal): proposed; the tasks' data source: open q-1
- Reuses: the page head (title and lead) the Docs page uses (Text styles, DocsScreen); Table in a bordered Card (Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Card; Docs and Home); Tabs with counts (Tabs, TabsList, TabsTrigger; Docs and Home); Badge for statuses (Badge; Home); Card for tiles and person cards (Card; Docs and Home); Avatar for assignees (Avatar, kit, not yet used by a screen); the counters as Text with the kit's kpi typography (Text; Home); New: the board columns and tiles (a kit gap, composed from Card and layout tokens); New: the counters as a filter (plain, no kit component); New: the twelve sample tasks (a sample-data module in the project)
- Optional parts: flow: not added, the page is one screen with no decision that leads to another screen; storyboard: not added, picking a status is a one-press state change the notes and the Filtered state line cover; guarantees: not added, the page promises no only, never, always or cannot rule; position cue: added, the page has eleven sections after the head
- Kit version: 0.5.0
- Template versions: @gears-frontx/frontx-template-shell 0.1.0-alpha.9 (applied), @gears-frontx/frontx-template-mfe 0.1.0-alpha.8 (applied), @gears-frontx/template-design-guardrails 0.1.0-alpha.9 (applied), frontx-design-proposal skill 0.8.0
- Survey: FrontX, navigation recorded as a side menu but the shell draws the menu inside a top header (Layout.tsx, Header.module.css); screens Home /home and Docs /docs in menu order; links carry /?screen=<route>; service AccountsApiService with mocks; theme default (light); brand mark inlined from FrontXLogoIcon

## Selection

- Person's words: "For the Tasks proposal (page tasks, revision r1) I choose option B, "Board, a column per status". / My answers to the open questions: / 1. The Tasks page ships with the twelve sample tasks built into the project until a real data source is agreed. / Changes: none"
- Chosen: B
- Answers: 1. the twelve sample tasks ship in the project until a real data source is agreed (the suggested answer, sent by the person)
- Requested changes: none
- Selected on: 2026-11-26

## Build hand-off

- Route: /?screen=tasks (registered route /tasks); new package tasks-mfe under src-app/mfe_packages/
- Menu place: label "Tasks", order 30, after Docs (order 20)
- Regions: 1440: page head (title, lead), then the board, four columns (To do, In progress, In review, Done) side by side, each column a header with the status name and a count badge and one tile per task (title, assignee avatar and name, due date, Overdue badge when late); picking a column's header narrows the board to that status, picking it again brings the rest back. 768: the four columns wrap two by two. 390: a Status select (kit Select) picks the one column the phone shows; the other statuses are one pick away
- Blocks: page head as the Docs page's (title Text style, lead); board columns and tiles are a kit gap composed from Card and layout tokens; count and Overdue as Badge; assignee as Avatar with initials; phone filter as Select; sample data from a module in the package, no request
- Data fields: title, assignee (name and email at example.com), status (To do, In progress, In review, Done), due date: sample data in the project (twelve tasks in a module of tasks-mfe, no request)
- States to build: Full (all four columns); Filtered (one status picked); Loading and could not load: not applicable, no request is made; a status with nothing in it: not applicable, the sample data gives every status tasks
- Kit gaps: the board (columns of cards with the status as the place); built from Card plus layout tokens, recorded as a kit gap
- Note: the proposal's Reuses line described the counters as kpi Text (option C's filter); the chosen option B shows counts as Badge, and this Blocks line is what the build follows
