export const EXPORT_CAPABLE_STITCH_MODES = ['rapid', 'standard'];

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

const countTextItems = (value) => (Array.isArray(value) ? value.filter(hasText).length : 0);

const hasItems = (value) => countTextItems(value) > 0;

const isValidTimestamp = (value) => {
  if (!hasText(value)) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
};

const isValidHttpUrl = (value) => {
  if (!hasText(value)) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const unique = (values) => [...new Set(values.filter(Boolean))];

export const normalizeStitchMode = (mode) => {
  if (!hasText(mode)) {
    return null;
  }

  const normalizedMode = mode.trim().toLowerCase();
  return EXPORT_CAPABLE_STITCH_MODES.includes(normalizedMode) ? normalizedMode : null;
};

const auditExportEligibility = ({ stitchRun }) => {
  const normalizedStitchMode = normalizeStitchMode(stitchRun?.stitchMode);
  const reasons = [];

  if (!normalizedStitchMode) {
    reasons.push('blocked_non_exportable_stitch_mode');
  }

  if (!hasText(stitchRun?.stitchProjectId)) {
    reasons.push('blocked_missing_stitch_project');
  }

  return {
    status: reasons.length === 0 ? 'pass' : 'blocked',
    stitchProjectId: stitchRun?.stitchProjectId ?? null,
    stitchMode: stitchRun?.stitchMode ?? null,
    normalizedStitchMode,
    reasons,
  };
};

const auditContentVerification = ({ spec, reconstruction }) => {
  const reasons = [];

  if (reconstruction?.reconstructionStatus !== 'done') {
    reasons.push('blocked_reconstruction_incomplete');
  }

  if (!isValidTimestamp(reconstruction?.contentBuiltAt)) {
    reasons.push('blocked_missing_content_timestamp');
  }

  if (!hasItems(spec?.includedFrames) || !hasItems(spec?.componentAbstractions) || !hasItems(spec?.colorStyles)) {
    reasons.push('blocked_missing_required_content');
  }

  return {
    status: reasons.length === 0 ? 'pass' : 'blocked',
    reconstructionStatus: reconstruction?.reconstructionStatus ?? null,
    contentBuiltAt: reconstruction?.contentBuiltAt ?? null,
    includedFrameCount: countTextItems(spec?.includedFrames),
    componentAbstractionCount: countTextItems(spec?.componentAbstractions),
    colorStyleCount: countTextItems(spec?.colorStyles),
    reasons,
  };
};

const auditExportEvidence = ({ existingFinalization }) => {
  const exportEvidence = existingFinalization?.exportEvidence ?? null;
  const reasons = [];

  if (!exportEvidence) {
    reasons.push('blocked_export_evidence_missing');
  } else if (
    !hasText(exportEvidence.method) ||
    !isValidTimestamp(exportEvidence.exportedAt) ||
    !hasText(exportEvidence.finalAssetId) ||
    !isValidHttpUrl(exportEvidence.finalAssetUrl) ||
    !hasText(exportEvidence.source)
  ) {
    reasons.push('blocked_export_evidence_incomplete');
  }

  return {
    status: reasons.length === 0 ? 'pass' : 'blocked',
    evidence: exportEvidence,
    reasons,
  };
};

const auditDeliveryVerification = ({ existingFinalization }) => {
  const deliveryVerification = existingFinalization?.deliveryVerification ?? null;
  const reasons = [];

  if (
    deliveryVerification?.status !== 'pass' ||
    !isValidTimestamp(deliveryVerification?.verifiedAt) ||
    !hasText(deliveryVerification?.fulfillmentType) ||
    !isValidHttpUrl(deliveryVerification?.handoffUrl)
  ) {
    reasons.push('blocked_delivery_handoff_unverified');
  }

  return {
    status: reasons.length === 0 ? 'pass' : 'blocked',
    verification: deliveryVerification,
    reasons,
  };
};

export const auditFinalizationState = ({
  productId,
  kitSlug,
  spec,
  reconstruction,
  stitchRun,
  existingFinalization,
  now = new Date().toISOString(),
}) => {
  const exportEligibility = auditExportEligibility({ stitchRun });
  const contentVerification = auditContentVerification({ spec, reconstruction });
  const exportVerification = auditExportEvidence({ existingFinalization });
  const deliveryVerification = auditDeliveryVerification({ existingFinalization });
  const blockingReasons = unique([
    ...exportEligibility.reasons,
    ...contentVerification.reasons,
    ...exportVerification.reasons,
    ...deliveryVerification.reasons,
  ]);
  const contentAndExportPass =
    exportEligibility.status === 'pass' &&
    contentVerification.status === 'pass' &&
    exportVerification.status === 'pass';
  const allChecksPass = contentAndExportPass && deliveryVerification.status === 'pass';

  let finalizationStatus = 'blocked';
  if (allChecksPass) {
    finalizationStatus = 'finalized';
  } else if (contentAndExportPass) {
    finalizationStatus = 'content_verified';
  }

  let auditClassification = 'repairable';
  if (allChecksPass) {
    auditClassification = 'finalized';
  } else if (exportEligibility.status !== 'pass' || contentVerification.status !== 'pass') {
    auditClassification = 'must_regenerate';
  }

  return {
    productId,
    kitSlug,
    auditedAt: now,
    finalizationStatus,
    auditClassification,
    exportEligibility,
    contentVerification,
    exportVerification,
    deliveryVerification,
    exportEvidence: existingFinalization?.exportEvidence ?? null,
    blockingReasons,
  };
};

export const isFinalizedForSale = (finalizationState) =>
  finalizationState?.finalizationStatus === 'finalized' &&
  finalizationState?.auditClassification === 'finalized' &&
  finalizationState?.exportEligibility?.status === 'pass' &&
  finalizationState?.contentVerification?.status === 'pass' &&
  finalizationState?.exportVerification?.status === 'pass' &&
  finalizationState?.deliveryVerification?.status === 'pass';
