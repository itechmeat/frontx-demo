/**
 * Menu Component
 *
 * The header's page navigation: one link per screen the MFE registry holds,
 * in menu order. A click mounts the screen; the open screen is marked with
 * aria-current="page".
 */

import React, { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import {
  useFrontX,
  eventBus,
  Language,
  FRONTX_ACTION_MOUNT_EXT,
  FRONTX_SCREEN_DOMAIN,
} from '@gears-frontx/react';
import { bootstrapSettled } from '@/app/mfe/bootstrapOnce';
import { screenState } from '@/app/mfe/screenState';
import { menuLabels } from '@/app/mfe/menuLabels';
import { screensInMenuOrder, type RegistryScreenExtension } from '@/app/mfe/defaultScreen';
import styles from './Menu.module.css';

export interface MenuProps {
  children?: React.ReactNode;
}

/**
 * Test id of the menu item that mounts `extensionId`.
 *
 * This is a verification API, not a styling hook: an unattended browser run
 * clicks screens through it, so the value is part of what the host promises
 * and may not be renamed to suit a stylesheet. Nothing in the app selects on
 * it. Without a stable handle a run addresses menu items through
 * accessibility references, which are re-issued on every navigation and every
 * theme switch, so each click costs a snapshot taken only to learn the
 * reference again.
 *
 * The extension id goes in verbatim, and it is the extension id rather than
 * the extension's `route` for two reasons. It is the identity the registry keys
 * on - the same value this component already uses as the React key and as the
 * mount subject - so two menu items cannot carry one id. The route is
 * a separate property: nothing stops two extensions declaring the
 * same route, so a route-derived id could collide. Verbatim also
 * means no slug step, which is its own collision risk - `a.b` and `a-b` slug to
 * one string, and extension ids are built from punctuation a slug would
 * flatten.
 */
export const menuItemTestId = (extensionId: string): string => `menu-item-${extensionId}`;

export const Menu: React.FC<MenuProps> = ({ children }) => {
  const { mfeRegistry, i18nRegistry } = useFrontX();
  const language = useSyncExternalStore(
    useCallback((listener: () => void) => {
      const subscription = eventBus.on('i18n/language/changed', listener);
      const unsubscribeRegistry = i18nRegistry?.subscribe(listener);
      return () => {
        subscription.unsubscribe();
        unsubscribeRegistry?.();
      };
    }, [i18nRegistry]),
    () => i18nRegistry?.getLanguage() ?? Language.English,
  );
  const [translated, setTranslated] = useState<{ language: string; labels: Map<string, string> }>();

  useEffect(() => {
    let cancelled = false;
    bootstrapSettled()
      .then(() => cancelled ? new Map<string, string>() : menuLabels.load(language))
      .then((labels) => {
        if (!cancelled) setTranslated({ language, labels });
      }).catch((error: unknown) => {
        console.warn('[Menu labels] Failed to load menu labels:', error);
      });
    return () => { cancelled = true; };
  }, [language]);


  // Currently-mounted screen extension, as the screen domain's container
  // hooks recorded it: creating a screen's container sets it, destroying the
  // container that holds it clears it.
  const mountedId = useSyncExternalStore(screenState.subscribe, screenState.getSnapshot);

  // Registry reads carry no `route`, so the menu holds the screen extension
  // shape without it.
  // `undefined` until bootstrap has settled: bootstrap registers every screen
  // extension, so the list is read once, after it, and an empty list before
  // that point means "not known yet", not "no screens". The screen container
  // starts the bootstrap; the menu only waits for it, so a shell without a
  // screen container keeps the menu blank.
  const [extensions, setExtensions] = useState<RegistryScreenExtension[] | undefined>(undefined);

  useEffect(() => {
    if (!mfeRegistry) return;
    let cancelled = false;
    bootstrapSettled().then(
      () => {
        if (cancelled) return;
        // The cast asserts `presentation` rather than checking it; the sort
        // below is the one the default screen selects by (`defaultScreen.ts`),
        // so the first item this menu shows is the screen the shell opens when
        // the address names none.
        const screenExts = mfeRegistry.getExtensionsForDomain(FRONTX_SCREEN_DOMAIN) as RegistryScreenExtension[];
        setExtensions(screensInMenuOrder(screenExts));
      },
      // `MfeScreenContainer` logs the bootstrap failure; the menu only shows
      // that there is nothing to list.
      () => {
        if (!cancelled) setExtensions([]);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [mfeRegistry]);

  // No registry means no microfrontends plugin: nothing is ever coming.
  const screens = mfeRegistry ? extensions : [];
  const labels = translated?.language === language ? translated.labels : menuLabels.peek(language);

  // Dispatch is acceptance-only: it returns void and never throws, so the
  // handler only hands the chain to the registry.
  const handleMenuItemClick = useCallback(
    (extensionId: string) => {
      if (!mfeRegistry) return;
      mfeRegistry.executeActionsChain({
        action: {
          type: FRONTX_ACTION_MOUNT_EXT,
          target: FRONTX_SCREEN_DOMAIN,
          payload: { subject: extensionId },
        },
      });
    },
    [mfeRegistry]
  );

  return (
    <nav aria-label="Pages">
      <ul className={styles.list}>
        {/* Before bootstrap settles `screens` is undefined and the row stays blank. */}
        {screens?.length === 0 ? (
          <li className={styles.emptyHint}>No screens yet</li>
        ) : (
          screens?.map((ext) => {
            const isActive = ext.id === mountedId;
            const label = labels?.get(ext.id) ?? ext.presentation.label;
            const route = (ext as { route?: unknown }).route;
            const href = typeof route === 'string' ? `/?screen=${route.replace(/^\//, '')}` : '/';
            return (
              <li key={ext.id} className={styles.item}>
                <a
                  href={href}
                  className={styles.link}
                  data-testid={menuItemTestId(ext.id)}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(event) => {
                    // A plain click mounts the screen through the registry,
                    // which writes the address; a modified click keeps the
                    // browser's own behaviour (new tab, new window).
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                    event.preventDefault();
                    handleMenuItemClick(ext.id);
                  }}
                >
                  {label}
                </a>
              </li>
            );
          })
        )}
      </ul>
      {children}
    </nav>
  );
};

Menu.displayName = 'Menu';
