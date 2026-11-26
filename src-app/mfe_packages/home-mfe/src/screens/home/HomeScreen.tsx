import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ChildMfeBridge } from '@gears-frontx/react';
import { FRONTX_SHARED_PROPERTY_THEME } from '@gears-frontx/react';
import { Link, Toaster, buttonVariants, createToastManager } from '@gears-frontx/ui-kit';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { kitThemeScopeFor } from '../../shared/kitThemeScope';
import { DEFAULT_THEME_ID, readBridgeProperty } from '../../shared/readBridgeProperty';
import { DOCS_HREF, GITHUB_URL, openDocs } from '../../shared/screenLinks';
import { AGENT_FEATURE, FEATURES, type Feature } from './parts/features';
import { ScreensExample } from './parts/ScreensExample';
import styles from './HomeScreen.module.css';

interface HomeScreenProps {
  bridge: ChildMfeBridge;
}

/** A link whose arrow stays on the same line as its last word. */
const ArrowText: React.FC<{ text: string; external?: boolean }> = ({ text, external = false }) => {
  const words = text.split(' ');
  const last = words.pop();
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <>
      {words.length > 0 ? `${words.join(' ')} ` : null}
      <span className={styles.nowrap}>
        {last}
        <Arrow className={styles.arrow} aria-hidden="true" />
      </span>
    </>
  );
};

const FeatureCard: React.FC<{ feature: Feature; wide?: boolean }> = ({ feature, wide = false }) => {
  const { Scene } = feature;
  return (
    <article className={wide ? styles.wideCard : styles.featureCard} data-testid={`feature-${feature.id}`}>
      <div className={styles.picture}>
        <div className={styles.pictureFigure}>
          <Scene />
        </div>
      </div>
      <div className={styles.featureText}>
        <h3 className={styles.cardTitle}>{feature.title}</h3>
        <p className={styles.featureLine}>{feature.line}</p>
      </div>
      <ul className={styles.points}>
        {feature.points.map((point) => (
          <li key={point} className={styles.point}>
            {point}
          </li>
        ))}
      </ul>
    </article>
  );
};

const GROUNDWORK = [
  {
    title: 'App Shell',
    text: 'Navigation and routing, ready for your application.',
    link: 'Explore the Shell',
    href: `${GITHUB_URL}/tree/main/template-shell`,
  },
  {
    title: 'Screen templates',
    text: 'A starting point for screens that connect to your application.',
    link: 'Explore screen templates',
    href: `${GITHUB_URL}/tree/main/template-mfe`,
  },
  {
    title: 'Shared UI and conventions',
    text: 'Reusable controls and design rules for people and coding agents.',
    link: 'Explore Design Guardrails',
    href: `${GITHUB_URL}/tree/main/template-design-guardrails`,
  },
];

const FIRST_STEPS = [
  { title: 'Install and assemble', text: 'Set up the Shell and its MFE workspace.' },
  { title: 'Run it locally', text: 'Open the included example screens.' },
  { title: 'Make your first change', text: 'Edit a screen and see it in the running application.' },
];

/**
 * The product home page: a hero band, what FrontX gives, the groundwork, a
 * live UI Kit example, the first steps and a closing band.
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({ bridge }) => {
  const [theme, setTheme] = useState<string>(() =>
    readBridgeProperty(bridge, FRONTX_SHARED_PROPERTY_THEME, DEFAULT_THEME_ID),
  );
  const [prevBridge, setPrevBridge] = useState(bridge);
  if (prevBridge !== bridge) {
    setPrevBridge(bridge);
    setTheme(readBridgeProperty(bridge, FRONTX_SHARED_PROPERTY_THEME, DEFAULT_THEME_ID));
  }

  useEffect(() => {
    return bridge.subscribeToProperty(FRONTX_SHARED_PROPERTY_THEME, (property) => {
      if (typeof property.value === 'string') setTheme(property.value);
    });
  }, [bridge]);

  /*
   * Kit popups (the select's list, the notifications) portal to this node,
   * which sits inside the shadow root, so they keep the screen's styles. It
   * renders before them: Base UI reads the ref on its consumers' first commit.
   */
  const portalContainerRef = useRef<HTMLDivElement>(null);
  // The screen's own toast manager, so a shell Toaster never shows these twice.
  const toasts = useMemo(() => createToastManager(), []);

  const docsLinkProps = {
    href: DOCS_HREF,
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => openDocs(bridge, event),
  };

  return (
    <div className={styles.screen} data-theme={kitThemeScopeFor(theme)} data-testid="screen-root">
      <div className={styles.page}>
        <div ref={portalContainerRef} />
        {/* A. Hero band */}
        <section className={styles.hero} aria-labelledby="home-hero-title">
          <div className={styles.heroInner}>
            <h1 id="home-hero-title" className={styles.heroTitle}>
              <span className={styles.heroLine}>Build complex apps.</span>{' '}
              <span className={styles.heroLine}>With a shared foundation.</span>
            </h1>
            <div className={styles.heroAside}>
              <p className={styles.heroLead}>
                FrontX is an open-source development kit for complex web interfaces, designed for AI-assisted coding.
              </p>
              <div className={styles.actions}>
                <a {...docsLinkProps} className={`${buttonVariants({ size: 'lg' })} ${styles.cta} ${styles.ctaOnBlue}`} data-testid="hero-get-started">
                  Get started
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={styles.heroLink}>
                  <ArrowText text="View on GitHub" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.column}>
          {/* B. What you get */}
          <section className={styles.section} aria-labelledby="home-features-title">
            <div className={styles.sectionHead}>
              <h2 id="home-features-title" className={styles.sectionTitle}>
                What you get with FrontX.
              </h2>
              <p className={styles.sectionLead}>Seven things this very app already does.</p>
            </div>
            <div className={styles.featureStack}>
              <div className={styles.featureGrid}>
                {FEATURES.map((feature) => (
                  <FeatureCard key={feature.id} feature={feature} />
                ))}
              </div>
              <FeatureCard feature={AGENT_FEATURE} wide />
            </div>
          </section>

          {/* C. The groundwork */}
          <section className={`${styles.section} ${styles.groundwork}`} aria-labelledby="home-groundwork-title">
            <h2 id="home-groundwork-title" className={styles.sectionTitle}>
              The groundwork, already connected.
            </h2>
            <div className={styles.groundworkGrid}>
              {GROUNDWORK.map((item) => (
                <div key={item.title} className={styles.groundworkItem}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.body}>{item.text}</p>
                  <Link href={item.href} target="_blank" rel="noreferrer" variant="inherit" className={styles.darkLink}>
                    <ArrowText text={item.link} />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* D. One visual language */}
          <section className={styles.section} aria-labelledby="home-uikit-title">
            <div className={styles.splitHead}>
              <div className={styles.splitHeadMain}>
                <p className={styles.eyebrow}>FrontX UI Kit</p>
                <h2 id="home-uikit-title" className={styles.sectionTitle}>
                  <span className={styles.heroLine}>One visual language.</span>{' '}
                  <span className={styles.heroLine}>Every interaction.</span>
                </h2>
              </div>
              <div className={styles.splitHeadAside}>
                <p className={styles.sectionLead}>
                  A shared vocabulary for your interfaces. Explore the components, then use them in your application.
                </p>
                <Link {...docsLinkProps} className={styles.accentLink}>
                  <ArrowText text="Explore UI Kit" />
                </Link>
              </div>
            </div>
            <div className={styles.example}>
              <ScreensExample portalContainer={portalContainerRef} toasts={toasts} />
              <p className={styles.builtWith}>
                Built with: Input, Select, Switch, Button, Tabs, Table, Badge, Empty, Chart and notifications from the
                FrontX UI Kit.
              </p>
            </div>
          </section>

          {/* E. First change */}
          <section className={`${styles.section} ${styles.firstChange}`} aria-labelledby="home-first-title">
            <div className={styles.firstIntro}>
              <h2 id="home-first-title" className={styles.sectionTitle}>
                <span className={styles.heroLine}>A running app.</span>{' '}
                <span className={styles.heroLine}>Then your first change.</span>
              </h2>
              <p className={styles.sectionLead}>
                Install the templates, run the shell and its screens and make your first change.
              </p>
              <Link {...docsLinkProps} className={styles.accentLink}>
                <ArrowText text="See the example first" />
              </Link>
            </div>
            <ul className={styles.steps}>
              {FIRST_STEPS.map((step) => (
                <li key={step.title} className={styles.stepItem}>
                  <a {...docsLinkProps} className={styles.step}>
                    <span className={styles.stepText}>
                      <span className={styles.itemTitle}>{step.title}</span>
                      <span className={styles.body}>{step.text}</span>
                    </span>
                    <ArrowRight className={styles.stepArrow} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* F. Closing band */}
        <section className={styles.closing} aria-labelledby="home-closing-title">
          <div className={styles.closingInner}>
            <h2 id="home-closing-title" className={styles.closingTitle}>
              Build your next app on FrontX.
            </h2>
            <div className={styles.actions}>
              <a {...docsLinkProps} className={`${buttonVariants({ size: 'lg' })} ${styles.cta} ${styles.ctaOnDark}`}>
                Get started
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={styles.closingLink}>
                <ArrowText text="Explore the source" />
              </a>
            </div>
          </div>
        </section>
        <Toaster toastManager={toasts} container={portalContainerRef} />
      </div>
    </div>
  );
};

HomeScreen.displayName = 'HomeScreen';
