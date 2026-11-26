// Four tiles on a floor grid joined by a dashed path, the tile the path ends at highlighted.

import { Box, FloorGrid, Line } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** Four tiles on a floor grid joined by a dashed path, the tile the path ends at highlighted. With a label it is an image with that name; without one it is decoration. */
export function PathScene({ label }: { label?: string }) {
  const view = fitView([-5, -5, 0], [5, 5, 0.8]);
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
      <FloorGrid view={view} from={[-5, -5]} to={[5, 5]} />
      <Line view={view} from={[-3.5, -3.5, 0.4]} to={[1.2, -3, 0.4]} kind="dash" />
      <Line view={view} from={[1.2, -3, 0.4]} to={[-2.2, 1.4, 0.4]} kind="dash" />
      <Line view={view} from={[-2.2, 1.4, 0.4]} to={[3, 3, 0.4]} kind="dash" />
      <Box view={view} at={[-4.3, -4.3]} size={[1.6, 1.6, 0.4]} />
      <Box view={view} at={[0.4, -3.8]} size={[1.6, 1.6, 0.4]} />
      <Box view={view} at={[-3, 0.6]} size={[1.6, 1.6, 0.4]} />
      <Box view={view} at={[2.1, 2.1]} size={[1.8, 1.8, 0.8]} tone="hi" />
    </svg>
  );
}
