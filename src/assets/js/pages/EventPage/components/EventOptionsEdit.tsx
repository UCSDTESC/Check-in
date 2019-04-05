import React from 'react';
import {UncontrolledTooltip} from 'reactstrap';
import FA from 'react-fontawesome';

import ToggleSwitch from '~/components/ToggleSwitch';
import { TESCEvent, TESCEventOptions } from '~/static/types';

interface EventOptionsProps {
  options: TESCEventOptions;
  onOptionsUpdate: (newOptions: TESCEventOptions) => void;
  event: TESCEvent;
}

interface EventOptionsState {
  options: TESCEventOptions;
}

export default class EventOptionsEdit extends React.Component<EventOptionsProps, EventOptionsState> {
  constructor(props: EventOptionsProps) {
    super(props);

    this.state = {
      options: props.options,
    };
  }

  toggleOption = (optionName: string) => () => {
    this.setState({
      // TODO: Fix dynamically property
      // @ts-ignore
      options: {...this.state.options, [optionName]: !this.state.options[optionName]},
    });
  };

  renderDescriptionTag = (optionName: string, description: string) => (
    <span>
      <FA name="question-circle" id={optionName + 'Tooltip'} />
      <UncontrolledTooltip placement="right" target={optionName + 'Tooltip'}>
        {description}
      </UncontrolledTooltip>
    </span>
  );

  render() {
    const {onOptionsUpdate, event} = this.props;
    const {options} = this.state;

    const optionNames = {
      allowHighSchool: 'Allow High School Students',
      mlhProvisions: 'Add MLH Provisions',
      allowOutOfState: 'Allow Out-of-State Students',
      foodOption : 'Add Food Preference Section',
      requireResume: 'Require Resume Uploads',
      allowTeammates : 'Allow Team Members',
      requireDiversityOption: 'Require Race In Application',
      requireClassRequirement: 'Require Applicant To Have Completed CSE 100',
      requireExtraCurriculars: 'Require Extra Curriculars',
      requireGPA: 'Require GPA In Application',
      requireMajorGPA: 'Require Major GPA In Application',
      requireWhyThisEvent: `Require 'Why ${event.name}?' In Application`,
    };

    const optionDescriptions = {
      mlhProvisions: 'Add the MLH provisions section as a requirement to apply',
      foodOption: 'Give the applicant the option to let you know their ' +
        'preference for catering',
      allowTeammates: 'Allow the applicant the option to specify their ' +
        'teammates',
      requireExtraCurriculars: 'Create a text field on the application for' +
        ' the applicant to put their extra curriculars / student orgs',
    };

    return (
      <div className="event-options">
        <div className="d-flex flex-row">
          <h2 className="align-self-start">Registration Options</h2>
          <button
            className={`btn rounded-button rounded-button--small ml-auto my-auto rounded-button--short
              rounded-button--secondary`}
            onClick={() => onOptionsUpdate(this.state.options)}
          >
            Update
          </button>
        </div>

        {Object.entries(options).map(([optionName, optionValue]) => {
          const checkId = optionName + 'Check';
          // TODO: Fix dynamic property reference
          // @ts-ignore
          const optionDisplayName = optionNames[optionName];
          // @ts-ignore
          const optionDescription = optionDescriptions[optionName];

          return (<div className="form-check pl-0" key={optionName}>
            <label
              className={`form-check-label w-100 d-flex align-items-center flex-row my-3`}
              htmlFor={checkId}
            >
              <span>{optionDisplayName}&nbsp;</span> {optionDescription ?
                this.renderDescriptionTag(optionName, optionDescription) : ''}
              <ToggleSwitch
                className="d-inline-block ml-auto"
                id={checkId}
                checked={optionValue}
                onChange={this.toggleOption(optionName)}
              />
            </label>
          </div>);
        })}
      </div>
    );
  }
}
