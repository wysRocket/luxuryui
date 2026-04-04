import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const productsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'figma-kit-products.json');
const reviewsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'commercial-reviews.json');
const specsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'figma-kit-specs.json');
const manifestsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'figma-content-manifests.json');

export const checkCommercialReadiness = async () => {
  const [productsDoc, reviewsDoc, specsDoc, manifestsDoc] = await Promise.all([
    readFile(productsPath, 'utf8').then((raw) => JSON.parse(raw)),
    readFile(reviewsPath, 'utf8').then((raw) => JSON.parse(raw)),
    readFile(specsPath, 'utf8').then((raw) => JSON.parse(raw)),
    readFile(manifestsPath, 'utf8').then((raw) => JSON.parse(raw)),
  ]);

  const reviewById = new Map(reviewsDoc.reviews.map((review) => [review.productId, review]));
  const specById = new Map(specsDoc.kitSpecs.map((spec) => [spec.productId, spec]));
  const manifestById = new Map(manifestsDoc.manifests.map((manifest) => [manifest.productId, manifest]));

  const findings = [];

  for (const product of productsDoc.products) {
    const review = reviewById.get(product.id);
    const spec = specById.get(product.id);
    const manifest = manifestById.get(product.id);

    if (!review) {
      findings.push({ status: 'FAIL', message: `${product.slug} is missing a commercial review` });
      continue;
    }

    if (!spec) {
      findings.push({ status: 'FAIL', message: `${product.slug} is missing a kit spec` });
    }

    if (!manifest) {
      findings.push({ status: 'FAIL', message: `${product.slug} is missing a content manifest` });
    }

    if (product.status === 'published') {
      if (
        review.reviewStatus !== 'approved' ||
        !review.readyForSale ||
        review.publishQualityStatus === 'fail' ||
        review.publishReadyForSale !== true
      ) {
        findings.push({ status: 'FAIL', message: `${product.slug} is published without an approved commercial review` });
      }

      if (!Number.isFinite(product.creditCost) || product.creditCost <= 0) {
        findings.push({ status: 'FAIL', message: `${product.slug} is published without a valid credit cost` });
      }

      if ('price' in product) {
        findings.push({ status: 'FAIL', message: `${product.slug} still exposes legacy price fields` });
      }

      if (!product.figmaFileKey && !manifest?.generatedArtifacts?.commercialReady) {
        findings.push({ status: 'FAIL', message: `${product.slug} is published without a figma file key` });
      }

      if (
        manifest?.generatedArtifacts?.publishQualityStatus === 'fail' ||
        manifest?.generatedArtifacts?.publishReadyForSale !== true
      ) {
        findings.push({ status: 'FAIL', message: `${product.slug} is published without publish-quality approved generated artifacts` });
      }

      if (!product.thumbnail || product.gallery.length === 0) {
        findings.push({ status: 'FAIL', message: `${product.slug} is published without storefront previews` });
      }

      if (product.purchasePath !== '/pricing') {
        findings.push({ status: 'FAIL', message: `${product.slug} does not point to the credits top-up flow` });
      }
    }
  }

  return {
    summary: {
      totalProducts: productsDoc.products.length,
      publishedProducts: productsDoc.products.filter((product) => product.status === 'published').length,
      findings: findings.length,
    },
    findings,
  };
};

const run = async () => {
  const result = await checkCommercialReadiness();

  console.log('Commercial readiness check\n');
  console.log(`Published products: ${result.summary.publishedProducts}/${result.summary.totalProducts}`);

  if (result.findings.length === 0) {
    console.log('✓ All published Figma kits have specs, manifests, approved commercial reviews, and valid credit pricing.');
    return;
  }

  for (const finding of result.findings) {
    console.log(`✗ ${finding.message}`);
  }

  process.exit(1);
};

const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
