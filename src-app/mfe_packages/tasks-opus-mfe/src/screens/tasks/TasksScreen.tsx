import React, { useEffect, useState, useSyncExternalStore } from 'react';
import type { ChildMfeBridge } from '@gears-frontx/react';
import { FRONTX_SHARED_PROPERTY_THEME } from '@gears-frontx/react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VisuallyHidden,
} from '@gears-frontx/ui-kit';
import { kitThemeScopeFor } from '../../shared/kitThemeScope';
import { DEFAULT_THEME_ID, readBridgeProperty } from '../../shared/readBridgeProperty';
import { STATUSES, TASKS, formatDue, isOverdue, tasksIn, todayIso, type Task, type TaskStatus } from './tasks';
import styles from './TasksScreen.module.css';

type TabValue = 'all' | TaskStatus;

/*
 * From 768 px the board has room for its columns side by side, so the All tab
 * is offered; below it the board shows one status column at a time and the
 * tabs pick it (the chosen proposal, option B, on a phone).
 */
const WIDE_QUERY = '(min-width: 768px)';

function subscribeWide(listener: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

function readWide(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia(WIDE_QUERY).matches;
}

const TaskCard: React.FC<{ task: Task; today: string }> = ({ task, today }) => {
  const overdue = isOverdue(task, today);
  return (
    <li className={styles.taskItem}>
      <Card size="sm" className={styles.task} data-testid={`task-${task.id}`}>
        <CardContent className={styles.taskBody}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <div className={styles.taskMeta}>
          {task.assignee ? (
            <span className={styles.assignee}>
              <Avatar size="sm" aria-hidden="true">
                <AvatarFallback>{task.assignee.initials}</AvatarFallback>
              </Avatar>
              <VisuallyHidden>Assigned to {task.assignee.name}</VisuallyHidden>
            </span>
          ) : (
            <span className={styles.meta}>Unassigned</span>
          )}
          <span className={styles.due}>
            <VisuallyHidden>Due </VisuallyHidden>
            <time dateTime={task.due} className={styles.meta}>
              {formatDue(task.due)}
            </time>
            {overdue ? <Badge variant="danger">Overdue</Badge> : null}
          </span>
        </div>
        </CardContent>
      </Card>
    </li>
  );
};

const Board: React.FC<{ statuses: TaskStatus[]; today: string }> = ({ statuses, today }) => (
  <div className={styles.board} data-columns={statuses.length} data-testid="board">
    {STATUSES.filter((status) => statuses.includes(status.value)).map((status) => {
      const tasks = tasksIn(status.value);
      const headingId = `column-${status.value}`;
      return (
        <section key={status.value} className={styles.column} aria-labelledby={headingId} data-testid={`column-${status.value}`}>
          <h2 id={headingId} className={styles.columnTitle}>
            {status.label}
            <Badge variant="secondary">{tasks.length}</Badge>
          </h2>
          {tasks.length === 0 ? (
            <p className={styles.meta}>No tasks in this status.</p>
          ) : (
            <ul className={styles.tasks}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} today={today} />
              ))}
            </ul>
          )}
        </section>
      );
    })}
  </div>
);

export interface TasksScreenProps {
  bridge: ChildMfeBridge;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({ bridge }) => {
  const [theme, setTheme] = useState<string>(() =>
    readBridgeProperty(bridge, FRONTX_SHARED_PROPERTY_THEME, DEFAULT_THEME_ID),
  );
  const [prevBridge, setPrevBridge] = useState(bridge);
  if (prevBridge !== bridge) {
    setPrevBridge(bridge);
    setTheme(readBridgeProperty(bridge, FRONTX_SHARED_PROPERTY_THEME, DEFAULT_THEME_ID));
  }
  useEffect(
    () =>
      bridge.subscribeToProperty(FRONTX_SHARED_PROPERTY_THEME, (property) => {
        if (typeof property.value === 'string') setTheme(property.value);
      }),
    [bridge],
  );

  const wide = useSyncExternalStore(subscribeWide, readWide, () => true);
  const [tab, setTab] = useState<TabValue>('all');
  // On a phone there is no All tab: the board starts on the first status.
  const active: TabValue = !wide && tab === 'all' ? STATUSES[0].value : tab;
  const today = todayIso();

  const tabs: { value: TabValue; label: string; count: number }[] = [
    ...(wide ? [{ value: 'all' as const, label: 'All', count: TASKS.length }] : []),
    ...STATUSES.map((status) => ({ value: status.value, label: status.label, count: tasksIn(status.value).length })),
  ];

  return (
    <div className={styles.screen} data-theme={kitThemeScopeFor(theme)} data-testid="screen-root">
      <div className={styles.page}>
        <header className={styles.head}>
          <h1 className={styles.pageTitle}>Tasks</h1>
          <p className={styles.headLead}>What the team is working on, by status, and when each task is due.</p>
        </header>

        <Tabs value={active} onValueChange={(value) => setTab(value as TabValue)} className={styles.tabs}>
          <div className={styles.tabRow}>
            <TabsList variant="line" className={styles.tabList} aria-label="Filter by status">
              {tabs.map((item) => (
                <TabsTrigger key={item.value} value={item.value} className={styles.tab} data-testid={`tasks-tab-${item.value}`}>
                  {item.label}
                  <Badge variant="secondary">{item.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map((item) => (
            <TabsContent key={item.value} value={item.value} animate={false} className={styles.panel}>
              <Board statuses={item.value === 'all' ? STATUSES.map((status) => status.value) : [item.value]} today={today} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
