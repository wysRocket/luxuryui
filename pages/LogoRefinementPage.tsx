import React from 'react';
import BrandLogo from '../components/BrandLogo';
import {
  LIVE_SHELL_BASELINE,
  LOGO_REFINEMENT_CONCEPTS,
  LOGO_REFINEMENT_CRITERIA,
  LogoScore,
} from '../data/logoRefinementConcepts';

const ScoreBar: React.FC<{ score: LogoScore }> = ({ score }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950/80">
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
        {score.label}
      </p>
      <p className="text-sm font-bold text-gray-900 dark:text-white">{score.score}/5</p>
    </div>
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
      <div
        className="h-full rounded-full bg-gray-950 transition-all duration-500 dark:bg-white"
        style={{ width: `${(score.score / 5) * 100}%` }}
      />
    </div>
    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{score.note}</p>
  </div>
);

const LogoRefinementPage: React.FC = () => {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-gray-100 bg-gradient-to-br from-stone-50 via-white to-gray-50 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:border-gray-800 dark:from-gray-950 dark:via-gray-950 dark:to-black md:p-10">
          <div className="flex flex-col gap-8 2xl:flex-row 2xl:items-end 2xl:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500">
                Brand Exploration
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-gray-950 dark:text-white md:text-6xl">
                LuxuryUI logo refinement set
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg">
                Three generated concept lanes, evaluated against the live-shell brand lockup and tuned for the
                actual touchpoints already in use: compact header mark, sidebar lockup, footer lockup, and
                small-size recall.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">
                  Scope
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  Concept boards and prompt sets only. Any winner still needs a clean repo-native SVG/React pass
                  before it replaces the live mark.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/80 bg-gray-950 p-5 shadow-sm dark:border-gray-700">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-500">Generation</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-200">
                  Built with the OpenAI image generation tool, then frozen into project assets for review inside
                  the live shell.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
          <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                  Baseline
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-gray-950 dark:text-white">
                  {LIVE_SHELL_BASELINE.name}
                </h2>
              </div>
              <span className="rounded-full border border-gray-200 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Shared `BrandLogo`
              </span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {LIVE_SHELL_BASELINE.summary}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-gray-100 bg-stone-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                  Light Shell
                </p>
                <div className="mt-6 flex flex-col gap-6">
                  <BrandLogo
                    className="flex items-center gap-3"
                    iconClassName="h-8 w-8"
                    textClassName="text-3xl tracking-[-0.07em] text-gray-950"
                  />
                  <div className="flex items-center gap-6">
                    <BrandLogo className="flex items-center" iconClassName="h-6 w-6" showWordmark={false} />
                    <BrandLogo className="flex items-center" iconClassName="h-8 w-8" showWordmark={false} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">24px / 32px</span>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] border border-gray-900 bg-gray-950 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Dark Shell</p>
                <div className="mt-6 flex flex-col gap-6">
                  <BrandLogo
                    className="flex items-center gap-3"
                    iconClassName="h-8 w-8 text-white"
                    textClassName="text-3xl tracking-[-0.07em] text-white"
                  />
                  <div className="flex items-center gap-6">
                    <BrandLogo className="flex items-center" iconClassName="h-6 w-6 text-white" showWordmark={false} />
                    <BrandLogo className="flex items-center" iconClassName="h-8 w-8 text-white" showWordmark={false} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">24px / 32px</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-dashed border-gray-200 bg-gray-50/80 p-5 dark:border-gray-700 dark:bg-gray-950/60">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Why this baseline matters</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {LIVE_SHELL_BASELINE.strengths.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {LIVE_SHELL_BASELINE.caution}
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              Review Criteria
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-gray-950 dark:text-white">
              What each concept had to prove
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {LOGO_REFINEMENT_CRITERIA.map((criterion) => (
                <div
                  key={criterion}
                  className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-950/70"
                >
                  <p className="text-sm font-semibold leading-relaxed text-gray-700 dark:text-gray-300">{criterion}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[28px] border border-black bg-black p-6 text-white dark:border-white dark:bg-white dark:text-black">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 dark:text-black/50">
                Reading The Set
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/80 dark:text-black/70">
                `Facet One Refined` is the continuity route, `Architectural Monogram` is the most ownable symbol
                route, and `Gallery Sigil` is the strongest pure luxury-tone route. The best next move is likely a
                short second round between the continuity and luxury-tone extremes.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6">
          {LOGO_REFINEMENT_CONCEPTS.map((concept) => (
            <article
              key={concept.id}
              className="overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="grid gap-0 xl:grid-cols-[1.05fr_1fr]">
                <div className="border-b border-gray-100 bg-stone-50 p-4 dark:border-gray-800 dark:bg-gray-950 xl:border-b-0 xl:border-r">
                  <img
                    src={concept.boardSrc}
                    alt={`${concept.title} concept board`}
                    className="w-full rounded-[24px] border border-gray-200 bg-white object-cover shadow-sm dark:border-gray-800"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">
                        {concept.shortLabel}
                      </p>
                      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-gray-950 dark:text-white">
                        {concept.title}
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                        {concept.summary}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        {concept.positioning}
                      </p>
                    </div>
                    <span className="rounded-full border border-gray-200 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      Generated board
                    </span>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {concept.scores.map((score) => (
                      <ScoreBar key={score.label} score={score} />
                    ))}
                  </div>

                  <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-950/60">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                        Strengths
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {concept.strengths.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-950/60">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                        Watchouts
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {concept.watchouts.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 rounded-[28px] border border-gray-200 bg-black p-5 text-white dark:border-gray-700 dark:bg-gray-950">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">
                      Recommendation
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-white/80">{concept.recommendation}</p>
                  </div>

                  <div className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[28px] border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950/60">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                        Prompt Set
                      </p>
                      <pre className="mt-4 overflow-x-auto rounded-2xl bg-gray-950 p-4 text-xs leading-relaxed text-gray-100">
                        <code>{concept.promptSet.boardPrompt}</code>
                      </pre>
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-950/60">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                          Deliverables
                        </p>
                        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {concept.promptSet.deliverables.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-950/60">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                          Constraints
                        </p>
                        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {concept.promptSet.constraints.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-950/60">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                          Next Iteration
                        </p>
                        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {concept.promptSet.nextIterationPrompts.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default LogoRefinementPage;
