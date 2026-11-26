/**
 * MFE Bootstrap — executed once when the entry first loads.
 * Creates the minimal FrontX app for the Docs screen. The screen keeps its
 * state in React only, so no API service and no slice are registered.
 * Cache/runtime note:
 * - The host app owns the shared runtime via queryCache().
 * - Child apps join that shared QueryClient via queryCacheShared().
 * - Do not add queryCache(), a second createFrontX(), or QueryClientProvider here.
 */
import { createFrontX, effects, mock, queryCacheShared } from '@gears-frontx/react';

const mfeApp = createFrontX().use(effects()).use(queryCacheShared()).use(mock()).build();

export { mfeApp };
