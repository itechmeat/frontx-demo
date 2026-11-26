/**
 * Sample data for the Tasks page: twelve team tasks, kept in the package.
 * The page makes no request, so it has no loading or could-not-load state.
 */

export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface Person {
  name: string;
  initials: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  /** `null` when nobody has picked the task up. */
  assignee: Person | null;
  status: TaskStatus;
  /** Due date as an ISO calendar date, `YYYY-MM-DD`. */
  due: string;
}

/** The statuses in the order work moves through them, with their labels. */
export const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'in-review', label: 'In review' },
  { value: 'done', label: 'Done' },
];

const priya: Person = { name: 'Priya Nair', initials: 'PN', email: 'priya.nair@example.com' };
const kwame: Person = { name: 'Kwame Mensah', initials: 'KM', email: 'kwame.mensah@example.com' };
const lena: Person = { name: 'Lena Novak', initials: 'LN', email: 'lena.novak@example.com' };
const tomas: Person = { name: 'Tomás Ortega', initials: 'TO', email: 'tomas.ortega@example.com' };
const hannah: Person = { name: 'Hannah Weiss', initials: 'HW', email: 'hannah.weiss@example.com' };

export const TASKS: Task[] = [
  { id: 't1', title: 'Interview two design candidates', assignee: priya, status: 'done', due: '2026-11-18' },
  { id: 't2', title: 'Fix broken links in the Docs footer', assignee: kwame, status: 'done', due: '2026-11-20' },
  { id: 't3', title: 'Clean up old feature flags', assignee: lena, status: 'done', due: '2026-11-21' },
  {
    id: 't4',
    title: 'Set up staging alerts for the payment service and write the on-call runbook',
    assignee: tomas,
    status: 'in-progress',
    due: '2026-11-24',
  },
  { id: 't5', title: 'Review the pricing page copy', assignee: hannah, status: 'in-review', due: '2026-11-27' },
  { id: 't6', title: 'Refresh the support reply templates', assignee: priya, status: 'in-review', due: '2026-11-30' },
  { id: 't7', title: 'Update the team holiday calendar', assignee: null, status: 'todo', due: '2026-12-01' },
  { id: 't8', title: 'Write tests for the CSV export', assignee: tomas, status: 'in-review', due: '2026-12-02' },
  { id: 't9', title: 'Draft the Q1 onboarding checklist', assignee: priya, status: 'in-progress', due: '2026-12-03' },
  { id: 't10', title: 'Plan the customer webinar', assignee: hannah, status: 'todo', due: '2026-12-08' },
  { id: 't11', title: 'Prepare the December release notes', assignee: lena, status: 'todo', due: '2026-12-10' },
  {
    id: 't12',
    title: 'Move the analytics dashboard to the new charts',
    assignee: kwame,
    status: 'todo',
    due: '2026-12-15',
  },
];

/** Today's local calendar date as `YYYY-MM-DD`. */
export function todayIso(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** A task is overdue when its due date has passed and it is not Done. */
export function isOverdue(task: Task, today: string): boolean {
  return task.status !== 'done' && task.due < today;
}

const dueFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

/** `2026-11-24` as `Nov 24`. */
export function formatDue(iso: string): string {
  return dueFormat.format(new Date(`${iso}T00:00:00Z`));
}

/** Tasks of one status, earliest due date first. */
export function tasksIn(status: TaskStatus, tasks: Task[] = TASKS): Task[] {
  return tasks.filter((task) => task.status === status).sort((a, b) => a.due.localeCompare(b.due));
}
