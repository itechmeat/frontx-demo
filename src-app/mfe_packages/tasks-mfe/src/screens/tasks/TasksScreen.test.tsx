import { fireEvent, render, screen, within } from '@testing-library/react';
import { FRONTX_SHARED_PROPERTY_LANGUAGE, FRONTX_SHARED_PROPERTY_THEME } from '@gears-frontx/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMfeBridgeFixture } from '../../../../../__test-utils__/createMfeBridgeFixture';
import { TasksScreen } from './TasksScreen';
import { TASKS, formatDue, isOverdue, tasksIn } from './tasks';

function setWidth(wide: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: wide,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

function renderTasks(theme = 'default') {
  const fixture = createMfeBridgeFixture({
    extDomainId: 'tasks-domain',
    extensionId: 'tasks-instance',
    initialProperties: {
      [FRONTX_SHARED_PROPERTY_THEME]: theme,
      [FRONTX_SHARED_PROPERTY_LANGUAGE]: 'en',
    },
  });
  render(<TasksScreen bridge={fixture.bridge} />);
  return fixture;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('sample tasks', () => {
  it('holds twelve tasks: 4 to do, 2 in progress, 3 in review, 3 done', () => {
    expect(TASKS).toHaveLength(12);
    expect(tasksIn('todo')).toHaveLength(4);
    expect(tasksIn('in-progress')).toHaveLength(2);
    expect(tasksIn('in-review')).toHaveLength(3);
    expect(tasksIn('done')).toHaveLength(3);
    for (const task of TASKS) {
      if (task.assignee) expect(task.assignee.email.endsWith('@example.com')).toBe(true);
    }
  });

  it('marks a task overdue only when its date has passed and it is not done', () => {
    const late = TASKS.find((task) => task.id === 't4')!;
    const done = TASKS.find((task) => task.id === 't1')!;
    expect(isOverdue(late, '2026-11-26')).toBe(true);
    expect(isOverdue(done, '2026-11-26')).toBe(false);
    expect(isOverdue(late, '2026-11-24')).toBe(false);
    expect(formatDue('2026-11-24')).toBe('Nov 24');
  });
});

describe('TasksScreen', () => {
  it.each([
    ['dark', 'dark'],
    ['dracula', 'dark'],
    ['default', 'light'],
    ['unknown-theme', 'light'],
  ])('scopes the screen to the kit %s tokens as %s', (theme, scope) => {
    setWidth(true);
    renderTasks(theme);
    expect(screen.getByTestId('screen-root').getAttribute('data-theme')).toBe(scope);
  });

  it('opens on All with four status columns and every task', () => {
    setWidth(true);
    renderTasks();
    expect(screen.getByRole('heading', { level: 1, name: 'Tasks' })).toBeTruthy();
    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(screen.getByTestId('tasks-tab-all').textContent).toContain('12');
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'To do4',
      'In progress2',
      'In review3',
      'Done3',
    ]);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(12);
  });

  it('leaves only the picked status on the board', () => {
    setWidth(true);
    renderTasks();
    fireEvent.click(screen.getByTestId('tasks-tab-in-review'));
    const board = screen.getByTestId('board');
    expect(within(board).getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(within(board).getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('shows one status at a time on a phone, with no All tab', () => {
    setWidth(false);
    renderTasks();
    expect(screen.queryByTestId('tasks-tab-all')).toBeNull();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    const board = screen.getByTestId('board');
    expect(within(board).getByRole('heading', { level: 2 }).textContent).toBe('To do4');
  });
});
