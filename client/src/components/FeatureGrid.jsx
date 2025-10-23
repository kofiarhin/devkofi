import PropTypes from 'prop-types';
import './feature-grid.styles.scss';

const FeatureGrid = ({ items }) => (
  <div className="feature-grid">
    {items.map((item) => (
      <article className="feature-card surface-card" key={item.title}>
        <span className="feature-icon" aria-hidden="true">{item.icon}</span>
        <h3 className="feature-title">{item.title}</h3>
        <p className="feature-description text-muted">{item.description}</p>
      </article>
    ))}
  </div>
);

FeatureGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FeatureGrid;
