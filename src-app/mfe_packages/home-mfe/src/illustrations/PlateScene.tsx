// One wide base plate carrying three separate blocks, the middle one highlighted.

import { Box, FloorGrid } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** One wide base plate carrying three separate blocks, the middle one highlighted. With a label it is an image with that name; without one it is decoration. */
export function PlateScene({ label }: { label?: string }) {
  const view = fitView([-5, -3, 0], [5, 3, 2]);
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
      <FloorGrid view={view} from={[-5, -3]} to={[5, 3]} />
      <Box view={view} at={[-4.5, -2.5]} size={[9, 5, 0.4]} />
      <Box view={view} at={[-3.9, -1.5]} size={[2.1, 3, 1.1]} z0={0.4} />
      <Box view={view} at={[-1.05, -1.5]} size={[2.1, 3, 1.6]} z0={0.4} tone="hi" />
      <Box view={view} at={[1.8, -1.5]} size={[2.1, 3, 0.8]} z0={0.4} />
    </svg>
  );
}
