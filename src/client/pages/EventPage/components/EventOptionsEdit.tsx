import { TESCEvent, TESCEventOptions, MAX_TEAM_SIZE } from '@Shared/ModelTypes';
import React from 'react';
import FA from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import ToggleSwitch from '~/components/ToggleSwitch';

interface EventOptionsProps {
  //initial options of the event
  options: TESCEventOptions;

  //calback function for when the update button is clicked
  onOptionsUpdate: (newOptions: TESCEventOptions) => void;

  //the event these options are for
  event: TESCEvent;
}

//the current, edited state of the options
interface EventOptionsState {
  options: TESCEventOptions;
}

/**
 * This component implements event option editing (toggling)
 */
export default class EventOptionsEdit extends React.Component<EventOptionsProps, EventOptionsState> {
  constructor(props: EventOptionsProps) {
    super(props);

    this.state = {
      options: props.options,
    };
  }

  /**
   * This is a callback function that is called when a ToggleSwitch is clicked for an option. 
   * 
   * @param {String} optionName the name of the option
   */
  toggleOption = (optionName: string) => () => {
    this.setState({
      // TODO: Fix dynamically property
      // @ts-ignore
      options: { ...this.state.options, [optionName]: !this.state.options[optionName] },
    });
  };

  /**
   * This renders a tooltip for an option, intended as a QOL feature for event admins.
   * 
   * @param {String} optionName the option which the tootip is for
   * @param {String} description the description for the option
   */
  renderDescriptionTag = (optionName: string, description: string) => (
    <span>
      <FA name="question-circle" id={optionName + 'Tooltip'} />
      <UncontrolledTooltip placement="right" target={optionName + 'Tooltip'}>
        {description}
      </UncontrolledTooltip>
    </span>
  );

  render() {
    const { onOptionsUpdate, event } = this.props;
    const { options } = this.state;

    //Long Form Display Names for options
    const optionNames = {
      allowHighSchool: 'Allow High School Students',
      mlhProvisions: 'Add MLH Provisions',
      allowOutOfState: 'Allow Out-of-State Students',
      foodOption: 'Add Food Preference Section',
      requireResume: 'Require Resume Uploads',
      allowTeammates: 'Allow Teams',
      requireDiversityOption: 'Require Race In Application',
      requireClassRequirement: 'Require Applicant To Have Completed CSE 100',
      requireExtraCurriculars: 'Require Extra Curriculars',
      requireGPA: 'Require GPA In Application',
      enableGPA: 'Enable GPA In Application (not Required)',
      requireMajorGPA: 'Require Major GPA In Application',
      requireWhyThisEvent: `Require 'Why ${event.name}?' In Application`,
    };

    //tooltip descriptions
    const optionDescriptions = {
      mlhProvisions: 'Add the MLH provisions section as a requirement to apply',
      foodOption: 'Give the applicant the option to let you know their ' +
        'preference for catering',
      allowTeammates: `Allow applicants to create and join teams of up to ${MAX_TEAM_SIZE}`,
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
