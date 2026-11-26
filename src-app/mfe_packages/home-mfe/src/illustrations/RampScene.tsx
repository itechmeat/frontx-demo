// A low platform with steps on one side and a ramp on the other, the ramp highlighted.

import { Box, Face, FloorGrid } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** A low platform with steps on one side and a ramp on the other, the ramp highlighted. With a label it is an image with that name; without one it is decoration. */
export function RampScene({ label }: { label?: string }) {
  const view = fitView([-3, -3, 0], [6, 4.5, 1.2]);
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
      <FloorGrid view={view} from={[-3, -3]} to={[6, 4.5]} />
      <Box view={view} at={[-2, -2]} size={[4, 4, 1.2]} />
      <Box view={view} at={[-2, 2]} size={[4, 0.8, 0.8]} />
      <Box view={view} at={[-2, 2.8]} size={[4, 0.8, 0.4]} />
      <Face view={view} points={[[2, 2, 1.2], [5.5, 2, 0], [2, 2, 0]]} surface="side" />
      <Face view={view} points={[[2, -2, 1.2], [5.5, -2, 0], [5.5, 2, 0], [2, 2, 1.2]]} tone="hi" surface="face" />
    </svg>
  );
}
