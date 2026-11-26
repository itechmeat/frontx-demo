/**
 * Header Component
 *
 * The application's top bar: the app mark and name on the left, the page
 * navigation on the right. The app has no sign-in and runs in English only,
 * so the header carries no user block and no language control.
 * Seeded with the template; the project owns this file and edits it directly.
 */

import React, { useRef } from 'react';
import { VisuallyHidden } from '@gears-frontx/ui-kit';
import { FrontXLogoIcon } from '@/app/icons/FrontXLogoIcon';
import { useOtherHeadingOne } from './useOtherHeadingOne';
import styles from './Header.module.css';

export interface HeaderProps {
  /** The page navigation, rendered in the header's right-hand row. */
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const screenHasHeadingOne = useOtherHeadingOne(headingRef);

  return (
    <header className={styles.header}>
      {/* Every page needs exactly one h1 (axe: page-has-heading-one). A
          screen normally renders its own; this visually hidden one names the
          app only while nothing else on the page is a level-one heading. */}
      {screenHasHeadingOne ? null : (
        <h1 ref={headingRef}>
          <VisuallyHidden>FrontX</VisuallyHidden>
        </h1>
      )}
      <div className={styles.brand}>
        <FrontXLogoIcon className={styles.mark} />
        <span className={styles.name}>FrontX</span>
      </div>
      <div className={styles.nav}>{children}</div>
    </header>
  );
};

Header.displayName = 'Header';
