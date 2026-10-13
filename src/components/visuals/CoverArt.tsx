import { useId } from 'react';
import type { CoverVariant } from '@/types/content';

interface CoverArtProps {
  variant: CoverVariant;
  className?: string;
}

/**
 * Generative editorial covers in the Wolvo palette — used until real article
 * imagery is supplied (set `coverImage` on the article to override).
 */
export function CoverArt({ variant, className = '' }: CoverArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;

  return (
    <svg
      className={`cover-art ${className}`}
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d1424" />
          <stop offset="1" stopColor="#070a10" />
        </linearGradient>
        <linearGradient id={id('accent')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0066FF" />
          <stop offset="1" stopColor="#00D2FF" />
        </linearGradient>
        <linearGradient id={id('fade')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38BDF8" stopOpacity=".55" />
          <stop offset="1" stopColor="#0066FF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('glow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#0066FF" stopOpacity=".55" />
          <stop offset="1" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('glow2')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#00D2FF" stopOpacity=".5" />
          <stop offset="1" stopColor="#00D2FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="260" fill={url('bg')} />

      {variant === 'grid' && (
        <g>
          <circle cx="200" cy="96" r="150" fill={url('glow')} />
          <g stroke="rgba(105,167,255,.28)" strokeWidth="1">
            {[132, 146, 164, 188, 220, 260].map((y) => (
              <line key={y} x1="0" x2="400" y1={y} y2={y} />
            ))}
            {[-260, -160, -80, -20, 40, 100, 160, 220, 280, 340, 420, 500, 660].map((x) => (
              <line key={x} x1="200" y1="118" x2={x} y2="260" />
            ))}
          </g>
          <rect x="0" y="0" width="400" height="124" fill={url('bg')} opacity=".85" />
          <circle cx="200" cy="104" r="44" fill={url('accent')} />
          <rect x="112" y="40" width="176" height="112" rx="10" fill="rgba(13,17,24,.55)" stroke="rgba(255,255,255,.22)" />
          <g fill="rgba(255,255,255,.28)">
            <circle cx="126" cy="52" r="3" />
            <circle cx="136" cy="52" r="3" />
            <circle cx="146" cy="52" r="3" />
          </g>
          <rect x="128" y="76" width="92" height="9" rx="4" fill="rgba(255,255,255,.85)" />
          <rect x="128" y="92" width="64" height="6" rx="3" fill="rgba(255,255,255,.3)" />
          <rect x="128" y="112" width="44" height="16" rx="5" fill={url('accent')} />
        </g>
      )}

      {variant === 'orbit' && (
        <g>
          <circle cx="250" cy="130" r="160" fill={url('glow2')} />
          <g fill="none" stroke="rgba(105,167,255,.3)">
            <ellipse cx="200" cy="130" rx="170" ry="62" transform="rotate(-14 200 130)" />
            <ellipse cx="200" cy="130" rx="120" ry="42" transform="rotate(-14 200 130)" />
            <ellipse cx="200" cy="130" rx="220" ry="84" transform="rotate(-14 200 130)" strokeDasharray="3 6" />
          </g>
          <circle cx="58" cy="160" r="7" fill="#38BDF8" />
          <circle cx="320" cy="82" r="5" fill="#00D2FF" />
          <circle cx="98" cy="96" r="4" fill="#fff" opacity=".7" />
          <rect x="166" y="48" width="68" height="140" rx="16" fill="#0b1018" stroke="rgba(255,255,255,.28)" strokeWidth="2" />
          <rect x="190" y="56" width="20" height="5" rx="2.5" fill="#000" />
          <rect x="176" y="72" width="48" height="36" rx="8" fill={url('accent')} />
          <rect x="176" y="116" width="40" height="6" rx="3" fill="rgba(255,255,255,.6)" />
          <rect x="176" y="128" width="28" height="5" rx="2.5" fill="rgba(255,255,255,.25)" />
          <rect x="176" y="146" width="22" height="22" rx="6" fill="rgba(255,255,255,.08)" />
          <rect x="202" y="146" width="22" height="22" rx="6" fill="rgba(255,255,255,.08)" />
        </g>
      )}

      {variant === 'bars' && (
        <g>
          <circle cx="300" cy="60" r="150" fill={url('glow')} />
          {[46, 70, 58, 96, 84, 124, 110, 156].map((h, i) => (
            <rect key={i} x={48 + i * 40} y={220 - h} width="26" height={h} rx="5" fill={url('fade')} />
          ))}
          <polyline
            points="61,170 101,146 141,158 181,118 221,130 261,92 301,104 341,58"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[
            [181, 118],
            [261, 92],
            [341, 58],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="5" fill="#0d1424" stroke="#69A7FF" strokeWidth="2.5" />
          ))}
          <g transform="translate(320 186)">
            <circle r="26" fill="none" stroke="rgba(0,210,255,.6)" strokeWidth="2" />
            <circle r="15" fill="none" stroke="rgba(105,167,255,.8)" strokeWidth="2" />
            <circle r="6" fill={url('accent')} />
          </g>
        </g>
      )}

      {variant === 'wave' && (
        <g>
          <circle cx="120" cy="80" r="150" fill={url('glow2')} />
          <path d="M0 170 C70 120 130 210 200 160 S330 120 400 150 V260 H0Z" fill="rgba(36,91,255,.35)" />
          <path d="M0 196 C80 160 150 230 230 190 S340 170 400 186 V260 H0Z" fill="rgba(0,170,230,.32)" />
          <path d="M0 170 C70 120 130 210 200 160 S330 120 400 150" fill="none" stroke="#69A7FF" strokeWidth="2" />
          <path d="M0 196 C80 160 150 230 230 190 S340 170 400 186" fill="none" stroke="#38e1ff" strokeWidth="1.5" />
          <g transform="translate(200 92)">
            <circle r="34" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.45)" />
            <path d="M-9 -14 L16 0 L-9 14Z" fill="#fff" />
          </g>
          <g fill="rgba(255,255,255,.35)">
            {[60, 100, 300, 340].map((x, i) => (
              <rect key={x} x={x} y={i % 2 ? 70 : 52} width="22" height="38" rx="4" opacity={0.4 + i * 0.12} />
            ))}
          </g>
        </g>
      )}

      {variant === 'rings' && (
        <g>
          <circle cx="200" cy="130" r="170" fill={url('glow')} />
          <g fill="none" strokeWidth="1.2">
            {[40, 64, 90, 118, 148].map((r, i) => (
              <circle key={r} cx="200" cy="130" r={r} stroke={i % 2 ? 'rgba(0,210,255,.4)' : 'rgba(105,167,255,.35)'} />
            ))}
          </g>
          <path
            d="M178 112 L190 148 L200 120 L210 148 L222 112"
            fill="none"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[
            ['#0066FF', 88, 214],
            ['#00D2FF', 118, 222],
            ['#38BDF8', 282, 222],
            ['#F8FAFC', 312, 214],
          ].map(([c, x, y]) => (
            <circle key={x} cx={x} cy={y} r="12" fill={c as string} stroke="#0d1424" strokeWidth="3" />
          ))}
        </g>
      )}

      {variant === 'blocks' && (
        <g>
          <circle cx="110" cy="200" r="150" fill={url('glow2')} />
          <circle cx="320" cy="60" r="120" fill={url('glow')} />
          <g transform="translate(70 52) rotate(-8)">
            <rect width="132" height="92" rx="12" fill="#101725" stroke="rgba(255,255,255,.16)" />
            <rect x="14" y="16" width="60" height="8" rx="4" fill="rgba(255,255,255,.75)" />
            <rect x="14" y="32" width="90" height="5" rx="2.5" fill="rgba(255,255,255,.22)" />
            <rect x="14" y="56" width="104" height="22" rx="6" fill={url('accent')} />
          </g>
          <g transform="translate(210 96) rotate(6)">
            <rect width="124" height="104" rx="12" fill="#0f1522" stroke="rgba(255,255,255,.16)" />
            {[22, 40, 30, 56, 46, 66].map((h, i) => (
              <rect key={i} x={14 + i * 17} y={88 - h} width="10" height={h} rx="3" fill={url('fade')} />
            ))}
          </g>
          <g transform="translate(150 150) rotate(-3)">
            <rect width="96" height="58" rx="10" fill="#141c2c" stroke="rgba(105,167,255,.45)" />
            <circle cx="22" cy="29" r="10" fill={url('accent')} />
            <rect x="40" y="22" width="42" height="6" rx="3" fill="rgba(255,255,255,.7)" />
            <rect x="40" y="33" width="28" height="5" rx="2.5" fill="rgba(255,255,255,.25)" />
          </g>
          <path d="M318 40 l5 12 12 5 -12 5 -5 12 -5 -12 -12 -5 12 -5Z" fill="#fff" opacity=".85" />
        </g>
      )}
    </svg>
  );
}
