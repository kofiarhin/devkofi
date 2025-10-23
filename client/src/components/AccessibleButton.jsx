import PropTypes from 'prop-types';
import { forwardRef, useCallback } from 'react';
import './accessible-button.styles.scss';

const AccessibleButton = forwardRef(({ as: Component = 'button', className = '', children, onClick, disabled, ...props }, ref) => {
  const handleKeyDown = useCallback(
    (event) => {
      if (disabled) {
        return;
      }
      if ((event.key === 'Enter' || event.key === ' ') && onClick) {
        event.preventDefault();
        onClick(event);
      }
    },
    [disabled, onClick]
  );

  return (
    <Component
      ref={ref}
      className={`btn ${className}`.trim()}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

AccessibleButton.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

AccessibleButton.defaultProps = {
  as: 'button',
  className: '',
  onClick: undefined,
  disabled: false,
};

export default AccessibleButton;
