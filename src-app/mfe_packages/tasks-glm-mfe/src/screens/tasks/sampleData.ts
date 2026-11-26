/**
 * The Tasks screen's sample data.
 *
 * The twelve tasks the person saw in the proposal drawing (page `tasks`,
 * revision r1). They live in the project on purpose: no data source is
 * agreed yet, so the screen reads this module and makes no request. A real
 * source replaces this module and nothing else.
 */

export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface TaskAssignee {
  /** Full name, as the tile shows it. */
  name: string;
  /** Work address; an example.com address until a real directory exists. */
  email: string;
}

export interface TeamTask {
  id: string;
  title: string;
  /** No assignee means the task is unassigned, shown in words on the tile. */
  assignee?: TaskAssignee;
  status: TaskStatus;
  /** ISO date (YYYY-MM-DD); a task can have no due date. */
  dueDate?: string;
}

export const TASK_STATUSES: ReadonlyArray<{ id: TaskStatus; label: string }> = [
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'in-review', label: 'In review' },
  { id: 'done', label: 'Done' },
];

export const TEAM_TASKS: ReadonlyArray<TeamTask> = [
  {
    id: 'task-1',
    title: 'Draft the Q3 release notes',
    assignee: { name: 'Tomás Rivera', email: 'tomas.rivera@example.com' },
    status: 'todo',
    dueDate: '2026-12-02',
  },
  {
    id: 'task-2',
    title: 'Update the onboarding emails',
    assignee: { name: 'Priya Raman', email: 'priya.raman@example.com' },
    status: 'todo',
    dueDate: '2026-12-05',
  },
  {
    id: 'task-3',
    title: 'Ship the v0.5 changelog page',
    status: 'todo',
    dueDate: '2026-12-12',
  },
  {
    id: 'task-4',
    title: 'Draw the empty-state illustrations',
    assignee: { name: 'Lena Fischer', email: 'lena.fischer@example.com' },
    status: 'todo',
  },
  {
    id: 'task-5',
    title: 'Set up staging alerts',
    assignee: { name: 'Aisha Bello', email: 'aisha.bello@example.com' },
    status: 'in-progress',
    dueDate: '2026-11-24',
  },
  {
    id: 'task-6',
    title: 'Fix the flaky checkout E2E test',
    assignee: { name: 'Priya Raman', email: 'priya.raman@example.com' },
    status: 'in-progress',
    dueDate: '2026-11-27',
  },
  {
    id: 'task-7',
    title: 'Write the migration runbook for the staging database failover drill',
    assignee: { name: 'Jonas Weber', email: 'jonas.weber@example.com' },
    status: 'in-progress',
    dueDate: '2026-12-01',
  },
  {
    id: 'task-8',
    title: 'Review the API auth guide',
    assignee: { name: 'Maya Chen', email: 'maya.chen@example.com' },
    status: 'in-review',
    dueDate: '2026-11-27',
  },
  {
    id: 'task-9',
    title: 'Refactor the nav deep links',
    assignee: { name: 'Tomás Rivera', email: 'tomas.rivera@example.com' },
    status: 'in-review',
    dueDate: '2026-11-30',
  },
  {
    id: 'task-10',
    title: 'Audit unused npm dependencies',
    assignee: { name: 'Aisha Bello', email: 'aisha.bello@example.com' },
    status: 'done',
    dueDate: '2026-11-18',
  },
  {
    id: 'task-11',
    title: 'Close the FY support batch',
    assignee: { name: 'Maya Chen', email: 'maya.chen@example.com' },
    status: 'done',
    dueDate: '2026-11-20',
  },
  {
    id: 'task-12',
    title: 'Migrate icons to the UI kit',
    assignee: { name: 'Jonas Weber', email: 'jonas.weber@example.com' },
    status: 'done',
    dueDate: '2026-11-21',
  },
];

/** Initials for the avatar fallback: the first letter of the first two names. */
export function assigneeInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

/** Today as an ISO date in the local time zone, so a due date compares by day. */
export function todayIsoDate(now: Date = new Date()): string {
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

/** A task is overdue when unfinished work sits past its due date, by day. */
export function isOverdue(task: TeamTask, now: Date = new Date()): boolean {
  return task.status !== 'done' && task.dueDate !== undefined && task.dueDate < todayIsoDate(now);
}
