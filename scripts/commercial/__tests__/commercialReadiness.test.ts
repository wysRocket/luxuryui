import { describe, expect, it } from 'vitest';
import { collectCommercialReadinessFindings } from '../validate-commercial-readiness.mjs';

const product = {
  id: 'figma-kit:monzo',
  slug: 'monzo-figma-kit',
  status: 'published',
  creditCost: 12,
  thumbnail: 'https://example.com/thumbnail.png',
  gallery: ['https://example.com/gallery.png'],
  purchasePath: '/pricing',
};

const review = {
  productId: 'figma-kit:monzo',
  reviewStatus: 'approved',
  readyForSale: true,
  publishQualityStatus: 'pass',
  publishReadyForSale: true,
};

const spec = {
  productId: 'figma-kit:monzo',
};

const buildManifest = (finalAssetUrl = 'https://www.figma.com/file/figma-file-123/Monzo') => ({
  productId: 'figma-kit:monzo',
  generatedArtifacts: {
    commercialReady: true,
    publishQualityStatus: 'pass',
    publishReadyForSale: true,
    finalAssetUrl,
  },
});

const buildFinalization = ({
  finalizationStatus = 'finalized',
  auditClassification = 'finalized',
  deliveryStatus = 'pass',
  finalAssetUrl = 'https://www.figma.com/file/figma-file-123/Monzo',
} = {}) => ({
  finalizationStatus,
  auditClassification,
  exportEvidence: {
    finalAssetUrl,
  },
  deliveryVerification: {
    status: deliveryStatus,
  },
});

const collectFindings = ({
  manifest = buildManifest(),
  finalization = buildFinalization(),
} = {}) =>
  collectCommercialReadinessFindings({
    productsDoc: { products: [product] },
    reviewsDoc: { reviews: [review] },
    specsDoc: { kitSpecs: [spec] },
    manifestsDoc: { manifests: [manifest] },
    finalizationsBySlug: new Map([['monzo-figma-kit', finalization]]),
  });

describe('commercial readiness finalization checks', () => {
  it('fails a published kit with non-finalized finalization evidence', () => {
    const findings = collectFindings({
      finalization: buildFinalization({
        finalizationStatus: 'content_verified',
        auditClassification: 'repairable',
      }),
    });

    expect(findings).toContainEqual({
      status: 'FAIL',
      message: 'monzo-figma-kit is published without finalized commercial finalization evidence',
    });
  });

  it('passes a finalized published kit with delivery-ready finalization evidence', () => {
    expect(collectFindings()).toEqual([]);
  });

  it('fails finalized evidence that is not delivery verified', () => {
    const findings = collectFindings({
      finalization: buildFinalization({ deliveryStatus: 'fail' }),
    });

    expect(findings).toContainEqual({
      status: 'FAIL',
      message: 'monzo-figma-kit is published without delivery-ready finalization evidence',
    });
  });

  it('fails when manifest and finalization final asset URLs disagree', () => {
    const findings = collectFindings({
      finalization: buildFinalization({
        finalAssetUrl: 'https://www.figma.com/file/figma-file-456/Monzo',
      }),
    });

    expect(findings).toContainEqual({
      status: 'FAIL',
      message: 'monzo-figma-kit has conflicting final asset URLs between manifest and finalization evidence',
    });
  });

  it('fails when manifest final asset URL is missing', () => {
    const findings = collectFindings({
      manifest: buildManifest(null),
    });

    expect(findings).toContainEqual({
      status: 'FAIL',
      message: 'monzo-figma-kit manifest is missing final asset URL',
    });
  });

  it('fails when finalization evidence final asset URL is missing', () => {
    const findings = collectFindings({
      finalization: buildFinalization({ finalAssetUrl: null }),
    });

    expect(findings).toContainEqual({
      status: 'FAIL',
      message: 'monzo-figma-kit finalization evidence is missing final asset URL',
    });
  });

  it('fails when neither manifest nor finalization provides a final asset URL', () => {
    const findings = collectFindings({
      manifest: buildManifest(null),
      finalization: buildFinalization({ finalAssetUrl: null }),
    });

    expect(findings).toContainEqual({
      status: 'FAIL',
      message: 'monzo-figma-kit manifest is missing final asset URL',
    });
    expect(findings).toContainEqual({
      status: 'FAIL',
      message: 'monzo-figma-kit finalization evidence is missing final asset URL',
    });
  });
});
