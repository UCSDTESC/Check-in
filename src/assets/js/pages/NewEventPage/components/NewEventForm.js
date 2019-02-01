import React, {Component} from 'react';
import {Field, Fields, reduxForm} from 'redux-form';
import fields from '~/components/Fields'
import FileField from '~/components/FileField'
class NewEventForm extends Component {


    createLogoUpload() {
        return (<Field component={FileField} name="logo"
          placeholder="Resume" text="Drop Your Logo" />);
    }

    render() {
        const {pristine, submitting, handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                {fields.createRow(
                    fields.createColumn('col-md-6',
                    fields.createLabel('Event Name'),
                    fields.createInput('name', 'SD Hacks 9001')
                ),
                    fields.createColumn('col-md-6',
                    fields.createLabel('Event Alias'),
                    fields.createInput('alias', 'sdhacks9001')
                    )
                )}
                {fields.createRow(
                    fields.createColumn('col-sm-12',
                    fields.createLabel('Event Close Date'),
                    <div className="row">
                        {fields.createColumn('col-sm-4',
                        fields.createMonthPicker('closeTimeMonth')
                        )}
                        {fields.createColumn('col-sm-4',
                        fields.createInput('closeTimeDay', 'Day', 'number',
                            'sd-form__input-text mb-1 mb-md-0')
                        )}
                        {fields.createColumn('col-sm-4',
                        fields.createInput('closeTimeYear', 'Year', 'number',
                            'sd-form__input-text')
                        )}
                    </div>
                    )
                )}
                {fields.createRow(
                    fields.createColumn('col-md-6',
                    fields.createLabel('Event Homepage URL'),
                    fields.createInput('url', 'sdhacks.io')
                ),
                    fields.createColumn('col-md-6',
                    fields.createLabel('Event Contact Email'),
                    fields.createInput('email', 'you@tesc.ucsd.edu')
                    )
                )}
                {fields.createRow(
                    fields.createColumn('col-md-12',
                    fields.createLabel('Event Description'),
                    fields.createTextArea('description', 'SD Hacks has been one of the largest hackathons in California since its inception back in 2015. We take pride in being a fully student organized event, while partnering with numerous other student-run engineering organizations at UC San Diego.')
                )
                )}
                {fields.createRow(
                    fields.createColumn('col-md-4 col-md-offset-4',
                    fields.createLabel('Logo Upload (5MB Max)'),
                        this.createLogoUpload()
                    )
                )}

                {fields.createColumn('col-sm-12 col-md-8 text-right',
                    <button className={'btn sd-form__nav-button rounded-button ' +
                        'success button'} type="submit" disabled={pristine || submitting}>Apply!</button>
                )}
            </form>
        )
    }
}

export default reduxForm({
    form: 'newEvent',
    destroyOnUnmount: true
})(NewEventForm)