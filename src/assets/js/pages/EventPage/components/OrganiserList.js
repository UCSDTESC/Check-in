import PropTypes from 'prop-types';
import React from 'react';

import {Admin as AdminPropTypes} from '~/proptypes';

import OrganiserSelect from '~/components/OrganiserSelect';

export default class OrganiserList extends React.Component {
  static propTypes = {
    organisers: PropTypes.arrayOf(PropTypes.shape(
      AdminPropTypes
    ).isRequired).isRequired,
    addNewOrganiser: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newOrganiser: null
    };
  }

  changeNewOrganiser = (newOrganiser) =>
    this.setState({
      newOrganiser
    });

  onAddNewSponsor = () => {
    let {newOrganiser} = this.state;

    this.props.addNewOrganiser(newOrganiser);

    this.changeNewOrganiser(null);
  };

  render() {
    let {organisers} = this.props;
    let {newOrganiser} = this.state;

    return (
      <div className="organiser-list">
        <h2>Organisers</h2>
        <ul className="list-group mb-1">
          {organisers.map(organiser => (
            <li className="list-group-item organiser-list__username"
              key={organiser.username}>
              {organiser.username}
            </li>
          ))}
        </ul>
        <OrganiserSelect value={newOrganiser} onChange={this.changeNewOrganiser}
          exclude={organisers} />
        {newOrganiser !== null && <button className={`btn event-page__btn
          rounded-button rounded-button--small mt-1`}
          onClick={this.onAddNewSponsor}>
            Add {newOrganiser.label}
          </button>}
      </div>
    );
  }
}
