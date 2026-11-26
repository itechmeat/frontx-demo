/**
 * Default theme for FrontX: the kit's light palette with a dark left menu.
 *
 * Colour, radius and type tokens come from @gears-frontx/ui-kit's theme.css,
 * resolved for the `appearance` below. This theme declares only the shell's
 * own tokens (left menu, spacing, shadows, transitions, `--radius-none`) and
 * re-declares no kit token, so the kit stays the one palette. themes.test.ts
 * enforces both halves.
 *
 * The left menu is the page inverted: the panel takes --foreground, its text
 * a wash of --background over it, and hover, border and selection mix or read
 * the same pair, so the panel follows the kit's light values by construction.
 */

import type { ThemeConfig } from '@gears-frontx/react';

/**
 * Default theme ID
 */
export const DEFAULT_THEME_ID = 'default' as const;

export const defaultTheme: ThemeConfig = {
  id: DEFAULT_THEME_ID,
  name: 'Default',
  appearance: 'light',
  default: true,
  variables: {
    // The page surface: pure white, with the app's dark navy as the text
    // colour read against it. The kit's palette stays for every other token.
    '--background': '#ffffff',
    '--foreground': '#152440',

    // The app's own colour roles, under the project prefix. They are not kit
    // tokens, so they reach the screens' shadow roots unchanged; a screen maps
    // the kit roles it uses onto them (accent onto --primary, and so on).
    '--app-page': '#ffffff',
    '--app-accent': '#0756f5',
    '--app-accent-hover': '#0647cc',
    '--app-navy': '#152440',
    '--app-muted': '#5c6b84',
    '--app-line': '#e0e7f2',
    '--app-header-line': '#e6e9ef',
    '--app-band-dark': '#10234b',
    '--app-tint': '#f1f5fb',
    '--app-violet': '#7a5af5',
    '--app-on-accent': '#ffffff',
    '--app-on-dark-muted': '#c4cee0',

    // Spacing steps the kit's scale does not carry (28, 40, 48, 56, 60, 64, 96 px).
    '--space-7': '1.75rem',
    '--space-10': '2.5rem',
    '--space-11': '2.75rem',
    '--space-12': '3rem',
    '--space-13': '3.25rem',
    '--space-14': '3.5rem',
    '--space-15': '3.75rem',
    '--space-16': '4rem',
    '--space-24': '6rem',

    // A 48 px control for the page's call-to-action buttons.
    '--control-height-xl': '3rem',

    // Layout: the header, the content column's side gutters, small gaps.
    '--app-header-height': '4.5rem',
    '--app-header-inset': '3.5rem',
    '--app-gutter': '4.25rem',
    '--app-gutter-phone': '1.25rem',
    '--app-nav-gap': '1.125rem',
    '--app-card-pad': '1.75rem',
    '--app-card-pad-lg': '1.875rem',
    '--app-hero-aside': '21.25rem',
    '--app-picture-height': '9.375rem',
    '--app-picture-phone-height': '7.5rem',
    '--app-picture-width': '10.625rem',
    '--app-picture-wide': '13.75rem',
    '--app-docs-card-height': '15.625rem',
    '--app-prompt-aside': '23.75rem',
    '--app-measure': '20rem',
    '--app-lead-measure': '41.25rem',
    '--app-guide-measure': '45rem',
    '--app-tracking-tight': '-0.045em',

    // Type steps the kit's ramp does not carry, desktop and phone.
    '--text-hero-size': '4rem',
    '--text-hero-line-height': '4.5rem',
    '--text-hero-weight': '600',
    '--text-hero-phone-size': '2.25rem',
    '--text-hero-phone-line-height': '2.75rem',
    '--text-page-size': '3.25rem',
    '--text-page-line-height': '3.75rem',
    '--text-page-phone-size': '2.125rem',
    '--text-page-phone-line-height': '2.625rem',
    '--text-section-size': '2.875rem',
    '--text-section-line-height': '3.25rem',
    '--text-section-phone-size': '1.75rem',
    '--text-section-phone-line-height': '2.25rem',
    '--text-closing-size': '2.5rem',
    '--text-closing-line-height': '2.875rem',
    '--text-group-size': '1.5rem',
    '--text-group-line-height': '2.25rem',
    '--text-card-title-size': '1.375rem',
    '--text-card-title-line-height': '2.0625rem',
    '--text-card-title-sm-size': '1.125rem',
    '--text-card-title-sm-line-height': '1.6875rem',
    '--text-item-size': '1.25rem',
    '--text-item-line-height': '1.75rem',
    '--text-lead-size': '1rem',
    '--text-lead-line-height': '1.6875rem',
    '--text-hero-lead-size': '1.125rem',
    '--text-hero-lead-line-height': '1.8125rem',
    '--text-copy-size': '0.875rem',
    '--text-copy-line-height': '1.5rem',
    '--text-nav-size': '0.8125rem',
    '--text-brand-size': '1.0625rem',

    // Left menu colors: the page pair inverted. Panel text is background
    // lightened toward foreground, which keeps the muted grey of the old
    // literal while clearing 4.5:1 on the panel.
    '--left-menu': 'var(--foreground)',
    '--left-menu-foreground': 'color-mix(in oklab, var(--background) 70%, var(--foreground))',
    '--left-menu-hover': 'color-mix(in oklab, var(--foreground) 82%, var(--background))',
    '--left-menu-selected': 'var(--primary)',
    '--left-menu-selected-foreground': 'var(--primary-foreground)',
    '--left-menu-border': 'color-mix(in oklab, var(--foreground) 82%, var(--background))',

    // Spacing
    '--spacing-xs': '0.25rem',
    '--spacing-sm': '0.5rem',
    '--spacing-md': '1rem',
    '--spacing-lg': '1.5rem',
    '--spacing-xl': '2rem',
    '--spacing-2xl': '3rem',
    '--spacing-3xl': '4rem',

    // Border radius the kit has no step for; every other step derives from
    // the kit's --radius
    '--radius-none': '0',

    // Shadows
    '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    '--shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    // The popup's own two-layer elevation, the same in every theme
    '--shadow-popover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

    // Transitions
    '--transition-fast': '150ms',
    '--transition-base': '200ms',
    '--transition-slow': '300ms',
    '--transition-slower': '500ms',
    // The curve the shell layout moves with, the same in every theme
    '--transition-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
