// A tray of upright cards with one card raised and highlighted.

import { Box, FloorGrid } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** A tray of upright cards with one card raised and highlighted. With a label it is an image with that name; without one it is decoration. */
export function CardTrayScene({ label }: { label?: string }) {
  const view = fitView([-4, -2, 0], [4, 2, 4]);
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
      <FloorGrid view={view} from={[-4, -2]} to={[4, 2]} />
      <Box view={view} at={[-3.5, -1.5]} size={[7, 3, 0.4]} />
      <Box view={view} at={[-2.6, -1.2]} size={[0.25, 2.4, 2.2]} z0={0.4} />
      <Box view={view} at={[-1.4, -1.2]} size={[0.25, 2.4, 2.2]} z0={0.4} />
      <Box view={view} at={[-0.2, -1.2]} size={[0.25, 2.4, 2.2]} z0={1.8} tone="hi" />
      <Box view={view} at={[1, -1.2]} size={[0.25, 2.4, 2.2]} z0={0.4} />
      <Box view={view} at={[2.2, -1.2]} size={[0.25, 2.4, 2.2]} z0={0.4} />
    </svg>
  );
}
