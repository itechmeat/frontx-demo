// A round plate carrying a few blocks, one block highlighted.

import { Box, Cylinder, FloorGrid } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** A round plate carrying a few blocks, one block highlighted. With a label it is an image with that name; without one it is decoration. */
export function RoundPlateScene({ label }: { label?: string }) {
  const view = fitView([-4, -4, 0], [4, 4, 1.8]);
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
      <Cylinder view={view} at={[0, 0]} r={3.5} h={0.4} />
      <Box view={view} at={[-2, -1.4]} size={[1.4, 1.4, 0.9]} z0={0.4} />
      <Box view={view} at={[0.3, -2]} size={[1.3, 1.3, 1.4]} z0={0.4} tone="hi" />
      <Box view={view} at={[-0.9, 0.7]} size={[1.8, 1.1, 0.6]} z0={0.4} />
      <Box view={view} at={[1.2, 0.2]} size={[1, 1, 0.8]} z0={0.4} />
    </svg>
  );
}
