import React from 'react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  highlighted?: boolean;
  to?: string;
  header?: string;
  image?: string;
  title?: string;
  subtext?: JSX.Element;
  className?: string;
}

export default class EventCard extends React.Component<EventCardProps> {
  render() {
    const { highlighted, to, header, title, subtext, image, className }
      = this.props;

    const eventHeaderClass = highlighted
      ? 'event-card__header event-card__header--highlighted'
      : 'event-card__header';

    return (
      <Link to={to}>
        <div className={`card mb-4 box-shadow event-card ${className ? className : ''}`}>
          {!!header &&
            <div className={`card-header ${eventHeaderClass}`}>
              {header}
            </div>
          }
          {!!image &&
            <img
              src={image}
              className="event-card__img card-img-top bg-white"
              alt={title}
            />
          }
          <div className="card-body event-card__body">
            <h5 className="card-title event-card__title">
              {title}
            </h5>
            <p className="card-text event-card__subtitle">
              {subtext}
            </p>
          </div>
        </div>
      </Link>
    );
  }
}
