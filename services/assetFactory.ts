import { AppItem } from '../types';

const PLATFORM_LABEL: Record<AppItem['platform'], string> = {
  iOS: 'iOS',
  Android: 'Android',
  Web: 'Web',
};

const hashSeed = (input: string): number => {
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }

  return hash;
};

const hueFromSeed = (seed: string, offset = 0): number => {
  return (hashSeed(`${seed}-${offset}`) % 360 + 360) % 360;
};

const toDataUri = (svg: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const generateAppLogoAsset = (name: string, seed: number): string => {
  const h1 = hueFromSeed(name, seed);
  const h2 = hueFromSeed(name, seed + 11);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="hsl(${h1} 75% 58%)" />
      <stop offset="1" stop-color="hsl(${h2} 80% 42%)" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="120" height="120" rx="28" fill="url(#grad)" />
  <rect x="14" y="14" width="92" height="92" rx="22" fill="white" fill-opacity="0.12" />
  <text x="60" y="72" text-anchor="middle" fill="white" font-size="44" font-family="Arial, Helvetica, sans-serif" font-weight="700">${initials || 'A'}</text>
</svg>`;

  return toDataUri(svg);
};

export const generateAppScreenAsset = (app: AppItem, index: number): string => {
  const base = `${app.name}-${app.category}-${app.platform}-${index}`;
  const h1 = hueFromSeed(base, 1);
  const h2 = hueFromSeed(base, 2);
  const h3 = hueFromSeed(base, 3);
  const label = `${app.name} Screen ${index + 1}`;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280" fill="none">
  <defs>
    <linearGradient id="bg" x1="40" y1="0" x2="680" y2="1280" gradientUnits="userSpaceOnUse">
      <stop stop-color="hsl(${h1} 70% 55%)" />
      <stop offset="1" stop-color="hsl(${h2} 72% 30%)" />
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="white" stop-opacity="0.92" />
      <stop offset="1" stop-color="white" stop-opacity="0.74" />
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="720" height="1280" fill="url(#bg)" />
  <circle cx="118" cy="132" r="180" fill="hsl(${h3} 78% 62%)" fill-opacity="0.34" />
  <circle cx="650" cy="1140" r="220" fill="hsl(${h1} 90% 75%)" fill-opacity="0.24" />

  <rect x="64" y="82" width="592" height="68" rx="34" fill="rgba(15,15,15,0.22)" />
  <text x="96" y="125" fill="white" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">${app.name}</text>
  <text x="634" y="125" text-anchor="end" fill="white" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="600">${PLATFORM_LABEL[app.platform]}</text>

  <rect x="64" y="190" width="592" height="360" rx="40" fill="url(#card)" />
  <rect x="104" y="242" width="512" height="36" rx="18" fill="rgba(20,20,20,0.10)" />
  <rect x="104" y="302" width="468" height="24" rx="12" fill="rgba(20,20,20,0.12)" />
  <rect x="104" y="346" width="410" height="24" rx="12" fill="rgba(20,20,20,0.1)" />
  <rect x="104" y="392" width="320" height="24" rx="12" fill="rgba(20,20,20,0.08)" />
  <rect x="104" y="444" width="180" height="54" rx="27" fill="rgba(20,20,20,0.78)" />

  <rect x="64" y="582" width="284" height="284" rx="36" fill="url(#card)" />
  <rect x="372" y="582" width="284" height="284" rx="36" fill="url(#card)" />
  <rect x="64" y="892" width="592" height="254" rx="40" fill="url(#card)" />

  <rect x="96" y="928" width="220" height="26" rx="13" fill="rgba(20,20,20,0.16)" />
  <rect x="96" y="972" width="300" height="18" rx="9" fill="rgba(20,20,20,0.12)" />
  <rect x="96" y="1003" width="260" height="18" rx="9" fill="rgba(20,20,20,0.1)" />
  <rect x="96" y="1060" width="170" height="50" rx="25" fill="rgba(20,20,20,0.8)" />

  <text x="96" y="1208" fill="rgba(255,255,255,0.92)" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="600">${label}</text>
</svg>`;

  return toDataUri(svg);
};

export const buildGeneratedScreens = (app: AppItem, count: number): string[] => {
  return Array.from({ length: count }, (_, index) => generateAppScreenAsset(app, index));
};

export const generateAvatarAsset = (name: string, seed: number): string => {
  const h1 = hueFromSeed(name, seed);
  const h2 = hueFromSeed(name, seed + 21);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="avatar" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="hsl(${h1} 72% 56%)" />
      <stop offset="1" stop-color="hsl(${h2} 78% 38%)" />
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="80" fill="url(#avatar)" />
  <text x="80" y="95" text-anchor="middle" fill="white" font-size="52" font-family="Arial, Helvetica, sans-serif" font-weight="700">${initials || 'U'}</text>
</svg>`;

  return toDataUri(svg);
};
