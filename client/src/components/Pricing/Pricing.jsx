import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./pricing.styles.scss";
import { baseUrl } from "../../constants/constants";
import { Check, ShieldCheck, ChatCircleText, Headset, Users } from "@phosphor-icons/react";
import Newsletter from "../Newsletter/Newsletter";
import HomeFAQ from "../HomeFAQ/HomeFAQ";

const spring = { type: "spring", stiffness: 100, damping: 20 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...spring, duration: 0.6 },
  },
};

const Pricing = () => {
  const [pricing, setPricing] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    let alive = true;

    const loadPricing = async () => {
      try {
        setStatus({ loading: true, error: "" });
        const API_URL = `${baseUrl}/api/pricing`;

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

  const headerTitle = "Choose the support level that matches the build";
  const headerSubtitle =
    pricing?.program?.subtitle ||
    "Pick the amount of review, accountability, and implementation support you need to move from plan to shipped MERN application.";

  const renderCard = (plan, isFeatured = false) => {
    const priceLabel = plan?.pricing?.label || "";
    const cadenceLabel = plan?.pricing?.cadenceLabel
      ? `/ ${plan.pricing.cadenceLabel}`
      : "";
    const features = Array.isArray(plan?.includes) ? plan.includes : [];

    const ctaLabel = plan?.cta?.label || "Get Started";
    const ctaRoute = plan?.cta?.route || "/contact";

    const cardClass = [
      "pricing-card",
      isFeatured ? "is-featured" : "",
      plan.isDisabled ? "is-disabled" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const buttonClass = [
      "card-button",
      isFeatured ? "btn-highlight" : "btn-outline",
      plan.isDisabled ? "is-disabled" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const whoItsFor = Array.isArray(plan?.whoItsFor) ? plan.whoItsFor : [];
    const support = plan?.accountability?.support || {};
    const reviewSla = plan?.accountability?.reviewSlaHours;

    const supportBadges = [
      support.oneToOne && { icon: Headset, label: "1-on-1 Support" },
      support.priorityChat && { icon: ChatCircleText, label: "Priority Chat" },
      support.community && { icon: Users, label: "Community Access" },
    ].filter(Boolean);

    return (
      <motion.div
        key={plan.id || plan.slug}
        className={cardClass}
        variants={cardVariants}
      >
        {isFeatured && (
          <span className="featured-badge">MOST POPULAR</span>
        )}

        <div className="card-top">
          <h3 className="card-title">{plan.title}</h3>

          <div className="card-price">
            {priceLabel} <span className="duration">{cadenceLabel}</span>
          </div>

          <p className="card-description">
            {plan.summary || plan.tagline || ""}
          </p>
        </div>

        <ul className="card-features">
          {features.map((feature, i) => (
            <li key={`${plan.slug || plan.id}-f-${i}`}>
              <Check
                size={14}
                weight="bold"
                className="check-icon"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>

        {whoItsFor.length > 0 && (
          <div className="card-who">
            <p className="card-who__label">Who it's for</p>
            <ul className="card-who__list">
              {whoItsFor.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {isFeatured && (supportBadges.length > 0 || reviewSla) && (
          <div className="card-support-row">
            {supportBadges.map(({ icon: Icon, label }) => (
              <span key={label} className="support-badge">
                <Icon size={13} weight="duotone" aria-hidden="true" />
                {label}
              </span>
            ))}
            {reviewSla && (
              <span className="support-badge">
                <Check size={13} weight="bold" aria-hidden="true" />
                {reviewSla}-hour review SLA
              </span>
            )}
          </div>
        )}

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
      </motion.div>
    );
  };

  return (
    <section id="pricing" className="pricing-section">
      <motion.div
        className="pricing-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ...spring, duration: 0.6 }}
      >
        <span className="pricing-eyebrow">Pricing</span>
        <h2 className="pricing-main-title">{headerTitle}</h2>
        <p className="pricing-subtitle">{headerSubtitle}</p>

        {pricing?.program?.guarantee?.title && pricing?.ui?.showGuarantee && (
          <div className="pricing-guarantee">
            <ShieldCheck size={18} weight="duotone" className="guarantee-icon" />
            <div className="pricing-guarantee__content">
              <span className="pricing-guarantee__label">
                {pricing.program.guarantee.title}
              </span>
              {pricing.program.guarantee.details && (
                <span className="pricing-guarantee__text">
                  {pricing.program.guarantee.details}
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {status.loading && (
        <div className="pricing-state">
          <div className="pricing-skeleton-grid">
            {[0, 1].map((i) => (
              <div key={i} className="pricing-skeleton-card">
                <div className="skel-line skel-title" />
                <div className="skel-line skel-price" />
                <div className="skel-line skel-desc" />
                <div className="skel-line skel-feat" />
                <div className="skel-line skel-feat" />
                <div className="skel-line skel-feat" />
                <div className="skel-line skel-btn" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!status.loading && status.error && (
        <div className="pricing-state pricing-state--error">
          <p className="pricing-error-title">Could not load pricing.</p>
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
        <motion.div
          className="pricing-layout"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {plans.map((plan) => renderCard(plan, plan.isPopular))}
        </motion.div>
      )}

      <Newsletter />
      <HomeFAQ />
    </section>
  );
};

export default Pricing;
