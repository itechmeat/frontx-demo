// A small upright slab in front of a wider upright slab, the small one highlighted.

import { Box, Face, FloorGrid } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** A small upright slab in front of a wider upright slab, the small one highlighted. With a label it is an image with that name; without one it is decoration. */
export function SlabScene({ label }: { label?: string }) {
  const view = fitView([-4, -2, 0], [4, 3.5, 4]);
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
      <FloorGrid view={view} from={[-4, -2]} to={[4, 3.5]} />
      <Box view={view} at={[-3.2, -0.4]} size={[6.4, 0.4, 4]} />
      <Face view={view} points={[[-2.8, 0, 0.4], [2.8, 0, 0.4], [2.8, 0, 3.6], [-2.8, 0, 3.6]]} />
      <Box view={view} at={[0.6, 1.8]} size={[1.8, 0.35, 3]} tone="hi" />
      <Face view={view} points={[[0.8, 2.15, 0.35], [2.2, 2.15, 0.35], [2.2, 2.15, 2.65], [0.8, 2.15, 2.65]]} />
    </svg>
  );
}
