import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AccessibleButton from '../../components/AccessibleButton.jsx';
import ProgressSteps from '../../components/ProgressSteps.jsx';
import Section from '../../components/Section.jsx';
import './onboarding.styles.scss';

const storageKey = 'devkofi:onboarding';

const steps = [
  {
    id: 'account',
    title: 'Create your account',
    description: 'Set the foundation for your mentorship workspace.',
    fields: [
      { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
      { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
      { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
    ],
  },
  {
    id: 'profile',
    title: 'Tell us about you',
    description: 'Share your background so we can tailor guidance.',
    fields: [
      { name: 'role', label: 'Current role', type: 'text', autoComplete: 'organization-title' },
      { name: 'experience', label: 'Years of experience', type: 'number', min: 0, max: 40 },
      { name: 'stack', label: 'Primary stack', type: 'text' },
    ],
  },
  {
    id: 'goals',
    title: 'Define your next milestone',
    description: 'Align on the outcomes you want to unlock in the next 90 days.',
    fields: [
      { name: 'primaryGoal', label: 'Primary goal', type: 'text' },
      { name: 'timeline', label: 'Target launch date', type: 'date' },
      { name: 'support', label: 'Where do you need the most support?', type: 'text' },
    ],
  },
  {
    id: 'confirm',
    title: 'Confirm your plan',
    description: 'Review your details before joining DevKofi mentorship.',
    fields: [],
  },
];

const Onboarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return {};
    }
    try {
      return JSON.parse(stored);
    } catch (error) {
      return {};
    }
  });

  const currentIndex = useMemo(() => {
    const stepParam = Number(searchParams.get('step')) || 1;
    return Math.min(Math.max(stepParam, 1), steps.length);
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const step = steps[currentIndex - 1];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const goToStep = (index) => {
    setSearchParams({ step: index.toString() });
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (currentIndex === steps.length) {
      navigate('/portal');
      return;
    }
    goToStep(currentIndex + 1);
  };

  const handleBack = (event) => {
    event.preventDefault();
    if (currentIndex === 1) {
      return;
    }
    goToStep(currentIndex - 1);
  };

  const summaryEntries = steps
    .filter((entry) => entry.fields.length)
    .flatMap((entry) =>
      entry.fields.map((field) => ({
        label: field.label,
        value: state[field.name] || '—',
      }))
    );

  return (
    <div className="onboarding">
      <div className="container onboarding-inner">
        <ProgressSteps current={currentIndex} total={steps.length} />
        <Section title={step.title} description={step.description} variant="surface">
          <form className="onboarding-form" onSubmit={handleNext}>
            {step.fields.length ? (
              <div className="onboarding-grid">
                {step.fields.map((field) => (
                  <label className="onboarding-field" htmlFor={field.name} key={field.name}>
                    <span className="onboarding-label">{field.label}</span>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={state[field.name] || ''}
                      onChange={handleChange}
                      autoComplete={field.autoComplete}
                      min={field.min}
                      max={field.max}
                      required
                    />
                  </label>
                ))}
              </div>
            ) : (
              <div className="onboarding-summary" role="list">
                {summaryEntries.map((item) => (
                  <div className="onboarding-summary-item" role="listitem" key={item.label}>
                    <span className="onboarding-summary-label">{item.label}</span>
                    <span className="onboarding-summary-value">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="onboarding-actions">
              <AccessibleButton className="btn btn--ghost" type="button" onClick={handleBack} aria-disabled={currentIndex === 1}>
                Back
              </AccessibleButton>
              <AccessibleButton className="btn btn--primary" type="submit">
                {currentIndex === steps.length ? 'Finish onboarding' : 'Continue'}
              </AccessibleButton>
            </div>
          </form>
        </Section>
      </div>
    </div>
  );
};

export default Onboarding;
