export interface LogoScore {
  label: string;
  score: number;
  note: string;
}

export interface LogoPromptSet {
  boardPrompt: string;
  deliverables: string[];
  constraints: string[];
  nextIterationPrompts: string[];
}

export interface LogoRefinementConcept {
  id: string;
  title: string;
  shortLabel: string;
  boardSrc: string;
  summary: string;
  positioning: string;
  recommendation: string;
  strengths: string[];
  watchouts: string[];
  scores: LogoScore[];
  promptSet: LogoPromptSet;
}

export const LOGO_REFINEMENT_CRITERIA = [
  'Recognizability at 24px and 32px',
  'Elegance beside the current UI typography',
  'Consistency with the black-and-white luxury tone',
  'Distinctiveness from generic sparkle-startup marks',
] as const;

export const LOGO_REFINEMENT_CONCEPTS: LogoRefinementConcept[] = [
  {
    id: 'facet-one-refined',
    title: 'Facet One Refined',
    shortLabel: 'Direction 1',
    boardSrc: '/assets/brand/logo-refinements/facet-one-refined-board.png',
    summary:
      'A sharper continuation of the live-shell mark: more architectural than decorative, with a cleaner silhouette and fewer micro-facets.',
    positioning:
      'Best continuity option if LuxuryUI wants to preserve the existing brand memory while making the symbol feel more premium and more legible at compact sizes.',
    recommendation:
      'Advance if continuity matters most and the brand should evolve without a sudden identity break.',
    strengths: [
      'Strongest continuity with the current shared `BrandLogo` component.',
      'Most recognizable at compact sizes because the outer silhouette stays simple.',
      'Works well as a symbol-only favicon or app icon without requiring the wordmark.',
    ],
    watchouts: [
      'Can still read as a refined sparkle if pushed too hard toward symmetry and sharp points.',
      'Needs careful final SVG tuning to avoid feeling too close to the current draft.',
      'Carries less editorial uniqueness than the monogram and sigil routes.',
    ],
    scores: [
      {
        label: 'Recognizability',
        score: 5,
        note: 'The silhouette stays readable at 24px and 32px.',
      },
      {
        label: 'Elegance',
        score: 4,
        note: 'Premium and restrained, though still more energetic than the other routes.',
      },
      {
        label: 'Tone Fit',
        score: 4,
        note: 'Luxurious and monochrome, but still slightly closer to a startup symbol family.',
      },
      {
        label: 'Distinctiveness',
        score: 4,
        note: 'Cleaner than a generic sparkle, though not as ownable as the other two.',
      },
    ],
    promptSet: {
      boardPrompt:
        "Create a polished concept board for LuxuryUI direction 'Facet One Refined' showing one refined geometric symbol and one horizontal lockup reading EXACTLY 'LuxuryUI'. Include symbol on white, symbol on black, lockup on white, lockup on black, plus a small-size legibility row at 24px and 32px. Visual direction: modern luxury, monochrome-first, editorial restraint, stronger silhouette, fewer tiny facets, flat vector-friendly shapes, no gradients, no embossing, no mockup lighting.",
      deliverables: [
        'Full horizontal lockup reading `LuxuryUI`.',
        'Symbol-only app/icon version.',
        'Monochrome application on white.',
        'Monochrome inversion on black.',
        'Legibility check row at 24px and 32px.',
      ],
      constraints: [
        'Avoid tiny facet detail that disappears in the header and sidebar.',
        'Keep the mark flat, crisp, and vector-friendly.',
        'Reject decorative luxury clichés like gold gradients or beveled effects.',
      ],
      nextIterationPrompts: [
        'Reduce the inner negative space and make the center diamond feel more intentional.',
        'Test a version with slightly shortened side arms for an even stronger 24px silhouette.',
      ],
    },
  },
  {
    id: 'architectural-monogram',
    title: 'Architectural Monogram',
    shortLabel: 'Direction 2',
    boardSrc: '/assets/brand/logo-refinements/architectural-monogram-board.png',
    summary:
      'A structural `L`/`U` monogram that feels editorial, confident, and more ownable than a generic symbol-led mark.',
    positioning:
      'Best distinctiveness option if LuxuryUI wants a more brandable signature that can scale into editorial packaging, social avatars, and product chrome.',
    recommendation:
      'Advance if the goal is a more ownable symbol while staying modern, minimal, and highly usable in monochrome.',
    strengths: [
      'Most explicit relationship to the `LuxuryUI` name without spelling the whole wordmark twice.',
      'Feels more ownable than a generic sparkle and sits naturally in premium product contexts.',
      'Reads clearly on both white and black backgrounds with strong compact-size performance.',
    ],
    watchouts: [
      'Could feel a bit corporate if the final geometry becomes too rigid or literal.',
      'Needs careful spacing in the final SVG so the `U` does not visually collapse at small sizes.',
      'Requires a more deliberate wordmark pairing than the other two routes.',
    ],
    scores: [
      {
        label: 'Recognizability',
        score: 4,
        note: 'Clear at small sizes, though the inner join needs precise final spacing.',
      },
      {
        label: 'Elegance',
        score: 5,
        note: 'The editorial geometry pairs naturally with the current product shell.',
      },
      {
        label: 'Tone Fit',
        score: 4,
        note: 'Premium and calm, though a little more structural than collectible.',
      },
      {
        label: 'Distinctiveness',
        score: 5,
        note: 'Most brand-ownable route of the three generated directions.',
      },
    ],
    promptSet: {
      boardPrompt:
        "Create a polished concept board for LuxuryUI direction 'Architectural Monogram' showing one refined geometric symbol derived from the letters L and U and one horizontal lockup reading EXACTLY 'LuxuryUI'. Include symbol on white, symbol on black, lockup on white, lockup on black, plus a small-size legibility row at 24px and 32px. Visual direction: modern luxury, monochrome-first, editorial restraint, architectural precision, flat vector-friendly logo exploration, no gradients, no embossing, no mockup lighting.",
      deliverables: [
        'Full horizontal lockup reading `LuxuryUI`.',
        'Standalone `L`/`U` derived symbol for icon use.',
        'Monochrome application on white.',
        'Monochrome inversion on black.',
        'Legibility check row at 24px and 32px.',
      ],
      constraints: [
        'Avoid thin hairlines or overly literal letter construction.',
        'Keep the symbol balanced between monogram logic and abstract brand form.',
        'Do not drift into art-deco ornament or corporate SaaS stiffness.',
      ],
      nextIterationPrompts: [
        'Tighten the left stem and reduce the visual weight gap between the L and the U.',
        'Test a softer inside curve so the symbol feels less corporate and more collectible.',
      ],
    },
  },
  {
    id: 'gallery-sigil',
    title: 'Gallery Sigil',
    shortLabel: 'Direction 3',
    boardSrc: '/assets/brand/logo-refinements/gallery-sigil-board.png',
    summary:
      'A calmer emblem with a vertical, seal-like posture that feels more collectible and gallery-grade than a conventional tech identity.',
    positioning:
      'Best tone option if LuxuryUI wants the brand to feel premium, editorial, and slightly mysterious without leaning on obvious luxury clichés.',
    recommendation:
      'Advance if the goal is a calmer, more collectible identity with the strongest luxury tone of the three directions.',
    strengths: [
      'Most distinctive premium tone of the concept set.',
      'Feels comfortable beside black-and-white editorial layouts and refined UI surfaces.',
      'Creates a memorable silhouette that is less trend-driven than a sparkle or straightforward monogram.',
    ],
    watchouts: [
      'The inner linework needs disciplined SVG simplification before production use.',
      'Slightly less immediate than the faceted route at the very smallest sizes.',
      'Could feel too ornamental if the final line weight is not tightly controlled.',
    ],
    scores: [
      {
        label: 'Recognizability',
        score: 4,
        note: 'Readable, but the interior curves need simplification in the final vector pass.',
      },
      {
        label: 'Elegance',
        score: 5,
        note: 'The most editorial and collectible expression in the set.',
      },
      {
        label: 'Tone Fit',
        score: 5,
        note: 'Strongest alignment with a restrained modern-luxury brand tone.',
      },
      {
        label: 'Distinctiveness',
        score: 5,
        note: 'Ownable and less likely to blur into commodity UI-library branding.',
      },
    ],
    promptSet: {
      boardPrompt:
        "Create a polished concept board for LuxuryUI direction 'Gallery Sigil' showing one calm iconic emblem and one horizontal lockup reading EXACTLY 'LuxuryUI'. Include symbol on white, symbol on black, lockup on white, lockup on black, plus a small-size legibility row at 24px and 32px. Visual direction: modern luxury, monochrome-first, gallery-grade restraint, collectible editorial minimalism, flat vector-friendly identity exploration, no gradients, no embossing, no mockup lighting.",
      deliverables: [
        'Full horizontal lockup reading `LuxuryUI`.',
        'Symbol-only sigil for icon and favicon usage.',
        'Monochrome application on white.',
        'Monochrome inversion on black.',
        'Legibility check row at 24px and 32px.',
      ],
      constraints: [
        'Keep the emblem calm and iconic rather than ornate or heraldic.',
        'Avoid hairline detail that disappears in the live shell.',
        'Preserve a flat, crisp, vector-friendly presentation.',
      ],
      nextIterationPrompts: [
        'Simplify the internal curves into fewer strokes while preserving the vertical seal silhouette.',
        'Test a slightly narrower version to improve compact-size recall in the sidebar and header.',
      ],
    },
  },
];

export const LIVE_SHELL_BASELINE = {
  name: 'Current Live Shell',
  summary:
    'The existing `BrandLogo` component is a monochrome faceted spark paired with a bold LuxuryUI wordmark. It already works in the header, sidebar, and footer and acts as the continuity baseline for this review.',
  strengths: [
    'Already integrated across shared brand touchpoints.',
    'Strong contrast in light and dark mode.',
    'Simple enough to compare against new concept boards directly in the shell.',
  ],
  caution:
    'The current mark is still a first draft, so the main question is whether LuxuryUI should refine it or pivot to a more ownable symbol family.',
};
