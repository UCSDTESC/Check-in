import React from 'react';
import ReactSelect from 'react-select';

export default class StyledSelect extends React.Component {
  theme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#004E74'
    }
  });

  render() {
    return (
      <ReactSelect
        theme={this.theme}
        {...this.props}>
      </ReactSelect>
    );
  }
};
