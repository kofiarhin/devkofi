import { useEffect, useState } from 'react';
import AccessibleButton from './AccessibleButton.jsx';
import Toast from './Toast.jsx';
import { useFeedback } from '../hooks/useFeedback.js';
import './feedback-widget.styles.scss';

const defaultState = {
  sentiment: '',
  message: '',
  honeypot: '',
};

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState(defaultState);
  const [toast, setToast] = useState(null);
  const { mutateAsync, isPending } = useFeedback();

  useEffect(() => {
    if (!isOpen) {
      setFormState(defaultState);
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formState.honeypot) {
      setIsOpen(false);
      return;
    }

    try {
      await mutateAsync({ sentiment: formState.sentiment, message: formState.message });
      setToast({ message: 'Feedback sent. Thank you!', variant: 'success' });
      setIsOpen(false);
    } catch (error) {
      setToast({ message: error.message, variant: 'error' });
    }
  };

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [toast]);

  return (
    <div className="feedback-widget">
      <AccessibleButton
        className="feedback-trigger btn btn--primary"
        aria-label="Share feedback"
        onClick={() => setIsOpen(true)}
      >
        Feedback
      </AccessibleButton>

      {isOpen ? (
        <div className="feedback-modal" role="dialog" aria-modal="true" aria-label="Share feedback">
          <div className="feedback-backdrop" onClick={() => setIsOpen(false)} role="presentation" />
          <form className="feedback-panel" onSubmit={handleSubmit}>
            <div className="feedback-header">
              <h2 className="feedback-title">How was this experience?</h2>
              <AccessibleButton
                className="btn btn--ghost feedback-close"
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close feedback"
              >
                ✕
              </AccessibleButton>
            </div>
            <fieldset className="feedback-fieldset">
              <legend className="feedback-legend">Your sentiment</legend>
              <div className="feedback-sentiment">
                <label className="feedback-option">
                  <input
                    type="radio"
                    name="sentiment"
                    value="up"
                    checked={formState.sentiment === 'up'}
                    onChange={(event) => setFormState((prev) => ({ ...prev, sentiment: event.target.value }))}
                    required
                  />
                  👍 Helpful
                </label>
                <label className="feedback-option">
                  <input
                    type="radio"
                    name="sentiment"
                    value="down"
                    checked={formState.sentiment === 'down'}
                    onChange={(event) => setFormState((prev) => ({ ...prev, sentiment: event.target.value }))}
                  />
                  👎 Needs work
                </label>
              </div>
            </fieldset>
            <label className="feedback-label" htmlFor="feedback-message">
              What stood out?
            </label>
            <textarea
              id="feedback-message"
              className="feedback-textarea"
              rows="4"
              value={formState.message}
              onChange={(event) => setFormState((prev) => ({ ...prev, message: event.target.value }))}
              placeholder="Share details so we can improve."
              required
            />
            <div className="feedback-honeypot" aria-hidden="true">
              <label htmlFor="feedback-company">Company</label>
              <input
                id="feedback-company"
                type="text"
                tabIndex="-1"
                autoComplete="off"
                value={formState.honeypot}
                onChange={(event) => setFormState((prev) => ({ ...prev, honeypot: event.target.value }))}
              />
            </div>
            <AccessibleButton className="btn btn--primary" type="submit" disabled={isPending}>
              {isPending ? 'Sending…' : 'Submit feedback'}
            </AccessibleButton>
          </form>
        </div>
      ) : null}

      {toast ? <Toast message={toast.message} variant={toast.variant} /> : null}
    </div>
  );
};

export default FeedbackWidget;
