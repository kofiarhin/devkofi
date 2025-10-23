import PropTypes from 'prop-types';
import './progress-steps.styles.scss';

const ProgressSteps = ({ current, total }) => {
  const clampedCurrent = Math.min(Math.max(current, 1), total);
  const percent = Math.round((clampedCurrent / total) * 100);
  return (
    <div
      className="progress-steps"
      role="status"
      aria-live="polite"
      aria-label={`Step ${clampedCurrent} of ${total}`}
      style={{ '--progress-value': `${percent}%` }}
    >
      <div className="progress-steps-track" />
      <div className="progress-steps-indicator" />
      <div className="progress-steps-labels">
        <span className="progress-steps-text">Step {clampedCurrent} of {total}</span>
        <span className="progress-steps-percent">{percent}% complete</span>
      </div>
    </div>
  );
};

ProgressSteps.propTypes = {
  current: PropTypes.number,
  total: PropTypes.number,
};

ProgressSteps.defaultProps = {
  current: 1,
  total: 4,
};

export default ProgressSteps;
