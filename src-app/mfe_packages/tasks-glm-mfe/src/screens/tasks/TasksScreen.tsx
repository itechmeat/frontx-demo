import React, { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ChildMfeBridge } from '@gears-frontx/react';
import { FRONTX_SHARED_PROPERTY_THEME } from '@gears-frontx/react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from '@gears-frontx/ui-kit';
import { kitThemeScopeFor } from '../../shared/kitThemeScope';
import { DEFAULT_THEME_ID, readBridgeProperty } from '../../shared/readBridgeProperty';
import {
  TEAM_TASKS,
  TASK_STATUSES,
  assigneeInitials,
  isOverdue,
  type TaskStatus,
  type TeamTask,
} from './sampleData';
import styles from './TasksScreen.module.css';

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const NARROW_QUERY = '(max-width: 767px)';

function subscribeNarrow(onChange: () => void): () => void {
  // An environment without matchMedia (tests) reads as a wide screen.
  if (typeof window.matchMedia !== 'function') return () => undefined;
  const media = window.matchMedia(NARROW_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/** Below 768 px the board shows one column, picked from a Status select. */
function useNarrowWidth(): boolean {
  const getSnapshot = () => (typeof window.matchMedia === 'function' ? window.matchMedia(NARROW_QUERY).matches : false);
  return useSyncExternalStore(subscribeNarrow, getSnapshot, () => false);
}

function formatDate(iso: string): string {
  return dateFormat.format(new Date(`${iso}T12:00:00`));
}

function dueText(task: TeamTask): string {
  return task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No due date';
}

function byDueDate(a: TeamTask, b: TeamTask): number {
  // Undated tasks sort last; dated tasks run oldest first.
  if (a.dueDate === b.dueDate) return a.id.localeCompare(b.id);
  if (a.dueDate === undefined) return 1;
  if (b.dueDate === undefined) return -1;
  return a.dueDate.localeCompare(b.dueDate);
}

const TaskTile: React.FC<{ task: TeamTask }> = ({ task }) => {
  const overdue = isOverdue(task);
  return (
    <Card size="sm" className={styles.tile} data-testid="task-tile">
      <CardContent className={styles.tileBody}>
        <span className={styles.tileTitle}>{task.title}</span>
        <span className={styles.tileMeta}>
          {task.assignee ? (
            <>
              <Avatar size="sm">
                <AvatarFallback>{assigneeInitials(task.assignee.name)}</AvatarFallback>
              </Avatar>
              <Text typography="meta" tone="muted" render={<span />}>
                {task.assignee.name}
              </Text>
            </>
          ) : (
            <Text typography="meta" tone="muted" render={<span />}>
              Unassigned
            </Text>
          )}
          <Text typography="meta" tone="muted" render={<span />} className={styles.tileDue}>
            {dueText(task)}
          </Text>
          {overdue ? (
            <Badge variant="danger" className={styles.tileBadge}>
              Overdue
            </Badge>
          ) : null}
        </span>
      </CardContent>
    </Card>
  );
};

const BoardColumn: React.FC<{
  statusId: TaskStatus;
  label: string;
  tasks: ReadonlyArray<TeamTask>;
  /** On a wide screen the column header narrows the board to this status. */
  filterable: boolean;
  narrowed: boolean;
  onToggle: () => void;
  headingId: string;
}> = ({ statusId, label, tasks, filterable, narrowed, onToggle, headingId }) => (
  <section
    className={narrowed ? `${styles.column} ${styles.columnFull}` : styles.column}
    aria-labelledby={headingId}
    data-testid={`board-column-${statusId}`}
  >
    <h2 className={styles.columnHeading}>
      {filterable ? (
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={narrowed}
          onClick={onToggle}
          className={styles.columnToggle}
          data-testid={`status-toggle-${statusId}`}
        >
          <span className={styles.columnLabel}>{label}</span>
          <Badge variant="secondary">{tasks.length}</Badge>
        </Button>
      ) : (
        <span className={styles.columnLabelStatic}>
          <span className={styles.columnLabel}>{label}</span>
          <Badge variant="secondary">{tasks.length}</Badge>
        </span>
      )}
    </h2>
    <div className={styles.tiles}>
      {tasks.map((task) => (
        <TaskTile key={task.id} task={task} />
      ))}
    </div>
  </section>
);

export const TasksScreen: React.FC<{ bridge: ChildMfeBridge }> = ({ bridge }) => {
  const [theme, setTheme] = useState(() =>
    readBridgeProperty(bridge, FRONTX_SHARED_PROPERTY_THEME, DEFAULT_THEME_ID)
  );

  React.useEffect(() => {
    setTheme(readBridgeProperty(bridge, FRONTX_SHARED_PROPERTY_THEME, DEFAULT_THEME_ID));
    const unsubscribe = bridge.subscribeToProperty(FRONTX_SHARED_PROPERTY_THEME, (property) => {
      if (typeof property.value === 'string') setTheme(property.value);
    });
    return unsubscribe;
  }, [bridge]);

  const narrow = useNarrowWidth();
  // The desktop filter: null shows every column, a status id narrows to it.
  const [narrowedTo, setNarrowedTo] = useState<TaskStatus | null>(null);
  // The phone filter: the one column the narrow screen shows.
  const [phoneStatus, setPhoneStatus] = useState<TaskStatus>('in-progress');

  const portalContainerRef = useRef<HTMLDivElement>(null);

  const tasksByStatus = useMemo(() => {
    const map = new Map<TaskStatus, TeamTask[]>();
    for (const status of TASK_STATUSES) map.set(status.id, []);
    for (const task of TEAM_TASKS) map.get(task.status)?.push({ ...task });
    for (const tasks of map.values()) tasks.sort(byDueDate);
    return map;
  }, []);

  const visibleStatuses = useMemo(
    () => (narrow ? [phoneStatus] : narrowedTo ? [narrowedTo] : TASK_STATUSES.map((s) => s.id)),
    [narrow, phoneStatus, narrowedTo]
  );

  return (
    <div className={styles.screen} data-theme={kitThemeScopeFor(theme)} data-testid="screen-root">
      <div className={styles.page}>
        <header className={styles.head}>
          <h1 className={styles.pageTitle}>Team tasks</h1>
          <p className={styles.headLead}>What everyone is working on, and where each task stands.</p>
        </header>

        <div className={styles.content}>
          {narrow ? (
            <div className={styles.filter}>
              <Label htmlFor="tasks-status-filter">Status</Label>
              <Select value={phoneStatus} onValueChange={(value) => setPhoneStatus(value as TaskStatus)}>
                <SelectTrigger id="tasks-status-filter" className={styles.selectTrigger} data-testid="status-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent container={portalContainerRef}>
                  {TASK_STATUSES.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label} ({tasksByStatus.get(status.id)?.length ?? 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className={styles.board} data-testid="task-board">
            {TASK_STATUSES.filter((status) => visibleStatuses.includes(status.id)).map((status) => (
              <BoardColumn
                key={status.id}
                statusId={status.id}
                label={status.label}
                tasks={tasksByStatus.get(status.id) ?? []}
                filterable={!narrow}
                narrowed={narrowedTo === status.id}
                onToggle={() => setNarrowedTo((current) => (current === status.id ? null : status.id))}
                headingId={`column-heading-${status.id}`}
              />
            ))}
          </div>
        </div>

        {/* Portal target inside the shadow root: Select's popup renders here and keeps the screen's tokens. */}
        <div ref={portalContainerRef} />
      </div>
    </div>
  );
};
