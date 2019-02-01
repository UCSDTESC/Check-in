import PropTypes from 'prop-types';
import React from 'react';
import {UncontrolledTooltip} from 'reactstrap';
import FA from 'react-fontawesome';
import ToggleSwitch from '~/components/ToggleSwitch';

export default class EventOptions extends React.Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    onOptionsUpdate: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      options: props.options
    };
  }

  toggleOption = (option) => () => {
    this.setState({
      options: {...this.state.options, [option]: !this.state.options[option]}
    });
  };

  renderDescriptionTag = (option, description) =>
    (<span>
      <FA name="question-circle" id={option+'Tooltip'}></FA>
      <UncontrolledTooltip placement="right" target={option+'Tooltip'}>
        {description}
      </UncontrolledTooltip>
    </span>);

  render() {
    let {onOptionsUpdate} = this.props;
    let {options} = this.state;

    const optionNames = {
      allowHighSchool: 'Allow High School Students',
      mlhProvisions: 'Add MLH Provisions',
      allowOutOfState: 'Allow Out-of-State Students',
      foodOption : 'Add Food Preference Section',
      requireResume: 'Require Resume Uploads',
      allowTeammates : 'Allow Team Members',
      requireDiversityOption: 'Require Race In Application'
    };

    const optionDescriptions = {
      mlhProvisions: 'Add the MLH provisions section as a requirement to apply',
      foodOption: 'Give the applicant the option to let you know their ' +
        'preference for catering',
      allowTeammates: 'Allow the applicant the option to specify their '+
        'teammates'
    };

    return (
      <div className="event-options">
        <h2>Options</h2>
        {Object.keys(options).map((option) => {
          let checkId = option + 'Check';
          let optionName = optionNames[option];
          let optionDescription = optionDescriptions[option];

          return (<div className="form-check pl-0" key={option}>
            <label className="form-check-label w-75 d-flex align-items-center flex-row my-3" htmlFor={checkId}>
              <span>{optionName}&nbsp;</span> {optionDescription ?
                this.renderDescriptionTag(option, optionDescription) : ''}
                <ToggleSwitch className="d-inline-block ml-auto" type="checkbox" name={option}
                  id={checkId} checked={options[option]}
                  onChange={this.toggleOption(option)} 
                />
            </label>
          </div>);
        })}

        <button className="btn rounded-button rounded-button--small"
          onClick={() => onOptionsUpdate(this.state.options)}>
          Update
        </button>
      </div>
    );
  }
}
