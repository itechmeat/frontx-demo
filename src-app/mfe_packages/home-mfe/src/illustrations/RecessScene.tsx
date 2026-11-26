// A block hovering over a plate that has a recess of exactly its shape, the recess edge highlighted.

import { Box, Face, FloorGrid, Line } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** A block hovering over a plate that has a recess of exactly its shape, the recess edge highlighted. With a label it is an image with that name; without one it is decoration. */
export function RecessScene({ label }: { label?: string }) {
  const view = fitView([-4, -4, 0], [4, 4, 3.6]);
  const named = label !== undefined && label.trim() !== '';
  return (
    <svg
      className={styles.figure}
      viewBox="0 0 400 320"
      role={named ? 'img' : undefined}
      aria-label={named ? label : undefined}
      aria-hidden={named ? undefined : true}
      focusable="false"
    >
      <FloorGrid view={view} from={[-4, -4]} to={[4, 4]} />
      <Box view={view} at={[-3.5, -3.5]} size={[7, 7, 0.6]} />
      <Face view={view} points={[[-1.2, -1.2, 0.6], [1.2, -1.2, 0.6], [1.2, 1.2, 0.6], [-1.2, 1.2, 0.6]]} tone="hi" surface="side" />
      <Line view={view} from={[-1.2, 1.2, 2.4]} to={[-1.2, 1.2, 0.6]} kind="dash" />
      <Line view={view} from={[1.2, 1.2, 2.4]} to={[1.2, 1.2, 0.6]} kind="dash" />
      <Line view={view} from={[1.2, -1.2, 2.4]} to={[1.2, -1.2, 0.6]} kind="dash" />
      <Box view={view} at={[-1.2, -1.2]} size={[2.4, 2.4, 1.2]} z0={2.4} />
    </svg>
  );
}
