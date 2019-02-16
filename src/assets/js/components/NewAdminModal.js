import PropTypes from 'prop-types';
import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import generator from 'generate-password';
import FA from 'react-fontawesome';

import {Roles} from '~/static/Roles';

const generatorSettings = {
  length: 15,
  numbers: true,
  symbols: true,
  uppercase: true,
  excludeSimilarCharacters: true,
  strict: true
};

const initialValues = {
  username: '',
  password: '',
  role: Roles.ROLE_MEMBER
};

const roleDescriptions = {
  [Roles.ROLE_DEVELOPER]: [
    'Access all events',
    'Full event read/write access',
    'Full resume access',
    'Create/Delete admins/sponsors'
  ],
  [Roles.ROLE_ADMIN]: [
    'Access all organising events',
    'Full event read/write access',
    'Full resume access',
    'Create admins/sponsors'
  ],
  [Roles.ROLE_SPONSOR]: [
    'No event settings access',
    'No event read/write access',
    'Full resume access'
  ],
  [Roles.ROLE_MEMBER]: [
    'No event settings access',
    'No event read/write access',
    'No resume access'
  ]
};

class NewAdminModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,

    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,

    lockRole: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      modal: (props.open ? props.open : false),
    };
  };

  regeneratePassword = () => {
    this.props.change('password', generator.generate(generatorSettings));
  };

  render() {
    let {open, toggle, pristine, submitting, handleSubmit, lockRole} =
      this.props;

    return (
      <div>
        <Modal isOpen={open} toggle={toggle} size="lg" onOpened={this.regeneratePassword}>
          <form onSubmit={handleSubmit}>
            <ModalHeader toggle={toggle}>
              New {lockRole ? lockRole : 'Admin'}
            </ModalHeader>
            <ModalBody>
              <div className="container sd-form">
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <label className="sd-form__label">Username</label>
                    <Field name="username" className="sd-form__input-text"
                      type="text" placeholder="Username" component="input" />
                  </div>
                  <div className="col-12 col-lg-6">
                    <label className="sd-form__label">Password{' '}
                    </label>
                    <div className="row">
                      <div className="col">
                        <Field name="password" className="sd-form__input-text"
                          type="text" placeholder="Password" component="input"/>
                      </div>
                      <div className="col-auto">
                        <Button size="sm" onClick={this.regeneratePassword}>
                          <FA name="refresh" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-12">
                    <label className="sd-form__label">Role</label>
                    <div className="row">
                      {Object.values(Roles).map((role) =>
                        (<div className="col-12 col-lg-6 mb-2" key={role}>
                          <div className={`sd-form__pricing
                            sd-form__pricing--short`}>
                            <Field name="role" component="input" type="radio"
                              value={role}
                              className={`sd-form__pricing-input
                                sd-form__pricing-input--short`}
                              disabled={lockRole ? role !== lockRole : false} />
                            <label className={`sd-form__label
                              sd-form__pricing-label`}>
                              {role}
                            </label>
                            <ul className={`sd-form__radio-card-body
                              sd-form__pricing-body`}>
                              {roleDescriptions[role].map((desc, i) =>
                                (<li className="sd-form__pricing-feature"
                                  key={i}>{desc}</li>)
                              )}
                            </ul>
                          </div>
                        </div>)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <button type="submit" className={`rounded-button
                rounded-button--short rounded-button--small`}
                disabled={pristine || submitting}>Register</button>
              <button type="button" className={`rounded-button
                rounded-button--short rounded-button--small
                rounded-button--alert`} onClick={toggle}>Cancel</button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(_, ownProps) {
  return {
    form: ownProps.formName ? ownProps.formName : 'newAdminModal',
    initialValues: Object.assign({}, initialValues, {
      role: ownProps.lockRole ? ownProps.lockRole : Roles.ROLE_MEMBER,
      password: generator.generate(generatorSettings)
    })
  };
};

NewAdminModal = reduxForm({
  destroyOnUnmount: true,
  initialValues
})(NewAdminModal);

export default connect(mapStateToProps)(NewAdminModal);
