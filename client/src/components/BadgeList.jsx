import PropTypes from 'prop-types';
import './badge-list.styles.scss';

const BadgeList = ({ badges }) => (
  <ul className="badge-list" role="list">
    {badges.map((badge) => (
      <li className="badge-list-item" key={badge.id}>
        <div className="badge-icon" aria-hidden="true">{badge.icon}</div>
        <div>
          <p className="badge-title">{badge.title}</p>
          <p className="badge-description text-muted">{badge.description}</p>
        </div>
      </li>
    ))}
  </ul>
);

BadgeList.propTypes = {
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BadgeList;
