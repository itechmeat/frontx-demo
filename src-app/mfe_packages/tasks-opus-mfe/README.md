# Tasks MFE

The Tasks page of the FrontX app: twelve sample team tasks on a board with a
column per status (To do, In progress, In review, Done) and status tabs above
the board that filter it. Read only; the tasks are sample data in
`src/screens/tasks/tasks.ts`, and the page makes no request.

Built from the proposal record `.frontx/proposals/team-tasks/r1/` (option B).

- Route: `/tasks`, address `/?screen=tasks`, menu order 30 (after Docs).
- Port: 3030 (`npm run dev` builds and previews the remote).
