# Tasks MFE

The **Tasks** screen of the FrontX app: a team task board where every task
sits in its status column (To do, In progress, In review, Done) and the
status filter is the board itself — pick a column's header to narrow the
board to that status, pick it again to bring the rest back. On a phone a
Status select picks the one column the screen shows.

- Registered screen extension: route `/tasks`, menu label `Tasks`, order 30
  (`mfe.json`); the shell mounts it through the shared screen domain.
- Data: the twelve sample tasks in `src/screens/tasks/sampleData.ts`. No
  request is made; a real data source is a later, separate agreement.
- UI: `@gears-frontx/ui-kit` components only (Card, Badge, Avatar, Button,
  Select, Text); the board column is the one kit gap, composed from CSS
  Modules on kit tokens.
