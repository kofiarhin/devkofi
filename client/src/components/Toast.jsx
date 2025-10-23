import PropTypes from 'prop-types';
import './toast.styles.scss';

const Toast = ({ message, variant }) => (
  <div className={`toast toast--${variant}`} role="status" aria-live="polite">
    {message}
  </div>
);

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['success', 'error', 'info']),
};

Toast.defaultProps = {
  variant: 'info',
};

export default Toast;
