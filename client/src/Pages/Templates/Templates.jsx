import { createElement } from "react";
import {
  ArrowUpRight,
  BracketsCurly,
  ClipboardText,
  RocketLaunch,
} from "@phosphor-icons/react";
import useTemplates from "../../hooks/queries/useTemplates";
import { getTemplatesErrorMessage } from "../../services/templateService";

const templateIcons = [ClipboardText, BracketsCurly, RocketLaunch];

const getTemplateIcon = (index) => templateIcons[index % templateIcons.length];

const getTemplateTitle = (title, index) => title || `Template ${index + 1}`;

const Templates = () => {
  const { data: templates = [], error, isError, isLoading } = useTemplates();

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
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .template-card__tag {
          display: inline-flex;
          max-width: 100%;
          overflow-wrap: anywhere;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.04);
          color: #e4e4e7;
          font-size: 0.86rem;
        }

        .template-card__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
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

        .template-card__action--secondary {
          background: transparent;
          color: #fafafa;
          border-color: rgba(255, 255, 255, 0.14);
        }

        .template-card__action--secondary:hover {
          background: rgba(255, 255, 255, 0.08);
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

        .templates-visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
        }

        .templates-state {
          display: grid;
          min-height: 280px;
          align-content: center;
          gap: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          background: rgba(17, 17, 19, 0.78);
          padding: clamp(22px, 4vw, 34px);
        }

        .templates-state h2 {
          margin: 0;
          color: #fafafa;
          font-size: clamp(1.7rem, 4vw, 2.6rem);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .templates-state p {
          margin: 0;
          max-width: 52ch;
          color: #a1a1aa;
          line-height: 1.65;
        }

        .templates-state--error {
          border-color: rgba(255, 116, 116, 0.28);
        }

        .template-card--loading {
          pointer-events: none;
        }

        .template-skeleton {
          position: relative;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
        }

        .template-skeleton::after {
          position: absolute;
          inset: 0;
          content: "";
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
          animation: template-shimmer 1.4s infinite;
        }

        .template-skeleton--icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
        }

        .template-skeleton--status {
          width: 76px;
          height: 14px;
        }

        .template-skeleton--eyebrow {
          width: 112px;
          height: 12px;
        }

        .template-skeleton--title {
          width: min(100%, 340px);
          height: 54px;
          border-radius: 18px;
        }

        .template-skeleton--copy {
          width: min(100%, 440px);
          height: 18px;
        }

        .template-skeleton--copy-short {
          width: min(72%, 310px);
        }

        .template-skeleton--button {
          width: 174px;
          height: 46px;
          border-radius: 12px;
        }

        @keyframes template-shimmer {
          100% {
            transform: translateX(100%);
          }
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
          .template-card__action,
          .template-skeleton::after {
            transition: none;
            animation: none;
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
            Practical documents and code-starting guides for planning,
            building, and shipping with AI-assisted workflows.
          </p>
        </section>

        {isLoading ? (
          <section
            className="templates-grid"
            aria-label="Loading templates"
            aria-busy="true"
            aria-live="polite"
          >
            <span className="templates-visually-hidden">
              Loading templates.
            </span>
            {[0, 1, 2].map((item) => (
              <article
                className="template-card template-card--loading"
                key={item}
              >
                <div className="template-card__top">
                  <span className="template-skeleton template-skeleton--icon" />
                  <span className="template-skeleton template-skeleton--status" />
                </div>

                <div className="template-card__body">
                  <span className="template-skeleton template-skeleton--eyebrow" />
                  <span className="template-skeleton template-skeleton--title" />
                  <span className="template-skeleton template-skeleton--copy" />
                  <span className="template-skeleton template-skeleton--copy template-skeleton--copy-short" />
                </div>

                <span className="template-skeleton template-skeleton--button" />
              </article>
            ))}
          </section>
        ) : isError ? (
          <section
            className="templates-state templates-state--error"
            aria-live="polite"
          >
            <p className="templates-kicker">Template library</p>
            <h2>Templates are unavailable.</h2>
            <p>{getTemplatesErrorMessage(error)}</p>
          </section>
        ) : templates.length === 0 ? (
          <section className="templates-state" aria-live="polite">
            <p className="templates-kicker">Template library</p>
            <h2>No templates are listed yet.</h2>
            <p>
              New template systems will appear here when the library is ready.
            </p>
          </section>
        ) : (
          <section className="templates-grid" aria-label="Available templates">
            {templates.map(
              (
                {
                  id,
                  title,
                  description,
                  category,
                  tags,
                  githubUrl,
                  templateUrl,
                  releaseUrl,
                },
                index
              ) => {
                const Icon = getTemplateIcon(index);
                const templateTitle = getTemplateTitle(title, index);
                const visibleTags = Array.isArray(tags) ? tags : [];

                return (
                  <article className="template-card" key={id || templateTitle}>
                    <div className="template-card__top">
                      <span className="template-card__icon" aria-hidden="true">
                        {createElement(Icon, { size: 28, weight: "duotone" })}
                      </span>
                      <span className="template-card__status">Available</span>
                    </div>

                    <div className="template-card__body">
                      <p className="template-card__eyebrow">
                        {category || "Template"}
                      </p>
                      <h2>{templateTitle}</h2>
                      <p>
                        {description || "Template details are coming soon."}
                      </p>

                      {visibleTags.length > 0 && (
                        <ul
                          className="template-card__detail"
                          aria-label={`${templateTitle} tags`}
                        >
                          {visibleTags.map((tag) => (
                            <li className="template-card__tag" key={tag}>
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="template-card__actions">
                      {templateUrl ? (
                        <a
                          className="template-card__action"
                          href={templateUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Use Template <ArrowUpRight size={16} weight="bold" />
                        </a>
                      ) : (
                        <a className="template-card__action" href="/contact">
                          Request this template{" "}
                          <ArrowUpRight size={16} weight="bold" />
                        </a>
                      )}

                      {githubUrl && (
                        <a
                          className="template-card__action template-card__action--secondary"
                          href={githubUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          GitHub <ArrowUpRight size={16} weight="bold" />
                        </a>
                      )}

                      {releaseUrl && (
                        <a
                          className="template-card__action template-card__action--secondary"
                          href={releaseUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download <ArrowUpRight size={16} weight="bold" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </section>
        )}

        <p className="templates-note">
          Templates are loaded from the library endpoint so the catalog can
          change without rewriting the page. Downloads, pricing, and filtering
          can be added when the template product details are ready.
        </p>
      </div>
    </main>
  );
};

export default Templates;
