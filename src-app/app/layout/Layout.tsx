/**
 * Layout Component
 *
 * The application frame: the header across the top, carrying the page
 * navigation, and the screen under it across the whole window. There is no
 * side menu, no side panel and no sign-in.
 * Seeded with the template; the project owns this file and edits it directly.
 */

import React from 'react';
import { Header } from './Header';
import { Menu } from './Menu';
import { Screen } from './Screen';
import { Popup } from './Popup';
import { Overlay } from './Overlay';
import styles from './Layout.module.css';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      <Header>
        <Menu />
      </Header>

      <div className={styles.main}>
        <Screen>{children}</Screen>
      </div>

      <Popup />
      <Overlay />
    </div>
  );
};

Layout.displayName = 'Layout';
