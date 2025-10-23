import PropTypes from 'prop-types';
import './section.styles.scss';

const Section = ({ id, title, eyebrow, description, children, variant }) => (
  <section className={`section section--${variant}`} id={id}>
    <div className="container section-inner">
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      {title ? <h2 className="section-title">{title}</h2> : null}
      {description ? <p className="section-description prose">{description}</p> : null}
      {children ? <div className="section-body">{children}</div> : null}
    </div>
  </section>
);

Section.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  eyebrow: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'surface']),
};

Section.defaultProps = {
  id: undefined,
  title: undefined,
  eyebrow: undefined,
  description: undefined,
  children: null,
  variant: 'default',
};

export default Section;
