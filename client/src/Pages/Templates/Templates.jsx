import { createElement } from "react";
import {
  ArrowUpRight,
  BracketsCurly,
  ClipboardText,
  RocketLaunch,
} from "@phosphor-icons/react";

const templateCards = [
  {
    title: "Launch Brief",
    eyebrow: "Planning",
    description:
      "A focused product brief for shaping a build before the first agent session starts.",
    detail: "Scope, users, risks, acceptance checks",
    status: "Sample",
    Icon: ClipboardText,
  },
  {
    title: "MERN Feature Slice",
    eyebrow: "Implementation",
    description:
      "A practical feature scaffold for moving from route to API contract without losing review points.",
    detail: "React page, service hook, Express route",
    status: "Sample",
    Icon: BracketsCurly,
  },
  {
    title: "Release Readiness",
    eyebrow: "Shipping",
    description:
      "A final-pass checklist for verification, notes, deployment handoff, and follow-up work.",
    detail: "Diff audit, tests, known limits",
    status: "Sample",
    Icon: RocketLaunch,
  },
];

const Templates = () => {
  return (
    <main className="templates-page" aria-labelledby="templates-title">
      <style>{`
        .templates-page {
          min-height: 100dvh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 82% 12%, rgba(148, 255, 43, 0.12), transparent 25%),
            linear-gradient(180deg, #101113 0%, #09090b 58%, #0c0d0f 100%);
          color: #fafafa;
          padding: clamp(24px, 5vw, 48px) clamp(16px, 4vw, 32px) 76px;
        }

        .templates-shell {
          width: min(100%, 1240px);
          margin: 0 auto;
          display: grid;
          gap: clamp(24px, 5vw, 44px);
        }

        .templates-hero {
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(280px, 0.48fr);
          gap: clamp(22px, 6vw, 72px);
          align-items: end;
          padding-top: clamp(8px, 2vw, 18px);
        }

        .templates-kicker,
        .template-card__eyebrow,
        .template-card__status {
          margin: 0;
          color: #94ff2b;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .templates-hero h1 {
          max-width: 10ch;
          margin: 8px 0 0;
          font-size: clamp(3.25rem, 8vw, 6.25rem);
          line-height: 0.9;
          letter-spacing: -0.055em;
        }

        .templates-hero__copy {
          margin: 0;
          max-width: 43ch;
          color: #d4d4d8;
          font-size: clamp(1.05rem, 2vw, 1.25rem);
          line-height: 1.55;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
          gap: clamp(16px, 2.6vw, 24px);
          align-items: stretch;
        }

        .template-card {
          position: relative;
          display: grid;
          min-height: 320px;
          gap: 22px;
          align-content: space-between;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(24, 24, 27, 0.96), rgba(17, 17, 19, 0.98));
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
          padding: clamp(20px, 4vw, 30px);
          transition:
            transform 190ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 190ms ease,
            box-shadow 190ms ease;
        }

        .template-card:first-child {
          grid-row: span 2;
          min-height: 460px;
        }

        .template-card:hover {
          transform: translateY(-4px);
          border-color: rgba(148, 255, 43, 0.28);
          box-shadow: 0 32px 88px rgba(0, 0, 0, 0.34);
        }

        .template-card:focus-within {
          border-color: rgba(148, 255, 43, 0.46);
          box-shadow: 0 0 0 4px rgba(148, 255, 43, 0.12);
        }

        .template-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .template-card__icon {
          display: inline-flex;
          width: 52px;
          height: 52px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(148, 255, 43, 0.22);
          border-radius: 16px;
          background: rgba(148, 255, 43, 0.08);
          color: #c9ff8a;
        }

        .template-card__body {
          display: grid;
          gap: 14px;
        }

        .template-card h2 {
          margin: 0;
          color: #fafafa;
          font-size: clamp(1.75rem, 4vw, 3rem);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .template-card p {
          margin: 0;
          color: #a1a1aa;
          line-height: 1.6;
        }

        .template-card__detail {
          display: inline-flex;
          width: fit-content;
          max-width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.04);
          color: #e4e4e7;
          font-size: 0.86rem;
        }

        .template-card__action {
          display: inline-flex;
          width: fit-content;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid rgba(173, 255, 47, 0.46);
          border-radius: 12px;
          background: #adff2f;
          color: #09090b;
          padding: 10px 15px;
          font-weight: 800;
          text-decoration: none;
          transition:
            transform 180ms cubic-bezier(0.16, 1, 0.3, 1),
            background 180ms ease;
        }

        .template-card__action:hover {
          background: #94ff2b;
          transform: translateY(-2px);
        }

        .template-card__action:active {
          transform: translateY(1px) scale(0.99);
        }

        .template-card__action:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px rgba(148, 255, 43, 0.18);
        }

        .templates-note {
          margin: 0;
          max-width: 68ch;
          color: #a1a1aa;
          line-height: 1.65;
        }

        @media (max-width: 900px) {
          .templates-hero,
          .templates-grid {
            grid-template-columns: 1fr;
          }

          .templates-hero h1 {
            max-width: 12ch;
          }

          .template-card:first-child {
            grid-row: auto;
            min-height: 320px;
          }
        }

        @media (max-width: 620px) {
          .templates-page {
            padding: 22px 16px 56px;
          }

          .templates-shell {
            gap: 24px;
          }

          .templates-hero {
            gap: 18px;
          }

          .templates-hero h1 {
            font-size: clamp(3rem, 17vw, 4.35rem);
          }

          .template-card {
            min-height: 280px;
            border-radius: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .template-card,
          .template-card__action {
            transition: none;
          }

          .template-card:hover,
          .template-card__action:hover,
          .template-card__action:active {
            transform: none;
          }
        }
      `}</style>

      <div className="templates-shell">
        <section className="templates-hero">
          <div>
            <p className="templates-kicker">Template library</p>
            <h1 id="templates-title">Starter systems for cleaner builds.</h1>
          </div>
          <p className="templates-hero__copy">
            Sample placeholders for the upcoming template library: practical
            documents and code-starting guides for planning, building, and
            shipping with AI-assisted workflows.
          </p>
        </section>

        <section className="templates-grid" aria-label="Sample templates">
          {templateCards.map(
            ({ title, eyebrow, description, detail, status, Icon }) => (
              <article className="template-card" key={title}>
                <div className="template-card__top">
                  <span className="template-card__icon" aria-hidden="true">
                    {createElement(Icon, { size: 28, weight: "duotone" })}
                  </span>
                  <span className="template-card__status">{status}</span>
                </div>

                <div className="template-card__body">
                  <p className="template-card__eyebrow">{eyebrow}</p>
                  <h2>{title}</h2>
                  <p>{description}</p>
                  <span className="template-card__detail">{detail}</span>
                </div>

                <a className="template-card__action" href="/contact">
                  Request this template{" "}
                  <ArrowUpRight size={16} weight="bold" />
                </a>
              </article>
            ),
          )}
        </section>

        <p className="templates-note">
          These cards are placeholder content for previewing the page structure.
          Final template downloads, pricing, and filtering can be added when the
          template product details are ready.
        </p>
      </div>
    </main>
  );
};

export default Templates;
