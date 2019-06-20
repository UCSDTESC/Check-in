import { UserYearOptions } from '@Shared/UserEnums';
import { Range, Handle, createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import React from 'react';

// tslint:disable-next-line
import 'rc-slider/assets/index.css';

interface YearFilterComponentProps {
  label: string;
  onChange: (years: string[]) => void;
}

interface YearFilterComponentState {
  value: number[];
}

const handle = (props: any) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

export default class YearFilterComponent
  extends React.Component<YearFilterComponentProps, YearFilterComponentState> {
  onValueChange = (newValues: number[]) => {
    this.props.onChange(UserYearOptions.slice(newValues[0], newValues[1] + 1));
  }

  render() {
    const { label, onChange } = this.props;
    const TooltipRange = createSliderWithTooltip(Range);

    return (
      <>
        {label}
        <TooltipRange
          min={0}
          max={UserYearOptions.length - 1}
          dots={true}
          step={1}
          onAfterChange={this.onValueChange}
          handle={handle}
          tipFormatter={(value: number) => UserYearOptions[value]}
          className="teams-filters__slider"
        />
      </>
    );
  }
}
