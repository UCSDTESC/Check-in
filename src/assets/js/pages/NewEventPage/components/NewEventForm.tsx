import React from 'react';
import {Field, Fields, reduxForm, InjectedFormProps} from 'redux-form';

import * as FormFields from '~/components/Fields';

import FileField from '~/components/FileField';

interface NewEventFormData {

}

interface NewEventFormProps {

}

type Props = InjectedFormProps<NewEventFormData, NewEventFormProps> & NewEventFormProps;

class NewEventForm extends React.Component<Props> {

  createLogoUpload() {
    return (
      <Field
        component={FileField}
        name="logo"
        placeholder="Resume"
        text="Drop Your Logo"
      />
    );
  }

  showThirdPartyText(values: any) {
    if (values.organisedBy && values.organisedBy.input.value !== 'TESC') {
      return (
        FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel('Third Party Text', false),
            FormFields.createInput('thirdPartyText',
              'This Event is Organised By Your Org..')
          )
        )
      );
    }
    return <span />;
  }

  render() {
    const {pristine, submitting, handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        {FormFields.createRow(
          FormFields.createColumn('col-md-6',
            FormFields.createLabel('Event Name'),
            FormFields.createInput('name', 'SD Hacks 9001')
          ),
          FormFields.createColumn('col-md-6',
            FormFields.createLabel('Event Alias'),
            FormFields.createInput('alias', 'sdhacks9001')
          )
        )}
        {FormFields.createRow(
          FormFields.createColumn('col-sm-12',
              FormFields.createLabel('Application Close Date'),
            <div className="row">
              {FormFields.createColumn('col-sm-4',
                  FormFields.createMonthPicker('closeTimeMonth')
                  )}
              {FormFields.createColumn('col-sm-4',
                  FormFields.createInput('closeTimeDay', 'Day', 'number',
                      'sd-form__input-text mb-1 mb-md-0')
                  )}
              {FormFields.createColumn('col-sm-4',
                  FormFields.createInput('closeTimeYear', 'Year', 'number',
                      'sd-form__input-text')
                  )}
            </div>
          )
        )}
        {FormFields.createRow(
            FormFields.createColumn('col-md-6',
              FormFields.createLabel('Event Homepage URL'),
              FormFields.createInput('homepage', 'https://sdhacks.io')
            ),
            FormFields.createColumn('col-md-6',
              FormFields.createLabel('Event Contact Email'),
              FormFields.createInput('email', 'you@tesc.ucsd.edu')
            )
        )}
        {FormFields.createRow(
          FormFields.createColumn('col-md-12',
            FormFields.createLabel('Event Description'),
            FormFields.createInput('description',
              `SD Hacks 9001 is UC San Diego's Premier Annual
              Collegiate Hackathon!`)
          )
        )}
        {FormFields.createRow(
          FormFields.createColumn('col-md-12',
            FormFields.createLabel('Organised By'),
            FormFields.createInput('organisedBy', 'Your Organisation Here'),
        ))}

        <Fields names={['organisedBy']} component={this.showThirdPartyText} />

        {FormFields.createRow(
          FormFields.createColumn('col-md-4 col-md-offset-4',
            FormFields.createLabel('Logo Upload (5MB Max)'),
                this.createLogoUpload()
            )
        )}

        {FormFields.createColumn('col-sm-12 col-md-8 text-right',
          <button
            className="btn sd-form__nav-button rounded-button success button"
            type="submit"
            disabled={pristine || submitting}
          >
              Create Event!
          </button>
        )}
      </form>
    );
  }
}

export default reduxForm<NewEventFormData, NewEventFormProps>({
  form: 'newEvent',
  destroyOnUnmount: true,
})(NewEventForm);