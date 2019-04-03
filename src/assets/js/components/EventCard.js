import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

export default class EventCard extends React.Component {
  static propTypes = {
    highlighted: PropTypes.bool,
    to: PropTypes.string,
    header: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    subtext: PropTypes.string,
    className: PropTypes.string,
  };

  render() {
    const {highlighted, to, header, title, subtext, image, className}
      = this.props;

    const eventHeaderClass = highlighted
      ? "event-card__header event-card__header--highlighted"
      : "event-card__header";

    return (
      <Link to={to}>
        <div className={`card mb-4 box-shadow event-card ${className}`}>
          {!!header &&
            <div className={`card-header
              ${eventHeaderClass}`}>
              {header}
            </div>
          }
          {!!image &&
            <img src={image} className="event-card__img card-img-top bg-white"
              alt={title} />
          }
          <div className="card-body">
            <h5 className="card-title">
              {title}
            </h5>
            <p className="card-text">
              {subtext}
            </p>
          </div>
        </div>
      </Link>);
  }
}
