import {Fields, reduxForm} from 'redux-form';
import React from 'react';
import PropTypes from 'prop-types';

import fields from '~/components/Fields';

class ResponseSection extends React.Component {
  static propTypes = {
    previousPage: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    options: PropTypes.object.isRequired
  }

  /**
   * Create a new input field when user claims to be out of state.
   * @param {Object} values Information returned by the {@link Fields}
   * component.
   * @returns {Component}
   */
  showCity(values) {
    if (values.outOfState && values.outOfState.input.value === 'true') {
      return (
        fields.createRow(
          fields.createColumn('col-lg-6',
            fields.createLabel('If yes, from where?', false),
            fields.createInput('city', 'Which city?')
          )
        )
      );
    }
    return <span></span>;
  }

  render() {
    const {previousPage, handleSubmit, pristine, submitting, options}
      = this.props;

    return (<form onSubmit={handleSubmit}>
      {options.foodOption && fields.createRow(
        fields.createColumn('col-sm-12',
          fields.createLabel('What kind of food would you like to see ' +
            'at the hackathon?', false),
          fields.createTextArea('food', 'Healthy Snacks and Drinks')
        )
      )}

      {fields.createRow(
        fields.createColumn('col-sm-12',
          fields.createLabel('Dietary Restrictions', false),
          fields.createTextArea('diet', 'Dietary Restrictions')
        )
      )}

      {options.allowOutOfState && fields.createRow(
        fields.createColumn('col-lg-6',
          fields.createLabel('I will be travelling from outside the '+
              'San Diego county'),
          fields.createRadio('outOfState', true, 'Yes'),
          fields.createRadio('outOfState', false, 'No')
        )
      )}

      {fields.createRow(
        fields.createColumn('col-12',
          fields.createLabel('T-Shirt Size (Unisex)'),
          fields.createTShirtSizePicker()
        )
      )}

      {options.allowOutOfState &&
        <Fields names={['outOfState']} component={this.showCity} />}

      {options.allowTeammates && fields.createRow(
        fields.createColumn('col-sm-12',
          fields.createLabel('Please enter the email addresses of your '+
            'desired teammates. We will do our best to accept whole teams if '+
            'ALL members apply and include all members’ email addresses in '+
            'their applications. Don’t worry, you can come back and edit your '+
            'application at any time.', false)
        ),
        fields.createColumn('col-sm-12 col-lg-4',
          fields.createInput('team1', 'example@example.com', 'email')
        ),
        fields.createColumn('col-sm-12 col-lg-4',
          fields.createInput('team2', 'example@example.com', 'email')
        ),
        fields.createColumn('col-sm-12 col-lg-4',
          fields.createInput('team3', 'example@example.com', 'email')
        )
      )}

      {fields.createRow(
        fields.createColumn('col-sm-12 col-md-4 text-center',
          <button className="btn rounded-button rounded-button--secondary"
            type="button" onClick={previousPage}>Go Back</button>
        ),
        fields.createColumn('col-sm-12 col-md-8 text-right',
          <button className={'btn sd-form__nav-button rounded-button ' +
            'success button'} type="submit"
            disabled={pristine || submitting}>Next!</button>
        )
      )}
    </form>);
  }
}

export default reduxForm({
  form: 'apply',
  destroyOnUnmount: false
})(ResponseSection);
