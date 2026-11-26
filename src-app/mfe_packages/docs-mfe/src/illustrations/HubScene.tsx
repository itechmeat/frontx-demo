// A host tile wired to the tiles around it, the host highlighted.

import { Box, FloorGrid, Line } from './iso-parts';
import { fitView } from './iso';
import styles from './iso.module.css';

/** A host tile wired to the tiles around it, the host highlighted. With a label it is an image with that name; without one it is decoration. */
export function HubScene({ label }: { label?: string }) {
  const view = fitView([-4.4, -4.4, 0], [5, 4.6, 0.75]);
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
      <FloorGrid view={view} from={[-4.4, -4.4]} to={[5, 4.6]} />
      <Line view={view} from={[0, 0, 0.35]} to={[-3.7, -3.7, 0.2]} />
      <Line view={view} from={[0, 0, 0.35]} to={[3.9, -3.2, 0.2]} />
      <Line view={view} from={[0, 0, 0.35]} to={[-3.2, 3.9, 0.2]} />
      <Line view={view} from={[0, 0, 0.35]} to={[3.9, 3.9, 0.2]} />
      <Box view={view} at={[-4.4, -4.4]} size={[1.4, 1.4, 0.45]} />
      <Box view={view} at={[-1.7, -1.7]} size={[3.4, 3.4, 0.75]} tone="hi" />
      <Box view={view} at={[3.2, -3.9]} size={[1.4, 1.4, 0.45]} />
      <Box view={view} at={[-3.9, 3.2]} size={[1.4, 1.4, 0.45]} />
      <Box view={view} at={[3.2, 3.2]} size={[1.4, 1.4, 0.45]} />
    </svg>
  );
}
