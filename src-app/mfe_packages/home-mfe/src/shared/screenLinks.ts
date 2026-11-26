import type { ChildMfeBridge } from '@gears-frontx/react';
import { FRONTX_ACTION_MOUNT_EXT, FRONTX_SCREEN_DOMAIN } from '@gears-frontx/react';

/** The Docs screen's extension id and its address, as the docs package declares them. */
export const DOCS_EXTENSION_ID =
  'gts.frontx.mfes.ext.extension.v1~frontx.screensets.layout.screen.v1~frontx.docs.screens.docs.v1';
export const DOCS_HREF = '/?screen=docs';

export const GITHUB_URL = 'https://github.com/constructorfabric/gears-frontx-templates';

/**
 * Opens the Docs screen: a mount action on the screen domain, which the
 * shell's router turns into an address entry. A modified click (new tab,
 * new window) keeps the link's own behaviour.
 */
export function openDocs(bridge: ChildMfeBridge, event: React.MouseEvent<HTMLAnchorElement>): void {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  bridge.executeActionsChain({
    action: {
      type: FRONTX_ACTION_MOUNT_EXT,
      target: FRONTX_SCREEN_DOMAIN,
      payload: { subject: DOCS_EXTENSION_ID },
    },
  });
}
