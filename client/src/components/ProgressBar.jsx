import PropTypes from 'prop-types';
import './progress-bar.styles.scss';

const ProgressBar = ({ value }) => {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped}>
      <div className="progress-bar-track" />
      <div className="progress-bar-fill" style={{ '--progress-value': `${clamped}%` }} />
      <span className="progress-bar-label">{clamped}% complete</span>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
};

export default ProgressBar;
