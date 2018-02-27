import React from 'react';
import PropTypes from 'prop-types';

import RSVPModal from './RSVPModal';
import BussingModal from './BussingModal';

export default class RSVPConfirm extends React.Component {
  static propTypes = {
    availableBus: PropTypes.string,
    onUpdate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      status: undefined
    };
  }

  nextPage = () => this.setState({page: this.state.page + 1});

  onChooseStatus = (status) => {
    let {availableBus, onUpdate, onClose} = this.props;

    // If they decline
    if (!status) {
      onUpdate(status, null);
      return onClose();
    }

    if (availableBus) {
      this.setState({status: status});
      return this.nextPage();
    }

    onUpdate(status, null);
    onClose();
  }

  onChooseBus = (bussing) => {
    let {onUpdate, onClose} = this.props;

    onUpdate(this.state.status, bussing);
    onClose();
  }

  render() {
    let {page} = this.state;
    let {availableBus, onClose} = this.props;

    switch (page) {
    case (0):
      return (<RSVPModal isOpen toggle={onClose}
        onChooseStatus={this.onChooseStatus} />);
    case (1):
      return (<BussingModal isOpen availableBus={availableBus}
        onChooseBus={this.onChooseBus} />);
    default:
      return <span></span>;
    }
  }
}
