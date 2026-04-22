import { useId, useState } from "react";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import useSubscribeNewsletter from "../../hooks/mutations/useSubscribeNewsletter";
import { getNewsletterErrorMessage } from "../../services/newsletterService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Email address is required.";
  }

  if (!EMAIL_REGEX.test(trimmedValue)) {
    return "Enter a valid email address.";
  }

  return "";
};

const NewsletterSignupForm = () => {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const inputId = useId();
  const errorId = useId();
  const statusId = useId();
  const subscribeMutation = useSubscribeNewsletter();

  const serverError = subscribeMutation.isError
    ? getNewsletterErrorMessage(subscribeMutation.error)
    : "";

  const showError = Boolean(fieldError || serverError);
  const successMessage = subscribeMutation.data?.message || "Thanks for subscribing!";

  const resetMutationState = () => {
    if (subscribeMutation.isError || subscribeMutation.isSuccess) {
      subscribeMutation.reset();
    }
  };

  const handleChange = (event) => {
    const nextEmail = event.target.value;

    setEmail(nextEmail);
    resetMutationState();

    if (fieldError) {
      setFieldError(validateEmail(nextEmail));
    }
  };

  const handleBlur = () => {
    if (!email) {
      return;
    }

    setFieldError(validateEmail(email));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextError = validateEmail(email);

    if (nextError) {
      setFieldError(nextError);
      resetMutationState();
      return;
    }

    setFieldError("");

    try {
      await subscribeMutation.mutateAsync({ email: email.trim() });
      setEmail("");
    } catch {
      // Mutation state handles the error UI.
    }
  };

  return (
    <div className="newsletter-form-block">
      <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className="newsletter-sr-only">
          Email address
        </label>

        <div className="newsletter-field-row">
          <input
            id={inputId}
            type="email"
            className={`newsletter-input ${showError ? "is-invalid" : ""}`.trim()}
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            autoComplete="email"
            disabled={subscribeMutation.isPending}
            aria-invalid={showError}
            aria-describedby={showError ? errorId : undefined}
          />

          <button
            type="submit"
            className="newsletter-submit"
            disabled={subscribeMutation.isPending}
          >
            {subscribeMutation.isPending ? (
              <>
                <span className="newsletter-spinner" aria-hidden="true" />
                Joining...
              </>
            ) : (
              <>
                Join
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        <div className="newsletter-status-stack">
          {showError && (
            <p id={errorId} className="newsletter-message is-error" role="alert">
              {fieldError || serverError}
            </p>
          )}

          {subscribeMutation.isSuccess && !showError && (
            <p
              id={statusId}
              className="newsletter-message is-success"
              role="status"
            >
              <CheckCircle size={18} weight="fill" aria-hidden="true" />
              <span>{successMessage}</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewsletterSignupForm;
