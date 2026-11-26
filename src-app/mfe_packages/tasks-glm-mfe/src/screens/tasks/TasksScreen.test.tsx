import { fireEvent, render, screen, within } from '@testing-library/react';
import { FRONTX_SHARED_PROPERTY_LANGUAGE, FRONTX_SHARED_PROPERTY_THEME } from '@gears-frontx/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMfeBridgeFixture } from '../../../../../__test-utils__/createMfeBridgeFixture';
import { TEAM_TASKS } from './sampleData';
import { TasksScreen } from './TasksScreen';

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

/** The narrow-width branch, with matchMedia faked to `matches`. */
function renderNarrow(theme = 'default') {
  const matchMedia = vi.fn().mockReturnValue({
    matches: true,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  });
  window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
  return renderTasks(theme);
}

describe('TasksScreen', () => {
  afterEach(() => {
    // Restore the real (missing) matchMedia so suites run in a wide jsdom.
    delete (window as { matchMedia?: unknown }).matchMedia;
    vi.restoreAllMocks();
  });

  it.each([
    ['dark', 'dark'],
    ['dracula', 'dark'],
    ['default', 'light'],
    ['unknown-theme', 'light'],
  ])('scopes the screen to the kit %s tokens as %s', (theme, scope) => {
    renderTasks(theme);
    expect(screen.getByTestId('screen-root').getAttribute('data-theme')).toBe(scope);
  });

  it('opens on the board with the page heading and a column per status', () => {
    renderTasks();
    expect(screen.getByRole('heading', { level: 1, name: 'Team tasks' })).toBeTruthy();
    for (const label of ['To do', 'In progress', 'In review', 'Done']) {
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(`^${label} \\d$`) })).toBeTruthy();
    }
    expect(screen.getAllByTestId('task-tile')).toHaveLength(TEAM_TASKS.length);
  });

  it('counts each column from the sample data', () => {
    renderTasks();
    const counts = ['To do', 'In progress', 'In review', 'Done'].map((label) => {
      const column = screen.getByTestId(
        `board-column-${{ 'To do': 'todo', 'In progress': 'in-progress', 'In review': 'in-review', Done: 'done' }[label]}`
      );
      return within(column).getAllByText(label).length;
    });
    // Each column names its status once in the header; the count badge is a number.
    expect(screen.getByTestId('board-column-todo').textContent).toContain('4');
    expect(screen.getByTestId('board-column-in-progress').textContent).toContain('3');
    expect(screen.getByTestId('board-column-in-review').textContent).toContain('2');
    expect(screen.getByTestId('board-column-done').textContent).toContain('3');
    expect(counts).toHaveLength(4);
  });

  it('marks the overdue task and names the missing values in words', () => {
    renderTasks();
    expect(screen.getByText('Overdue')).toBeTruthy();
    expect(screen.getByText('Unassigned')).toBeTruthy();
    expect(screen.getByText('No due date')).toBeTruthy();
  });

  it('narrows the board to one status from the column header and back', () => {
    renderTasks();
    const toggle = screen.getByTestId('status-toggle-in-review');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('board-column-in-review')).toBeTruthy();
    expect(screen.queryByTestId('board-column-todo')).toBeNull();
    expect(screen.queryByTestId('board-column-done')).toBeNull();
    expect(screen.getAllByTestId('task-tile')).toHaveLength(2);

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getAllByTestId('board-column-todo')).toHaveLength(1);
    expect(screen.getAllByTestId('task-tile')).toHaveLength(TEAM_TASKS.length);
  });

  it('shows the phone filter as a Status select with one column at a time', () => {
    renderNarrow();
    expect(screen.getByTestId('status-select')).toBeTruthy();
    // The drawn default: the In progress column fills the phone.
    expect(screen.getByTestId('board-column-in-progress')).toBeTruthy();
    expect(screen.queryByTestId('board-column-todo')).toBeNull();
    expect(screen.getAllByTestId('task-tile')).toHaveLength(3);
    // The column header is not a filter control on the phone; the select is.
    expect(screen.queryByTestId('status-toggle-in-progress')).toBeNull();
  });
});
