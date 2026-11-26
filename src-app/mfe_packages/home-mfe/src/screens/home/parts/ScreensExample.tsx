import React, { useId, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Badge,
  Button,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Empty,
  EmptyHeader,
  EmptyTitle,
  Field,
  FieldLabel,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
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
  Text,
  VisuallyHidden,
  type ChartConfig,
  type createToastManager,
} from '@gears-frontx/ui-kit';

type ToastManager = ReturnType<typeof createToastManager>;
import styles from './ScreensExample.module.css';

type Template = 'Blank screen' | 'Table' | 'Dashboard';
type Status = 'Live' | 'Draft';
type Filter = 'all' | 'live' | 'draft';

interface ScreenRow {
  id: number;
  name: string;
  template: Template;
  status: Status;
  inMenu: boolean;
}

const TEMPLATES: { value: Template; label: Template }[] = [
  { value: 'Blank screen', label: 'Blank screen' },
  { value: 'Table', label: 'Table' },
  { value: 'Dashboard', label: 'Dashboard' },
];

const INITIAL_ROWS: ScreenRow[] = [
  { id: 1, name: 'Home', template: 'Blank screen', status: 'Live', inMenu: true },
  { id: 2, name: 'Docs', template: 'Blank screen', status: 'Live', inMenu: true },
  { id: 3, name: 'Tasks', template: 'Table', status: 'Draft', inMenu: true },
];

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'draft', label: 'Draft' },
];

const chartConfig = {
  live: { label: 'Live', color: 'var(--app-accent)' },
  draft: { label: 'Draft', color: 'var(--app-violet)' },
} satisfies ChartConfig;

interface ScreensExampleProps {
  /** Where the kit's portalled popups (the select's list) render: inside this shadow root. */
  portalContainer: React.RefObject<HTMLDivElement | null>;
  /** The screen's own toast manager. */
  toasts: ToastManager;
}

/**
 * "Screens of this app": a form that adds a screen, a filtered table of the
 * screens and a summary that follows the table. The state lives in this
 * component only and resets on reload.
 */
export const ScreensExample: React.FC<ScreensExampleProps> = ({ portalContainer, toasts }) => {
  const ids = useId();
  const [rows, setRows] = useState<ScreenRow[]>(INITIAL_ROWS);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState<Template>('Blank screen');
  const [inMenu, setInMenu] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  const trimmed = name.trim();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (trimmed === '') return;
    setRows((current) => [
      ...current,
      { id: Math.max(0, ...current.map((row) => row.id)) + 1, name: trimmed, template, status: 'Draft', inMenu },
    ]);
    setName('');
    setTemplate('Blank screen');
    setInMenu(true);
    toasts.add({ title: 'Screen added', description: `${trimmed} is in the table as a draft.`, type: 'success' });
  };

  const toggleStatus = (id: number) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, status: row.status === 'Live' ? 'Draft' : 'Live' } : row)),
    );
  };

  const live = rows.filter((row) => row.status === 'Live').length;
  const draft = rows.length - live;

  const chartData = useMemo(
    () =>
      TEMPLATES.map(({ value }) => ({
        template: value,
        live: rows.filter((row) => row.template === value && row.status === 'Live').length,
        draft: rows.filter((row) => row.template === value && row.status === 'Draft').length,
      })),
    [rows],
  );

  const visible = (value: Filter) =>
    rows.filter((row) => value === 'all' || row.status.toLowerCase() === value);

  return (
    <section className={styles.card} aria-labelledby={`${ids}-title`} data-testid="screens-example">
      <div className={styles.head}>
        <h3 id={`${ids}-title`} className={styles.title}>
          Screens of this app
        </h3>
        <p className={styles.note}>A live example: every control below is a FrontX UI Kit component</p>
      </div>

      <div className={styles.columns}>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Add a screen</h4>
          <form className={styles.form} onSubmit={submit} noValidate>
            <Field>
              <FieldLabel htmlFor={`${ids}-name`}>Screen name</FieldLabel>
              <Input
                id={`${ids}-name`}
                placeholder="Reports"
                value={name}
                onValueChange={setName}
                autoComplete="off"
                data-testid="screen-name"
              />
            </Field>
            <Field>
              <FieldLabel id={`${ids}-template-label`}>Template</FieldLabel>
              <Select value={template} onValueChange={(value) => setTemplate(value as Template)} items={TEMPLATES}>
                <SelectTrigger className={styles.select} aria-labelledby={`${ids}-template-label`} data-testid="screen-template">
                  <SelectValue placeholder="Pick a template" />
                </SelectTrigger>
                <SelectContent container={portalContainer}>
                  {TEMPLATES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Label className={styles.switchRow}>
              <Switch
                checked={inMenu}
                onCheckedChange={setInMenu}
                aria-labelledby={`${ids}-menu-label`}
                data-testid="screen-in-menu"
              />
              <span id={`${ids}-menu-label`}>Show in the menu</span>
            </Label>
            <Button type="submit" disabled={trimmed === ''} className={styles.submit} data-testid="screen-add">
              Add screen
            </Button>
          </form>
        </div>

        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Screens</h4>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
            <TabsList variant="line" size="sm">
              {FILTERS.map((option) => (
                <TabsTrigger key={option.value} value={option.value} data-testid={`screens-filter-${option.value}`}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {FILTERS.map((option) => {
              const list = visible(option.value);
              return (
                <TabsContent key={option.value} value={option.value} className={styles.panel}>
                  {list.length === 0 ? (
                    <Empty className={styles.empty}>
                      <EmptyHeader>
                        <EmptyTitle>No screens here yet</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <Table density="compact">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Screen</TableHead>
                          <TableHead>Template</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>
                            <VisuallyHidden>Action</VisuallyHidden>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className={styles.nameCell}>{row.name}</TableCell>
                            <TableCell>{row.template}</TableCell>
                            <TableCell>
                              <Badge variant={row.status === 'Live' ? 'success' : 'secondary'}>{row.status}</Badge>
                            </TableCell>
                            <TableCell className={styles.actionCell}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={styles.rowAction}
                                onClick={() => toggleStatus(row.id)}
                                aria-label={`${row.status === 'Live' ? 'Unpublish' : 'Publish'} ${row.name}`}
                                data-testid={`screen-toggle-${row.id}`}
                              >
                                {row.status === 'Live' ? 'Unpublish' : 'Publish'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        <div className={styles.column}>
          <h4 className={styles.columnTitle}>At a glance</h4>
          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt className={styles.statLabel}>Screens</dt>
              <dd className={styles.statValue} data-testid="stat-screens">
                <Text typography="kpi" render={<span />}>
                  {rows.length}
                </Text>
              </dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statLabel}>Live</dt>
              <dd className={styles.statValue} data-testid="stat-live">
                <Text typography="kpi" render={<span />}>
                  {live}
                </Text>
              </dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statLabel}>Draft</dt>
              <dd className={styles.statValue} data-testid="stat-draft">
                <Text typography="kpi" render={<span />}>
                  {draft}
                </Text>
              </dd>
            </div>
          </dl>
          <figure className={styles.chart}>
            <figcaption className={styles.chartTitle}>Screens by template</figcaption>
            <ChartContainer config={chartConfig} className={styles.chartBox}>
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="template" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="live" stackId="status" fill="var(--color-live)" />
                <Bar dataKey="draft" stackId="status" fill="var(--color-draft)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </figure>
        </div>
      </div>
    </section>
  );
};
