import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./pricing.styles.scss";
import { baseUrl } from "../../constants/constants";

const Pricing = () => {
  const [pricing, setPricing] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    let alive = true;

    const loadPricing = async () => {
      try {
        setStatus({ loading: true, error: "" });
        const API_URL = `${baseUrl}/api/pricing`;
        console.log(API_URL);
        const res = await fetch(API_URL, {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `Failed to load pricing (${res.status}). ${text || ""}`.trim(),
          );
        }

        const data = await res.json();
        if (!alive) return;

        setPricing(data);
        setStatus({ loading: false, error: "" });
      } catch (err) {
        if (!alive) return;
        setPricing(null);
        setStatus({
          loading: false,
          error: err?.message || "Failed to load pricing.",
        });
      }
    };

    loadPricing();

    return () => {
      alive = false;
    };
  }, []);

  const plans = useMemo(() => {
    if (!pricing?.plans?.length) return [];

    const order = pricing?.ui?.planOrder || [];
    const featuredSlug = pricing?.ui?.defaultFeaturedPlanSlug || "";

    const list = [...pricing.plans];

    // stable sort based on server-provided order
    if (order.length) {
      list.sort((a, b) => {
        const ai = order.indexOf(a.slug);
        const bi = order.indexOf(b.slug);
        const aIdx = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
        const bIdx = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
        return aIdx - bIdx;
      });
    }

    return list.map((p) => ({
      ...p,
      isPopular:
        p?.badge?.toLowerCase?.() === "most popular" ||
        p?.slug === featuredSlug,
      isDisabled: p?.availability?.isActive === false,
    }));
  }, [pricing]);

  const headerTitle = pricing?.program?.name ? "Pricing" : "Pricing";
  const headerSubtitle =
    pricing?.program?.subtitle ||
    "Pick your accountability level. Ship production-ready apps in 6 months.";

  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h2 className="pricing-main-title">{headerTitle}</h2>
        <p className="pricing-subtitle">{headerSubtitle}</p>

        {pricing?.program?.guarantee?.title && pricing?.ui?.showGuarantee && (
          <div className="pricing-guarantee">
            <span className="pricing-guarantee__label">
              {pricing.program.guarantee.title}
            </span>
            {pricing.program.guarantee.details && (
              <span className="pricing-guarantee__text">
                {pricing.program.guarantee.details}
              </span>
            )}
          </div>
        )}
      </div>

      {status.loading && (
        <div className="pricing-state">
          <div className="pricing-spinner" aria-hidden="true" />
          <p>Loading plans…</p>
        </div>
      )}

      {!status.loading && status.error && (
        <div className="pricing-state pricing-state--error">
          <p className="pricing-error-title">Couldn’t load pricing.</p>
          <p className="pricing-error-text">{status.error}</p>
          <button
            type="button"
            className="pricing-retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {!status.loading && !status.error && (
        <div className="pricing-grid">
          {plans.map((plan) => {
            const priceLabel = plan?.pricing?.label || "";
            const cadenceLabel = plan?.pricing?.cadenceLabel
              ? `/ ${plan.pricing.cadenceLabel}`
              : "";
            const features = Array.isArray(plan?.includes) ? plan.includes : [];
            const ctaRoute = plan?.cta?.route || "/join";
            const ctaLabel = plan?.cta?.label || "Get Started";

            const cardClass = [
              "pricing-card",
              plan.isPopular ? "is-popular" : "",
              plan.isDisabled ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const buttonClass = [
              "card-button",
              plan.isPopular ? "btn-highlight" : "btn-outline",
              plan.isDisabled ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div key={plan.id || plan.slug} className={cardClass}>
                {plan.isPopular && (
                  <span className="popular-badge">MOST POPULAR</span>
                )}

                <div className="card-top">
                  <h3 className="card-title">{plan.title}</h3>

                  <div className="card-price">
                    {priceLabel}{" "}
                    <span className="duration">{cadenceLabel}</span>
                  </div>

                  <p className="card-description">
                    {plan.summary || plan.tagline || ""}
                  </p>
                </div>

                <ul className="card-features">
                  {features.map((feature, i) => (
                    <li key={`${plan.slug || plan.id}-f-${i}`}>{feature}</li>
                  ))}
                </ul>

                {plan.isDisabled ? (
                  <button type="button" className={buttonClass} disabled>
                    Not Available
                  </button>
                ) : (
                  <Link to={ctaRoute} className={buttonClass}>
                    {ctaLabel}
                  </Link>
                )}

                {plan?.availability?.note && (
                  <p className="card-note">{plan.availability.note}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Pricing;
