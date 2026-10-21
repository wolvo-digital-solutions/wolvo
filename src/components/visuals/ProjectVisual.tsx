import { useId, type CSSProperties, type ReactNode } from 'react';
import type { Project, ProjectVisualKind } from '@/types/content';
import { assetUrl } from '@/lib/url';
import './visuals.css';

const ACCENTS: Record<ProjectVisualKind, string> = {
  commerce: '#0066FF',
  dashboard: '#38BDF8',
  editorial: '#00D2FF',
  fitness: '#38BDF8',
  food: '#0066FF',
  ads: '#0066FF',
  editor: '#00B4D8',
  brand: '#00D2FF',
};

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

function Window({ x, y, w, children, className = '' }: { x: string; y: string; w: string; children: ReactNode; className?: string }) {
  return (
    <div className={`pv-window ${className}`} style={v({ '--x': x, '--y': y, '--w': w })}>
      <div className="pv-window__bar">
        <i />
        <i />
        <i />
        <span className="pv-window__url" />
      </div>
      <div className="pv-window__body">{children}</div>
    </div>
  );
}

function Line({ w = '100%', tone }: { w?: string; tone?: 'accent' | 'strong' }) {
  return <span className={`pv-line${tone ? ` pv-line--${tone}` : ''}`} style={{ width: w }} />;
}

function Sparkline({ d, className = '' }: { d: string; className?: string }) {
  return (
    <svg className={`pv-spark ${className}`} viewBox="0 0 100 32" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Commerce() {
  return (
    <Window x="9%" y="11%" w="82%">
      <div className="pv-nav">
        <span className="pv-logo" />
        <Line w="7%" />
        <Line w="7%" />
        <Line w="7%" />
        <span className="pv-pill" />
      </div>
      <div className="pv-commerce">
        <div className="pv-commerce__copy">
          <span className="pv-kicker">New collection</span>
          <strong className="pv-title">Made for the everyday.</strong>
          <Line w="88%" />
          <Line w="62%" />
          <span className="pv-btn">Shop now</span>
        </div>
        <div className="pv-commerce__product">
          <span className="pv-orb" />
          <span className="pv-product" />
          <span className="pv-chip">New</span>
        </div>
      </div>
      <div className="pv-cards">
        {[0, 1, 2].map((i) => (
          <div className="pv-card" key={i}>
            <span className={`pv-card__img pv-card__img--${i}`} />
            <Line w="80%" tone="strong" />
            <Line w="40%" />
          </div>
        ))}
      </div>
    </Window>
  );
}

function Dashboard() {
  const areaId = `pv-area-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <Window x="7%" y="10%" w="86%">
      <div className="pv-dash">
        <aside className="pv-dash__side">
          <span className="pv-logo pv-logo--sq" />
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} className={i === 1 ? 'is-active' : ''} />
          ))}
        </aside>
        <div className="pv-dash__main">
          <div className="pv-dash__head">
            <strong className="pv-h">Overview</strong>
            <span className="pv-pill pv-pill--wide" />
            <span className="pv-avatar" />
          </div>
          <div className="pv-kpis">
            {['M2 26 L20 20 L38 22 L56 12 L74 14 L98 4', 'M2 20 L22 24 L40 14 L60 18 L80 8 L98 10', 'M2 28 L18 22 L36 24 L54 16 L72 10 L98 6'].map((d, i) => (
              <div className="pv-kpi" key={i}>
                <Line w="45%" />
                <span className="pv-kpi__value" />
                <Sparkline d={d} />
              </div>
            ))}
          </div>
          <div className="pv-chart">
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id={areaId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="currentColor" stopOpacity=".35" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[25, 50, 75].map((y) => (
                <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,.06)" vectorEffect="non-scaling-stroke" />
              ))}
              <path d="M0 78 C30 70 45 52 75 56 S120 74 150 50 S200 18 230 30 S275 22 300 12 V100 H0Z" fill={`url(#${areaId})`} />
              <path d="M0 78 C30 70 45 52 75 56 S120 74 150 50 S200 18 230 30 S275 22 300 12" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path d="M0 88 C40 84 60 76 95 78 S150 70 180 64 S240 56 300 48" fill="none" stroke="#00D2FF" strokeWidth="1.6" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </div>
    </Window>
  );
}

function Editorial() {
  return (
    <Window x="9%" y="11%" w="82%">
      <div className="pv-nav">
        <span className="pv-logo pv-logo--text">studio</span>
        <Line w="6%" />
        <Line w="6%" />
        <Line w="6%" />
      </div>
      <div className="pv-editorial">
        <strong className="pv-display">
          Selected
          <br />
          work<em>.</em>
        </strong>
        <div className="pv-editorial__meta">
          <Line w="100%" />
          <Line w="70%" />
        </div>
      </div>
      <div className="pv-masonry">
        <span className="pv-tile pv-tile--a" />
        <span className="pv-tile pv-tile--b" />
        <span className="pv-tile pv-tile--c" />
      </div>
    </Window>
  );
}

function Phone({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`pv-phone ${className}`}>
      <span className="pv-phone__notch" />
      <div className="pv-phone__screen">{children}</div>
    </div>
  );
}

function Fitness() {
  return (
    <>
      <Phone className="pv-phone--back">
        <strong className="pv-h pv-h--sm">Workouts</strong>
        {[0, 1, 2, 3].map((i) => (
          <div className="pv-row" key={i}>
            <span className={`pv-row__icon pv-row__icon--${i}`} />
            <div>
              <Line w="80%" tone="strong" />
              <Line w="50%" />
            </div>
          </div>
        ))}
        <span className="pv-btn pv-btn--block">Start workout</span>
      </Phone>
      <Phone className="pv-phone--front">
        <span className="pv-kicker pv-kicker--muted">Good morning</span>
        <strong className="pv-h">Today</strong>
        <svg className="pv-rings" viewBox="0 0 100 100" aria-hidden="true">
          {[
            { r: 42, c: '#0066FF', p: 0.78 },
            { r: 32, c: '#00D2FF', p: 0.62 },
            { r: 22, c: '#32C48D', p: 0.86 },
          ].map(({ r, c, p }) => (
            <g key={r} transform="rotate(-90 50 50)">
              <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="7" />
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={c}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * r * p} ${2 * Math.PI * r}`}
              />
            </g>
          ))}
        </svg>
        <div className="pv-tiles">
          <span />
          <span />
        </div>
        <div className="pv-bars">
          {[46, 70, 38, 88, 60, 74, 52].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} className={i === 3 ? 'is-active' : ''} />
          ))}
        </div>
      </Phone>
      <div className="pv-float pv-float--goal">
        <span className="pv-float__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        Goal reached
      </div>
    </>
  );
}

function Food() {
  return (
    <>
      <Phone className="pv-phone--back">
        <strong className="pv-h pv-h--sm">Your order</strong>
        <div className="pv-map">
          <svg viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true">
            <path d="M10 70 C30 60 26 40 46 36 S70 26 88 10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="pv-map__pin" />
        </div>
        <div className="pv-steps">
          <i className="is-done" />
          <i className="is-done" />
          <i className="is-active" />
          <i />
        </div>
        <Line w="70%" tone="strong" />
        <Line w="45%" />
      </Phone>
      <Phone className="pv-phone--front">
        <span className="pv-search" />
        <div className="pv-chips">
          <span className="is-active" />
          <span />
          <span />
        </div>
        <div className="pv-feature">
          <span className="pv-feature__dish" />
          <span className="pv-feature__dish pv-feature__dish--sm" />
        </div>
        {[0, 1].map((i) => (
          <div className="pv-row" key={i}>
            <span className={`pv-row__icon pv-row__icon--round pv-row__icon--${i + 1}`} />
            <div>
              <Line w="75%" tone="strong" />
              <Line w="45%" />
            </div>
          </div>
        ))}
      </Phone>
    </>
  );
}

function Ads() {
  return (
    <>
      <div className="pv-panel">
        <div className="pv-panel__head">
          <span className="pv-meta-dot" />
          <strong className="pv-h pv-h--sm">Campaign overview</strong>
          <span className="pv-pill pv-pill--live">Active</span>
        </div>
        <div className="pv-kpis pv-kpis--ads">
          {[
            { label: 'Reach', d: 'M2 26 L20 22 L38 24 L56 14 L74 12 L98 4' },
            { label: 'CTR', d: 'M2 22 L22 20 L40 16 L60 18 L80 10 L98 8' },
            { label: 'Leads', d: 'M2 28 L18 26 L36 20 L54 18 L72 10 L98 6' },
          ].map(({ label, d }) => (
            <div className="pv-kpi" key={label}>
              <span className="pv-label">{label}</span>
              <span className="pv-kpi__value" />
              <Sparkline d={d} />
            </div>
          ))}
        </div>
        <div className="pv-chart pv-chart--bars">
          {[30, 42, 38, 55, 48, 66, 60, 78, 72, 90].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="pv-adcard">
        <div className="pv-adcard__head">
          <span className="pv-avatar" />
          <div>
            <Line w="60%" tone="strong" />
            <Line w="35%" />
          </div>
        </div>
        <div className="pv-adcard__media">
          <span className="pv-adcard__shape" />
          <strong>Grow with us</strong>
        </div>
        <div className="pv-adcard__cta">
          <Line w="45%" />
          <span className="pv-btn pv-btn--sm">Learn more</span>
        </div>
      </div>
    </>
  );
}

function Editor() {
  return (
    <Window x="6%" y="10%" w="88%" className="pv-window--app">
      <div className="pv-editor">
        <div className="pv-editor__monitor">
          <span className="pv-scene__sun" />
          <span className="pv-scene__hill pv-scene__hill--back" />
          <span className="pv-scene__hill" />
          <span className="pv-play" />
          <span className="pv-timecode">00:00:12:08</span>
        </div>
        <div className="pv-editor__inspector">
          <Line w="60%" tone="strong" />
          {[70, 45, 85].map((w, i) => (
            <span className="pv-slider" key={i}>
              <i style={{ width: `${w}%` }} />
            </span>
          ))}
          <Line w="80%" />
          <Line w="50%" />
        </div>
        <div className="pv-timeline">
          <div className="pv-ruler" />
          <div className="pv-track">
            <span className="pv-clip pv-clip--text" style={v({ '--l': '18%', '--w': '26%' })} />
          </div>
          <div className="pv-track">
            <span className="pv-clip" style={v({ '--l': '0%', '--w': '31%' })} />
            <span className="pv-clip pv-clip--b" style={v({ '--l': '32%', '--w': '24%' })} />
            <span className="pv-clip pv-clip--c" style={v({ '--l': '57%', '--w': '40%' })} />
          </div>
          <div className="pv-track pv-track--audio">
            <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0 10 L4 6 L8 14 L12 4 L16 16 L20 8 L24 12 L28 3 L32 17 L36 7 L40 13 L44 5 L48 15 L52 9 L56 11 L60 4 L64 16 L68 6 L72 14 L76 8 L80 12 L84 2 L88 18 L92 7 L96 13 L100 5 L104 15 L108 9 L112 11 L116 4 L120 16 L124 6 L128 14 L132 8 L136 12 L140 3 L144 17 L148 7 L152 13 L156 5 L160 15 L164 9 L168 11 L172 4 L176 16 L180 6 L184 14 L188 8 L192 12 L196 6 L200 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <span className="pv-playhead" />
        </div>
      </div>
    </Window>
  );
}

function Brand() {
  return (
    <div className="pv-board">
      <div className="pv-board__logo">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M22 34h16v4a8 8 0 0 1-16 0v-4Z M38 35h3a3 3 0 0 1 0 6h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M27 22c-1.5 2 1.5 3 0 5M33 20c-1.5 2 1.5 3 0 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <strong>café</strong>
      </div>
      <div className="pv-board__swatches">
        {[
          ['#F2E8DA', 'Cream'],
          ['#D9874F', 'Clay'],
          ['#8FA58A', 'Sage'],
          ['#3B2A20', 'Roast'],
        ].map(([c, n]) => (
          <span key={c} style={{ background: c }} className="pv-swatch">
            <em>{n}</em>
          </span>
        ))}
      </div>
      <div className="pv-board__type">
        <strong>Aa</strong>
        <Line w="70%" tone="strong" />
        <Line w="50%" />
      </div>
      <div className="pv-board__pattern" />
      <div className="pv-board__card">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
        <Line w="40%" />
      </div>
    </div>
  );
}

const VISUALS: Record<ProjectVisualKind, () => ReactNode> = {
  commerce: Commerce,
  dashboard: Dashboard,
  editorial: Editorial,
  fitness: Fitness,
  food: Food,
  ads: Ads,
  editor: Editor,
  brand: Brand,
};

interface ProjectVisualProps {
  project: Pick<Project, 'visual' | 'image' | 'imageAlt' | 'title'>;
  className?: string;
  ratio?: string;
}

/**
 * Project preview. Renders the real screenshot when `project.image` is set,
 * otherwise an illustrated, resolution-independent mockup for the category.
 */
export function ProjectVisual({ project, className = '', ratio }: ProjectVisualProps) {
  const style = v({ '--pv-accent': ACCENTS[project.visual], ...(ratio ? { aspectRatio: ratio } : {}) });

  if (project.image) {
    const isLocalProject = project.image.startsWith('/images/projects/');
    const baseWithoutExt = project.image.replace(/\.(webp|avif|jpg|png)$/, '');
    return (
      <div className={`pv pv--image ${className}`} style={style}>
        <div className="pv__inner" data-parallax>
          {isLocalProject ? (
            <picture>
              <source type="image/avif" srcSet={assetUrl(`${baseWithoutExt}.avif`)} />
              <source type="image/webp" srcSet={assetUrl(`${baseWithoutExt}.webp`)} />
              <img
                src={assetUrl(`${baseWithoutExt}.jpg`)}
                alt={project.imageAlt ?? project.title}
                loading="lazy"
                decoding="async"
              />
            </picture>
          ) : (
            <img
              src={assetUrl(project.image)}
              alt={project.imageAlt ?? project.title}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      </div>
    );
  }

  const Visual = VISUALS[project.visual];
  return (
    <div className={`pv pv--${project.visual} ${className}`} style={style} aria-hidden="true">
      <div className="pv__inner" data-parallax>
        <span className="pv__glow" />
        <Visual />
      </div>
    </div>
  );
}
