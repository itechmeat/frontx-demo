// A tray holding a neat row of equal small blocks, one lifted out and highlighted.

import { Box, Face, FloorGrid } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** A tray holding a neat row of equal small blocks, one lifted out and highlighted. With a label it is an image with that name; without one it is decoration. */
export function TrayScene({ label }: { label?: string }) {
  const view = fitView([-4.5, -2, 0], [4.5, 2, 2.8]);
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
      <FloorGrid view={view} from={[-4.5, -2]} to={[4.5, 2]} />
      <Box view={view} at={[-4, -1.5]} size={[8, 3, 0.3]} />
      <Box view={view} at={[-3.6, -1]} size={[1, 2, 0.8]} z0={0.3} />
      <Box view={view} at={[-2.2, -1]} size={[1, 2, 0.8]} z0={0.3} />
      <Face view={view} points={[[-0.8, -1, 0.3], [0.2, -1, 0.3], [0.2, 1, 0.3], [-0.8, 1, 0.3]]} />
      <Box view={view} at={[0.6, -1]} size={[1, 2, 0.8]} z0={0.3} />
      <Box view={view} at={[2, -1]} size={[1, 2, 0.8]} z0={0.3} />
      <Box view={view} at={[-0.8, -1]} size={[1, 2, 0.8]} z0={2} tone="hi" />
    </svg>
  );
}
