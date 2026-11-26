
import { fireEvent, render, screen, within } from '@testing-library/react';
import { FRONTX_SHARED_PROPERTY_LANGUAGE, FRONTX_SHARED_PROPERTY_THEME } from '@gears-frontx/react';
import { describe, expect, it } from 'vitest';
import { createMfeBridgeFixture } from '../../../../../__test-utils__/createMfeBridgeFixture';
import { HomeScreen } from './HomeScreen';

function renderHome(theme = 'default') {
  const fixture = createMfeBridgeFixture({
    extDomainId: 'home-domain',
    extensionId: 'home-instance',
    initialProperties: {
      [FRONTX_SHARED_PROPERTY_THEME]: theme,
      [FRONTX_SHARED_PROPERTY_LANGUAGE]: 'en',
    },
  });
  render(<HomeScreen bridge={fixture.bridge} />);
  return fixture;
}

describe('HomeScreen', () => {
  it.each([
    ['dark', 'dark'],
    ['dracula', 'dark'],
    ['dracula-large', 'dark'],
    ['default', 'light'],
    ['light', 'light'],
    ['unknown-theme', 'light'],
  ])('scopes the screen to the kit %s tokens as %s', (theme, scope) => {
    renderHome(theme);
    expect(screen.getByTestId('screen-root').getAttribute('data-theme')).toBe(scope);
  });

  it('renders the hero headline and every section heading', () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Build complex apps. With a shared foundation.',
    );
    for (const name of [
      'What you get with FrontX.',
      'The groundwork, already connected.',
      'One visual language. Every interaction.',
      'A running app. Then your first change.',
      'Build your next app on FrontX.',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeTruthy();
    }
    expect(screen.getAllByRole('article')).toHaveLength(7);
  });

  it('keeps "Add screen" disabled until a name is typed, then adds a draft and updates the numbers', () => {
    renderHome();
    const add = screen.getByTestId('screen-add') as HTMLButtonElement;
    expect(add.disabled).toBe(true);
    expect(screen.getByTestId('stat-screens').textContent).toBe('3');
    expect(screen.getByTestId('stat-draft').textContent).toBe('1');

    fireEvent.change(screen.getByTestId('screen-name'), { target: { value: 'Reports' } });
    expect(add.disabled).toBe(false);
    fireEvent.click(add);

    expect(screen.getByTestId('stat-screens').textContent).toBe('4');
    expect(screen.getByTestId('stat-draft').textContent).toBe('2');
    expect((screen.getByTestId('screen-name') as HTMLInputElement).value).toBe('');
    const table = screen.getByRole('table');
    expect(within(table).getByText('Reports')).toBeTruthy();
  });

  it('publishes a draft row and moves the live count', () => {
    renderHome();
    fireEvent.click(screen.getByTestId('screen-toggle-3'));
    expect(screen.getByTestId('stat-live').textContent).toBe('3');
    expect(screen.getByTestId('stat-draft').textContent).toBe('0');
  });
});
