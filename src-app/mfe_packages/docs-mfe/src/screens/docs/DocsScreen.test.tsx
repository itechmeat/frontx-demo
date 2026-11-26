import { fireEvent, render, screen } from '@testing-library/react';
import { FRONTX_SHARED_PROPERTY_LANGUAGE, FRONTX_SHARED_PROPERTY_THEME } from '@gears-frontx/react';
import { describe, expect, it } from 'vitest';
import { createMfeBridgeFixture } from '../../../../../__test-utils__/createMfeBridgeFixture';
import { DocsScreen } from './DocsScreen';

function renderDocs(theme = 'default') {
  const fixture = createMfeBridgeFixture({
    extDomainId: 'docs-domain',
    extensionId: 'docs-instance',
    initialProperties: {
      [FRONTX_SHARED_PROPERTY_THEME]: theme,
      [FRONTX_SHARED_PROPERTY_LANGUAGE]: 'en',
    },
  });
  render(<DocsScreen bridge={fixture.bridge} />);
  return fixture;
}

describe('DocsScreen', () => {
  it.each([
    ['dark', 'dark'],
    ['dracula', 'dark'],
    ['default', 'light'],
    ['unknown-theme', 'light'],
  ])('scopes the screen to the kit %s tokens as %s', (theme, scope) => {
    renderDocs(theme);
    expect(screen.getByTestId('screen-root').getAttribute('data-theme')).toBe(scope);
  });

  it('opens on the overview with the page heading, the prompt and four tabs', () => {
    renderDocs();
    expect(screen.getByRole('heading', { level: 1, name: 'Build with FrontX.' })).toBeTruthy();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('heading', { name: 'Start with one prompt.' })).toBeTruthy();
    expect(screen.getByTestId('prompt-copy').textContent).toContain('Copy');
  });

  it('opens the matching tab from a guide card', () => {
    renderDocs();
    fireEvent.click(screen.getByTestId('docs-card-run'));
    expect(screen.getByRole('heading', { level: 2, name: 'Run Shell + MFE' })).toBeTruthy();
    expect(screen.getByText('frontx seed @gears-frontx/frontx-template-shell my-app')).toBeTruthy();
  });
});
