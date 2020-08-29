import React from 'react';
import { Field, Fields, reduxForm, InjectedFormProps, WrappedFieldsProps } from 'redux-form';
import * as FormFields from '~/components/Fields';
import FileField from '~/components/FileField';

export interface EventFormData {
  name: string;
  alias: string;
  closeTimeDay: number;
  closeTimeMonth: number;
  closeTimeYear: number;
  homepage: string;
  email: string;
  description: string;
  organisedBy: string;
  thirdPartyText?: string;
  logo: File[];
}

interface EventFormProps {
  editing?: boolean;
}

<<<<<<< HEAD
// The props of this component are the props returned by the redux-form HOC and it's native props
=======
// the props of this component are the props returned by the redux-form HOC and it's native props
>>>>>>> e253abe7440e82c88a3f9dabb9c3907107651edf
type Props = InjectedFormProps<EventFormData, EventFormProps> & EventFormProps;

/**
 * This is the redux-form to create a new event
 */
class EventForm extends React.Component<Props> {

  /**
   * Create a file droppable field for the event logo
   *
   * @returns {Component}
   */
  createLogoUpload() {
    return (
      <Field
        component={FileField}
        name="logo"
        placeholder="Logo"
        text="Drop Your Logo"
      />
    );
  }

  /**
   * Show an alert that flags the event as a non-TESC hosted event.
   *
   * @returns {React.StatelessComponent}
   */
  showThirdPartyText: React.StatelessComponent<WrappedFieldsProps> = ({values}) => {
    if (values && values.organisedBy && values.organisedBy.input.value !== 'TESC') {
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
              {this.props.editing ? 'Edit Event' : 'Create Event'}
          </button>
        )}
      </form>
    );
  }
}

export default reduxForm<EventFormData, EventFormProps>({
  form: 'event',
  destroyOnUnmount: true,
})(EventForm);
