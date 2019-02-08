import PropTypes from 'prop-types';
import React from 'react';

import SponsorSelect from '~/components/SponsorSelect';

import {Admin as AdminPropTypes} from '~/proptypes';

export default class SponsorList extends React.Component {
  static propTypes = {
    sponsors: PropTypes.arrayOf(PropTypes.shape(
      AdminPropTypes
    ).isRequired).isRequired,
    addNewSponsor: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newSponsor: null
    };
  }

  changeNewSponsor = (newSponsor) =>
    this.setState({
      newSponsor
    });

  onAddNewSponsor = () => {
    let {newSponsor} = this.state;

    this.props.addNewSponsor(newSponsor);

    this.changeNewSponsor(null);
  };

  render() {
    let {sponsors} = this.props;
    let {newSponsor} = this.state;

    return (
      <div className="sponsor-list">
        <h2>Sponsors</h2>
        <ul className="list-group mb-1">
          {sponsors.map(sponsor => (
            <li className="list-group-item sponsor-list__username"
              key={sponsor.username}>
              {sponsor.username}
            </li>
          ))}
        </ul>
        <SponsorSelect value={newSponsor} onChange={this.changeNewSponsor}
          exclude={sponsors} />
        {newSponsor !== null && <button className={`btn event-page__btn
          rounded-button rounded-button--small mt-1`}
          onClick={this.onAddNewSponsor}>
            Add {newSponsor.label}
          </button>}
      </div>
    );
  }
}
