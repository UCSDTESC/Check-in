import { TEAM_CODE_LENGTH, TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import { WrappedFieldProps } from 'redux-form';

export enum JoinCreateTeamState {
  JOIN,
  CREATE,
}

export interface TeamRegisterProps {
  state?: JoinCreateTeamState;
  generateTeamCode: () => Promise<string>;
}

interface TeamRegisterState {
  joinTeamCode?: string[];
  createTeamCode: string;
}

type Props = WrappedFieldProps & TeamRegisterProps;

export default class TeamRegister extends React.Component<Props, TeamRegisterState> {
  state: Readonly<TeamRegisterState> = {
    joinTeamCode: new Array(TEAM_CODE_LENGTH).fill(' '),
    createTeamCode: '',
  };

  teamCodeInputs: HTMLInputElement[] = new Array(TEAM_CODE_LENGTH);

  componentDidMount() {
    this.props.generateTeamCode()
      .then(newCode => {
        this.setState({
          createTeamCode: newCode,
        });
      });
  }

  componentDidUpdate(prevProps: TeamRegisterProps) {
    const newState = this.props.state;
    // Someone updated state, change to the other team code
    if (newState !== prevProps.state) {
      const updatedCode = newState === JoinCreateTeamState.CREATE
        ? this.state.createTeamCode
        : this.state.joinTeamCode.join('');

      this.props.input.onChange(updatedCode);

      if (newState === JoinCreateTeamState.JOIN) {
        for (let i = 0; i < TEAM_CODE_LENGTH; i++) {
          console.log('Setting');
          this.teamCodeInputs[i].value = this.state.joinTeamCode[i].trim();
        }
      }
    }
  }

  /**
   * Update a part of the team code.
   */
  updateTeamCode = (value: string, index: number) => {
    const newTeamCode = [...this.state.joinTeamCode];
    newTeamCode[index] = value.length === 0 ? ' ' : value;

    this.setState({
      joinTeamCode: newTeamCode,
    });

    this.props.input.onChange(newTeamCode.join(''));
  };

  /**
   * Handles the interaction of when a user enters a part of the code into a text box.
   */
  handleCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.currentTarget.value;
    this.updateTeamCode(newValue, index);

    // Go to the next input if the user filled out the field.
    if (index >= TEAM_CODE_LENGTH - 1 || newValue.length === 0) {
      return;
    }
    const nextField = this.teamCodeInputs[index + 1];
    nextField.focus();
  }

  /**
   * Creates an input text field for an index within the team code.
   */
  createCodeInput = (index: number) => {
    // Placeholder of ABCD
    const placeholder = (index + 10).toString(36).toUpperCase();

    return (
      <input
        type="text"
        className="sd-form__input-text sd-form__team-code"
        onChange={e => this.handleCodeInputChange(e, index)}
        ref={ref => this.teamCodeInputs[index] = ref}
        maxLength={1}
        placeholder={placeholder}
      />
    );
  }

  renderCreateTeam() {
    return (
      <>
        <div className="row justify-content-center">
          <h4>
            Your team code is
          </h4>
          <h3 className="mx-2">
            {this.state.createTeamCode}
          </h3>
          <h4>
            .
          </h4>
        </div>
        <div className="row justify-content-center">
          <h5>
            Make sure your teammates join with this code.
          </h5>
        </div>
      </>
    );
  }

  renderJoinTeam() {
    return (
      <>
        <div className="row">
          <h4>Your 4-digit Team Code:</h4>
        </div>
        <div className="row">
          {[...Array(TEAM_CODE_LENGTH)].map((_, i) =>
            <div key={i} className="col">
              {this.createCodeInput(i)}
            </div>
          )}
        </div>
      </>
    );
  }

  render() {
    const { state } = this.props;

    return (
      <div className="container">
        {state === JoinCreateTeamState.JOIN && this.renderJoinTeam()}
        {state === JoinCreateTeamState.CREATE && this.renderCreateTeam()}
      </div>
    );
  }
}
