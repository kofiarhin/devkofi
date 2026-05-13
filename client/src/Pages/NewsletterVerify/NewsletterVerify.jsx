import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, WarningCircle, Hourglass } from "@phosphor-icons/react";
import useVerifyNewsletter from "../../hooks/queries/useVerifyNewsletter";
import "./newsletter-verify.styles.scss";

const STATE_CONFIG = {
  verified: {
    role: "status",
    icon: CheckCircle,
    iconWeight: "fill",
    iconClass: "newsletter-verify__icon is-success",
    headline: "You're confirmed.",
    body: "Thanks for confirming your email. You'll start receiving the DevKofi newsletter from the next send.",
  },
  already_verified: {
    role: "status",
    icon: CheckCircle,
    iconWeight: "fill",
    iconClass: "newsletter-verify__icon is-success",
    headline: "Already confirmed.",
    body: "Your email is already on the list. Nothing else to do.",
  },
  expired: {
    role: "alert",
    icon: Hourglass,
    iconWeight: "regular",
    iconClass: "newsletter-verify__icon is-warning",
    headline: "Verification link expired.",
    body: "This link is older than 24 hours. Re-enter your email on the newsletter form to get a fresh link.",
  },
  invalid: {
    role: "alert",
    icon: WarningCircle,
    iconWeight: "fill",
    iconClass: "newsletter-verify__icon is-error",
    headline: "Verification link is invalid.",
    body: "We could not find this verification link. It may already have been used. Re-submit your email on the newsletter form if you still want to subscribe.",
  },
};

const resolveStatus = (query) => {
  if (!query.data && !query.isError) {
    return null;
  }

  const apiStatus = query.data?.status;
  if (apiStatus && STATE_CONFIG[apiStatus]) {
    return apiStatus;
  }

  return "invalid";
};

const NewsletterVerify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const query = useVerifyNewsletter(token);

  const isMissingToken = !token;
  const isLoading = !isMissingToken && query.isLoading;
  const status = isMissingToken ? "invalid" : resolveStatus(query);
  const config = status ? STATE_CONFIG[status] : null;
  const serverMessage = query.data?.message || "";

  return (
    <main className="newsletter-verify" aria-labelledby="newsletter-verify-title">
      <section className="newsletter-verify__card">
        <p className="newsletter-verify__eyebrow">Newsletter</p>
        <h1 id="newsletter-verify-title" className="newsletter-verify__title">
          Email verification
        </h1>

        {isLoading && (
          <div className="newsletter-verify__state" role="status">
            <span className="newsletter-verify__spinner" aria-hidden="true" />
            <p className="newsletter-verify__headline">Confirming your email…</p>
            <p className="newsletter-verify__body">Hang tight, this should only take a moment.</p>
          </div>
        )}

        {!isLoading && config && (
          <div className="newsletter-verify__state" role={config.role}>
            <config.icon
              size={36}
              weight={config.iconWeight}
              className={config.iconClass}
              aria-hidden="true"
            />
            <p className="newsletter-verify__headline">{config.headline}</p>
            <p className="newsletter-verify__body">{serverMessage || config.body}</p>
          </div>
        )}

        <Link to="/" className="newsletter-verify__home-link">
          Back to homepage
        </Link>
      </section>
    </main>
  );
};

export default NewsletterVerify;
