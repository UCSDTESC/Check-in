import PropTypes from 'prop-types';
import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {Roles} from '~/static/Roles';

export default class RegisterModal extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      modal: (props.open ? props.open : false),
      username: '',
      password: '',
      role: Roles.ROLE_MEMBER
    };
  }

  submitForm = (e) => {
    let {username, password, role} = this.state;
    this.props.onSubmit({
      username,
      password,
      role
    });
    this.props.toggle();

    e.preventDefault();
  }

  render() {
    let {username, password, role} = this.state;
    let {open, toggle, className} = this.props;

    return (
      <div>
        <Modal isOpen={open} toggle={toggle} className={className}>
          <form onSubmit={this.submitForm}>
            <ModalHeader toggle={toggle}>New Admin</ModalHeader>
            <ModalBody>
              <div className="container sd-form">
                <div className="row">
                  <div className="col-12">
                    <label className="sd-form__label">Username</label>
                    <input type="text" className="sd-form__input-text"
                      placeholder="Username" value={username}
                      onChange={(e) =>
                        this.setState({username: e.target.value})} />
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-12">
                    <label className="sd-form__label">Password</label>
                    <input type="text" className="sd-form__input-text"
                      placeholder="Password" value={password}
                      onChange={(e) =>
                        this.setState({password: e.target.value})} />
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-12">
                    <label className="sd-form__label">Role</label>
                    <select type="text" className="sd-form__input-select"
                      value={role}
                      onChange={(e) => this.setState({role: e.target.value})}>
                      {Object.values(Roles).map((role) =>
                        <option key={role}>{role}</option>)
                      }
                    </select>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary">
                Register
              </Button>{' '}
              <Button color="secondary" outline onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    );
  }
};
