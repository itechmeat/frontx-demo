import React, { useEffect, useRef, useState } from 'react';
import type { ChildMfeBridge } from '@gears-frontx/react';
import { FRONTX_SHARED_PROPERTY_THEME } from '@gears-frontx/react';
import {
  Button,
  Card,
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VisuallyHidden,
  buttonVariants,
} from '@gears-frontx/ui-kit';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { kitThemeScopeFor } from '../../shared/kitThemeScope';
import { DEFAULT_THEME_ID, readBridgeProperty } from '../../shared/readBridgeProperty';
import { HubScene } from '../../illustrations/HubScene';
import { CardTrayScene } from '../../illustrations/CardTrayScene';
import { RoundPlateScene } from '../../illustrations/RoundPlateScene';
import { FIRST_CHANGE_GUIDE, LIBRARIES, PROMPT_LINES, PROMPT_TEXT, RUN_GUIDE, type Guide } from './content';
import styles from './DocsScreen.module.css';

type TabValue = 'overview' | 'run' | 'first-change' | 'libraries';

const TABS: { value: TabValue; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'run', label: 'Run Shell + MFE' },
  { value: 'first-change', label: 'First change' },
  { value: 'libraries', label: 'Libraries' },
];

const TEMPLATES_URL = 'https://github.com/constructorfabric/gears-frontx-templates';

/** An arrow kept on the line of the link text's last word. */
const ArrowText: React.FC<{ text: string }> = ({ text }) => {
  const words = text.split(' ');
  const last = words.pop();
  return (
    <>
      {words.length > 0 ? `${words.join(' ')} ` : null}
      <span className={styles.nowrap}>
        {last}
        <ArrowRight className={styles.arrow} aria-hidden="true" />
      </span>
    </>
  );
};

/** The prompt block: a code block with a "Copy" button that reads "Copied" for two seconds. */
const PromptBlock: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = () => {
    void navigator.clipboard?.writeText(PROMPT_TEXT).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <CodeBlock className={styles.code}>
      <CodeBlockHeader className={styles.codeHead}>
        <CodeBlockTitle className={styles.codeLabel}>Prompt</CodeBlockTitle>
        <Button
          variant="outline"
          size="sm"
          icon={copied ? <Check /> : <Copy />}
          onClick={copy}
          className={styles.copy}
          data-testid="prompt-copy"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </CodeBlockHeader>
      <CodeBlockContent wrap aria-label="Prompt" className={styles.codeBody}>
        {PROMPT_LINES.join('\n')}
      </CodeBlockContent>
      <VisuallyHidden aria-live="polite">{copied ? 'Prompt copied' : ''}</VisuallyHidden>
    </CodeBlock>
  );
};

const GuidePanel: React.FC<{ guide: Guide }> = ({ guide }) => (
  <div className={styles.guide}>
    <div className={styles.guideHead}>
      <h2 className={styles.groupTitle}>{guide.title}</h2>
      <p className={styles.lead}>{guide.lead}</p>
    </div>
    <ol className={styles.steps}>
      {guide.steps.map((step, index) => (
        <li key={step.title} className={styles.step}>
          <span className={styles.stepNumber} aria-hidden="true">
            {index + 1}
          </span>
          <div className={styles.stepBody}>
            <h3 className={styles.itemTitle}>{step.title}</h3>
            <p className={styles.body}>{step.text}</p>
            <CodeBlock className={styles.code}>
              <CodeBlockHeader className={styles.codeHead}>
                <CodeBlockTitle className={styles.codeLabel}>{step.label}</CodeBlockTitle>
              </CodeBlockHeader>
              <CodeBlockContent wrap aria-label={`${step.title}: ${step.label}`} className={styles.codeBody}>
                {step.code}
              </CodeBlockContent>
            </CodeBlock>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

interface DocsScreenProps {
  bridge: ChildMfeBridge;
}

/**
 * The entry to the documentation: a page head, live tabs, a prompt to start
 * from, three guide cards, the source and tools, two short guides and the
 * FrontX packages this app depends on.
 */
export const DocsScreen: React.FC<DocsScreenProps> = ({ bridge }) => {
  const [theme, setTheme] = useState<string>(() =>
    readBridgeProperty(bridge, FRONTX_SHARED_PROPERTY_THEME, DEFAULT_THEME_ID),
  );
  const [prevBridge, setPrevBridge] = useState(bridge);
  if (prevBridge !== bridge) {
    setPrevBridge(bridge);
    setTheme(readBridgeProperty(bridge, FRONTX_SHARED_PROPERTY_THEME, DEFAULT_THEME_ID));
  }
  useEffect(
    () =>
      bridge.subscribeToProperty(FRONTX_SHARED_PROPERTY_THEME, (property) => {
        if (typeof property.value === 'string') setTheme(property.value);
      }),
    [bridge],
  );

  const [tab, setTab] = useState<TabValue>('overview');
  const tabsRef = useRef<HTMLDivElement>(null);

  const open = (value: TabValue) => {
    setTab(value);
    tabsRef.current?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  };

  const guideCards: { value: TabValue; title: string; text: string; Scene: React.ComponentType<{ label?: string }> }[] = [
    {
      value: 'run',
      title: 'Run Shell + MFE',
      text: 'Create the host, add the microfrontend workspace and open two included screens.',
      Scene: HubScene,
    },
    {
      value: 'first-change',
      title: 'Make your first change',
      text: 'Find the screen files, change a title and rebuild the example you just started.',
      Scene: CardTrayScene,
    },
    {
      value: 'libraries',
      title: 'Use UI Kit in your app',
      text: 'Find component contracts and integration notes for the kit.',
      Scene: RoundPlateScene,
    },
  ];

  return (
    <div className={styles.screen} data-theme={kitThemeScopeFor(theme)} data-testid="screen-root">
      <div className={styles.page}>
        <header className={styles.head}>
          <h1 className={styles.pageTitle}>Build with FrontX.</h1>
          <p className={styles.headLead}>
            Start with a project template, or bring individual libraries into your application.
          </p>
        </header>

        <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)} className={styles.tabs}>
          <div className={styles.tabRow} ref={tabsRef}>
            <TabsList variant="line" className={styles.tabList}>
              {TABS.map((item) => (
                <TabsTrigger key={item.value} value={item.value} className={styles.tab} data-testid={`docs-tab-${item.value}`}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className={styles.panel}>
            <div className={styles.overview}>
              <Card className={styles.promptCard}>
                <div className={styles.promptIntro}>
                  <h2 className={styles.groupTitle}>Start with one prompt.</h2>
                  <p className={styles.body}>
                    Copy the prompt, paste it into your coding agent and let it set up FrontX and build your first app.
                  </p>
                  <p className={styles.note}>Works with Claude Code, Codex and other coding agents.</p>
                </div>
                <PromptBlock />
              </Card>

              <ul className={styles.guideCards}>
                {guideCards.map(({ value, title, text, Scene }) => (
                  <li key={value} className={styles.guideCardItem}>
                    <Card
                      render={
                        <a
                          href="/?screen=docs"
                          onClick={(event) => {
                            event.preventDefault();
                            open(value);
                          }}
                        />
                      }
                      className={styles.guideCard}
                      data-testid={`docs-card-${value}`}
                    >
                      <span className={styles.guidePicture}>
                        <span className={styles.guideFigure}>
                          <Scene />
                        </span>
                      </span>
                      <span className={styles.guideText}>
                        <span className={styles.cardTitleSm}>{title}</span>
                        <span className={styles.body}>{text}</span>
                        <ArrowRight className={styles.guideArrow} aria-hidden="true" />
                      </span>
                    </Card>
                  </li>
                ))}
              </ul>

              <section className={styles.sources} aria-labelledby="docs-sources-title">
                <h2 id="docs-sources-title" className={styles.groupTitle}>
                  Source and tools
                </h2>
                <div className={styles.sourceCards}>
                  <Card className={styles.sourceCard}>
                    <h3 className={styles.cardTitleSm}>Understand the templates</h3>
                    <p className={styles.body}>
                      Browse selected source files and run the composed Shell + MFE example before installing.
                    </p>
                    <a
                      href={TEMPLATES_URL}
                      target="_blank"
                      rel="noreferrer"
                      className={`${buttonVariants({ variant: 'outline', size: 'lg' })} ${styles.outlineCta}`}
                    >
                      Explore templates
                      <ArrowRight className={styles.arrow} aria-hidden="true" />
                    </a>
                  </Card>
                  <Card className={styles.sourceCard}>
                    <h3 className={styles.cardTitleSm}>Work with an agent</h3>
                    <p className={styles.body}>Use a focused task with the first-change guide.</p>
                    <div className={styles.linkList}>
                      <Link
                        href="/?screen=docs"
                        className={styles.accentLink}
                        onClick={(event) => {
                          event.preventDefault();
                          open('first-change');
                        }}
                      >
                        <ArrowText text="Get the first-change task" />
                      </Link>
                      <Link
                        href={`${TEMPLATES_URL}#readme`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.accentLink}
                      >
                        AI Kit documentation
                      </Link>
                    </div>
                  </Card>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="run" className={styles.panel}>
            <GuidePanel guide={RUN_GUIDE} />
          </TabsContent>

          <TabsContent value="first-change" className={styles.panel}>
            <GuidePanel guide={FIRST_CHANGE_GUIDE} />
          </TabsContent>

          <TabsContent value="libraries" className={styles.panel}>
            <div className={styles.libraries}>
              <div className={styles.guideHead}>
                <h2 className={styles.groupTitle}>Libraries</h2>
                <p className={styles.lead}>The FrontX packages this app depends on, as its package.json files pin them.</p>
              </div>
              <Card className={styles.tableCard}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>What it gives</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LIBRARIES.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell className={styles.mono}>{row.name}</TableCell>
                        <TableCell className={styles.mono}>{row.version}</TableCell>
                        <TableCell>{row.gives}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

DocsScreen.displayName = 'DocsScreen';
