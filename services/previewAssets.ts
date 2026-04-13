import { REAL_APP_ASSETS } from "../data/realAppAssets";
import { buildGeneratedScreens, generateAppScreenAsset } from "./assetFactory";
import type { AppItem } from "../types";

export const hasPreviewScreensForApp = (app: AppItem): boolean =>
  (REAL_APP_ASSETS[app.name]?.screenshots?.length ?? 0) > 0;

export const getPreviewImageForApp = (app: AppItem): string => {
  if (hasPreviewScreensForApp(app)) {
    return app.image || REAL_APP_ASSETS[app.name]?.screenshots?.[0] || generateAppScreenAsset(app, 0);
  }

  return generateAppScreenAsset(app, 0);
};

export const getPreviewScreensForApp = (
  app: AppItem,
  count: number,
): string[] => {
  if (hasPreviewScreensForApp(app)) {
    return REAL_APP_ASSETS[app.name]?.screenshots ?? [];
  }

  const fallbackCount = Math.max(4, Math.min(count, 12));
  return buildGeneratedScreens(app, fallbackCount);
};
