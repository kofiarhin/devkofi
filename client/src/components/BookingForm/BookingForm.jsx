import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle, Clock, WarningCircle } from "@phosphor-icons/react";
import { formatSlotSummary } from "../../Pages/BookCall/bookCallDateUtils";
import { getBookingErrorMessage } from "../../services/bookingService";
import "./booking-form.styles.scss";

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  message: "",
};

const validateForm = (form, selectedSlot) => {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!selectedSlot) {
    errors.slot = "Choose a slot first.";
  }

  if (!form.name.trim()) {
    errors.name = "Add your name.";
  }

  if (!form.email.trim()) {
    errors.email = "Add your email.";
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = "Use a valid email address.";
  }

  return errors;
};

const BookingForm = ({ selectedSlot, mutation, onSuccess }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});

  const selectedSlotSummary = useMemo(() => formatSlotSummary(selectedSlot), [selectedSlot]);
  const errors = mutation.isError ? getBookingErrorMessage(mutation.error) : "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form, selectedSlot);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    mutation.mutate(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        message: form.message.trim(),
        slotStart: selectedSlot.slotStart,
      },
      {
        onSuccess: (data) => {
          setForm(INITIAL_FORM);
          setFieldErrors({});
          onSuccess(data.booking);
        },
      }
    );
  };

  const isSubmitDisabled = mutation.isPending || !selectedSlot || !form.name.trim() || !form.email.trim();

  return (
    <aside className="booking-form-panel" aria-labelledby="booking-form-title">
      <div className="booking-form-panel__summary">
        <span>
          <Clock size={16} weight="duotone" />
          Selected time
        </span>
        <strong>{selectedSlotSummary}</strong>
        {fieldErrors.slot && <small className="booking-form__error">{fieldErrors.slot}</small>}
      </div>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <div className="booking-form__header">
          <h2 id="booking-form-title">Your details</h2>
          <p>I will use these details to confirm the call.</p>
        </div>

        {errors && (
          <div className="booking-form__alert" role="alert">
            <WarningCircle size={18} weight="duotone" />
            <span>{errors}</span>
          </div>
        )}

        <div className="booking-form__field">
          <label htmlFor="booking-name">Name</label>
          <input
            id="booking-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "booking-name-error" : undefined}
          />
          {fieldErrors.name && (
            <span id="booking-name-error" className="booking-form__error">
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div className="booking-form__field">
          <label htmlFor="booking-email">Email</label>
          <input
            id="booking-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "booking-email-error" : undefined}
          />
          {fieldErrors.email && (
            <span id="booking-email-error" className="booking-form__error">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="booking-form__field">
          <label htmlFor="booking-company">Company</label>
          <input
            id="booking-company"
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            autoComplete="organization"
          />
          <span className="booking-form__helper">Optional</span>
        </div>

        <div className="booking-form__field">
          <label htmlFor="booking-message">Project context</label>
          <textarea
            id="booking-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
          />
          <span className="booking-form__helper">Optional, but useful before the call.</span>
        </div>

        <button className="booking-form__submit" type="submit" disabled={isSubmitDisabled}>
          {mutation.isPending ? (
            "Booking..."
          ) : (
            <>
              Book this call
              <ArrowRight size={17} weight="bold" />
            </>
          )}
        </button>
      </form>
    </aside>
  );
};

export const BookingConfirmation = ({ booking, onReset }) => (
  <aside className="booking-form-panel booking-form-panel--success" role="status">
    <div className="booking-form-panel__success-icon">
      <CheckCircle size={38} weight="duotone" />
    </div>
    <h2>Call booked.</h2>
    <p>{formatSlotSummary(booking)}</p>
    <button type="button" onClick={onReset}>
      Book another time
    </button>
  </aside>
);

export default BookingForm;
