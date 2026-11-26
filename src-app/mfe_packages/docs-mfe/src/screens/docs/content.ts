/** The text of the Docs page: the prompt, the two guides and the packages this app depends on. */

export const PROMPT_LINES = [
  'Install the FrontX CLI with npm install -g @gears-frontx/cli.',
  'Install the FrontX templates from github:constructorfabric/gears-frontx-templates: template-shell, template-mfe and template-design-guardrails.',
  'Then use FrontX to build me a small demo app about FrontX itself: a "Home" page like a light version of a product site\'s home page and a "Docs" page that works as the entry to the documentation. No sign-in.',
];

export const PROMPT_TEXT = PROMPT_LINES.join('\n');

export interface GuideStep {
  title: string;
  text: string;
  /** What the code block names: a terminal command or the file a line changes in. */
  label: string;
  code: string;
}

export interface Guide {
  title: string;
  lead: string;
  steps: [GuideStep, GuideStep, GuideStep];
}

export const RUN_GUIDE: Guide = {
  title: 'Run Shell + MFE',
  lead: 'Create the host, add the microfrontend workspace and open two included screens.',
  steps: [
    {
      title: 'Create the host',
      text: 'Seed a new repository from the shell template.',
      label: 'Terminal',
      code: 'frontx seed @gears-frontx/frontx-template-shell my-app',
    },
    {
      title: 'Add the microfrontend workspace',
      text: 'Apply the MFE template to the same repository.',
      label: 'Terminal',
      code: 'frontx add @gears-frontx/frontx-template-mfe my-app',
    },
    {
      title: 'Start the shell with its example screens',
      text: 'Install, build the packages and open http://localhost:5173.',
      label: 'Terminal',
      code: 'cd my-app && npm install && npm run build:packages && FRONTX_INCLUDE_TEMPLATE_EXAMPLES=1 npm run dev:all',
    },
  ],
};

export const FIRST_CHANGE_GUIDE: Guide = {
  title: 'Make your first change',
  lead: 'Find the screen files, change a title and rebuild the example you just started.',
  steps: [
    {
      title: 'Find the screen files',
      text: 'Each included screen has its own folder in the demo package.',
      label: 'Terminal',
      code: 'ls src-app/mfe_packages/demo-mfe/src/screens/helloworld',
    },
    {
      title: 'Change a title',
      text: 'The Hello World heading comes from the screen’s English dictionary.',
      label: 'src-app/mfe_packages/demo-mfe/src/screens/helloworld/i18n/en.json',
      code: '"title": "Hello World from my first change",',
    },
    {
      title: 'Rebuild the example',
      text: 'Rebuild the package and refresh the manifest, then reload the page.',
      label: 'Terminal',
      code: 'npm run build --workspace=@gears-frontx/demo-mfe && FRONTX_INCLUDE_TEMPLATE_EXAMPLES=1 npm run generate:mfe-manifests',
    },
  ],
};

export interface LibraryRow {
  name: string;
  version: string;
  gives: string;
}

/** The FrontX packages this app's package.json files depend on, with the versions they pin. */
export const LIBRARIES: LibraryRow[] = [
  { name: '@gears-frontx/ui-kit', version: '0.5.0', gives: 'React components on design tokens, built on Base UI.' },
  { name: '@gears-frontx/react', version: '0.2.0-alpha.18', gives: 'React bindings, hooks and the screen lifecycle.' },
  { name: '@gears-frontx/framework', version: '0.2.0-alpha.20', gives: 'The app instance and its plugin architecture.' },
  { name: '@gears-frontx/mfes', version: '0.6.0', gives: 'Registration, loading, isolation and mediation of microfrontends.' },
  { name: '@gears-frontx/gts-plugin', version: '0.6.1', gives: 'The GTS type system that checks every screen.' },
  { name: '@gears-frontx/routing', version: '0.4.0', gives: 'One browser history shared by all screens.' },
  { name: '@gears-frontx/api', version: '0.3.0', gives: 'API services and a shared request cache.' },
  { name: '@gears-frontx/state', version: '0.2.0-alpha.4', gives: 'Event bus, store and effects.' },
  { name: '@gears-frontx/i18n', version: '0.2.0-alpha.2', gives: 'Translation loading per screen.' },
  { name: '@gears-frontx/auth', version: '0.2.0-alpha.3', gives: 'The authentication contract (unused here: no sign-in).' },
  { name: '@gears-frontx/frontx-template-shell', version: '0.1.0-alpha.9', gives: 'The shell: build pipeline, schemas and manifest plugin.' },
];
