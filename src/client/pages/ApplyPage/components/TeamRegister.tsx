import React from 'react';

const TEAM_CODE_LENGTH = 4;

interface TeamRegisterProps {
  createNew: boolean;
}

interface TeamRegisterState {
  newTeam: boolean;
  teamCode?: string[];
}

export default class TeamRegister extends React.Component<TeamRegisterProps, TeamRegisterState> {
  state: Readonly<TeamRegisterState> = {
    newTeam: false,
    teamCode: new Array(TEAM_CODE_LENGTH).fill(' '),
  };

  teamCodeInputs: HTMLInputElement[] = new Array(TEAM_CODE_LENGTH);

  /**
   * Update a part of the team code.
   */
  updateTeamCode = (value: string, index: number) => {
    const newTeamCode = [...this.state.teamCode];
    newTeamCode[index] = value;

    this.setState({
      teamCode: newTeamCode,
    });
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
    return (
      <input
        type="text"
        className="sd-form__input-text sd-form__team-code"
        onChange={e => this.handleCodeInputChange(e, index)}
        ref={ref => this.teamCodeInputs[index] = ref}
        maxLength={1}
      />
    );
  }

  renderJoinTeam() {
    return (
      <div className="row">
        {[...Array(TEAM_CODE_LENGTH)].map((_, i) =>
          <div key={i} className="col">
            {this.createCodeInput(i)}
          </div>
        )}
      </div>
    );
  }

  render() {
    const { createNew } = this.props;
    return (
      <div className="container">
        {!createNew && this.renderJoinTeam()}
      </div>
    );
  }
}
