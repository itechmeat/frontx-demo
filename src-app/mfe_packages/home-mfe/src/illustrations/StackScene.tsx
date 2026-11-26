// A stack of thin plates being assembled, the top plate hovering above the stack and highlighted, dashed guide lines under it.

import { Box, FloorGrid, Line } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** A stack of thin plates being assembled, the top plate hovering above the stack and highlighted, dashed guide lines under it. With a label it is an image with that name; without one it is decoration. */
export function StackScene({ label }: { label?: string }) {
  const view = fitView([-4, -3, 0], [4, 3, 3.15]);
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
      <FloorGrid view={view} from={[-4, -3]} to={[4, 3]} />
      <Box view={view} at={[-3, -2]} size={[6, 4, 0.35]} />
      <Box view={view} at={[-3, -2]} size={[6, 4, 0.35]} z0={0.6} />
      <Box view={view} at={[-3, -2]} size={[6, 4, 0.35]} z0={1.2} />
      <Line view={view} from={[-3, 2, 2.8]} to={[-3, 2, 1.55]} kind="dash" />
      <Line view={view} from={[3, 2, 2.8]} to={[3, 2, 1.55]} kind="dash" />
      <Line view={view} from={[3, -2, 2.8]} to={[3, -2, 1.55]} kind="dash" />
      <Box view={view} at={[-3, -2]} size={[6, 4, 0.35]} z0={2.8} tone="hi" />
    </svg>
  );
}
