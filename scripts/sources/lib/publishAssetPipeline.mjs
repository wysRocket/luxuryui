import path from 'node:path';

export const RAW_ASSETS_PUBLIC_ROOT = '/assets/apps';
export const PUBLISH_READY_PUBLIC_ROOT = '/assets/publish-ready/apps';

const numericSort = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

export const calculateUpscaleDimensions = ({
  width,
  height,
  minWidth,
  minHeight,
}) => {
  if (!width || !height) {
    return null;
  }

  if (width >= minWidth && height >= minHeight) {
    return null;
  }

  const scale = Math.max(minWidth / width, minHeight / height);

  return {
    width: Math.ceil(width * scale),
    height: Math.ceil(height * scale),
  };
};

export const toRawPublicAssetPath = (slug, fileName) =>
  `${RAW_ASSETS_PUBLIC_ROOT}/${slug}/${fileName}`;

export const toPublishReadyPublicAssetPath = (slug, fileName) =>
  `${PUBLISH_READY_PUBLIC_ROOT}/${slug}/${fileName}`;

export const selectPublishScreenshotPaths = ({
  slug,
  rawScreenshotFiles = [],
  publishDirFiles = [],
}) => {
  const overrides = new Map();
  const rescueFiles = [];

  for (const fileName of [...publishDirFiles].sort(numericSort)) {
    const baseName = path.basename(fileName);

    if (/^screen-\d+\./i.test(baseName)) {
      overrides.set(path.parse(baseName).name, baseName);
      continue;
    }

    if (/^rescue-screen-\d+\./i.test(baseName)) {
      rescueFiles.push(baseName);
    }
  }

  const selectedRawScreens = rawScreenshotFiles.map((fileName) => {
    const baseName = path.parse(fileName).name;
    const override = overrides.get(baseName);

    return override
      ? toPublishReadyPublicAssetPath(slug, override)
      : toRawPublicAssetPath(slug, fileName);
  });

  return [
    ...selectedRawScreens,
    ...rescueFiles.map((fileName) => toPublishReadyPublicAssetPath(slug, fileName)),
  ];
};

export const derivePublishAssetOrigin = (publicPaths = []) => {
  if (publicPaths.some((publicPath) => /\/rescue-screen-\d+\./i.test(publicPath))) {
    return 'rescued';
  }

  if (publicPaths.some((publicPath) => publicPath.startsWith(PUBLISH_READY_PUBLIC_ROOT))) {
    return 'upscaled';
  }

  return 'raw';
};

export const buildRescueCandidates = ({
  publishApps = [],
  requiredCount,
}) =>
  publishApps
    .filter((app) =>
      app?.status === 'fail' &&
      Array.isArray(app?.issues) &&
      app.issues.some((issue) => issue.includes('insufficient screenshots'))
    )
    .map((app) => ({
      slug: app.slug,
      currentValidCount: app?.screenshots?.validCount ?? 0,
      missingScreenshots: Math.max(0, requiredCount - (app?.screenshots?.validCount ?? 0)),
    }))
    .filter((candidate) => candidate.missingScreenshots > 0);
