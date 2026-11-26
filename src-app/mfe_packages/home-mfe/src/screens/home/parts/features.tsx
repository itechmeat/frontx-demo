import type React from 'react';
import { PlateScene } from '../../../illustrations/PlateScene';
import { PathScene } from '../../../illustrations/PathScene';
import { RecessScene } from '../../../illustrations/RecessScene';
import { RampScene } from '../../../illustrations/RampScene';
import { SlabScene } from '../../../illustrations/SlabScene';
import { TrayScene } from '../../../illustrations/TrayScene';
import { StackScene } from '../../../illustrations/StackScene';

export interface Feature {
  id: string;
  title: string;
  line: string;
  points: [string, string, string];
  Scene: React.ComponentType<{ label?: string }>;
}

export const FEATURES: Feature[] = [
  {
    id: 'microfrontends',
    title: 'Microfrontends',
    line: 'Every screen is its own package.',
    points: [
      'Home, Docs and Tasks are built and served separately.',
      'A screen loads on demand, when you open it.',
      'Each screen keeps its styles to itself, so screens cannot break each other.',
    ],
    Scene: PlateScene,
  },
  {
    id: 'routing',
    title: 'Routing',
    line: 'One address bar for independent screens.',
    points: [
      'All screens share one browser history.',
      'Every screen has its own address you can open directly.',
      'The routing layer does not depend on a specific router engine.',
    ],
    Scene: PathScene,
  },
  {
    id: 'contracts',
    title: 'Typed contracts (GTS)',
    line: 'The shell knows what a screen is before it runs it.',
    points: [
      'Each screen is checked against type definitions when it registers.',
      'A screen declares what it needs from the shell and what it can do.',
      'An application can add its own types, at build time or at run time.',
    ],
    Scene: RecessScene,
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    line: 'Built in, not added later.',
    points: [
      'Components are built on Base UI: keyboard, focus and ARIA come with them.',
      'The project template lints accessibility rules on every screen.',
      'Design checks measure text contrast on the rendered page.',
    ],
    Scene: RampScene,
  },
  {
    id: 'mobile',
    title: 'Mobile first',
    line: 'Designed for the phone, then widened.',
    points: [
      'Styles start from the phone layout and grow with the window.',
      'Pages are checked at phone and desktop widths before they ship.',
      'No separate mobile version to maintain.',
    ],
    Scene: SlabScene,
  },
  {
    id: 'uikit',
    title: 'FrontX UI Kit',
    line: 'The same components on every screen.',
    points: [
      'All screens use the same components and design tokens.',
      'Light and dark themes come from the same tokens.',
      'A page added later, by another agent, looks like the first ones.',
    ],
    Scene: TrayScene,
  },
];

export const AGENT_FEATURE: Feature = {
  id: 'agents',
  title: 'Made for AI agents',
  line: 'This app was built from a prompt.',
  points: [
    'Templates give the agent a working shell and a screen to start from.',
    'Skills and design rules come with the templates, with no setup.',
    'A person sets the intent and reviews the result.',
  ],
  Scene: StackScene,
};
