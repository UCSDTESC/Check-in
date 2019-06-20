import { Range, Handle, createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import React from 'react';

// tslint:disable-next-line
import 'rc-slider/assets/index.css';

interface NumberFilterComponentProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (min: number, max: number) => void;
}

interface NumberFilterComponentState {
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

export default class NumberFilterComponent
  extends React.Component<NumberFilterComponentProps, NumberFilterComponentState> {
  render() {
    const { min, max, label, step, format, onChange } = this.props;
    const TooltipRange = createSliderWithTooltip(Range);

    return (
      <>
        {label}
        <TooltipRange
          min={min}
          max={max}
          step={step ? step : 1}
          onAfterChange={value => onChange(value[0], value[1])}
          handle={handle}
          tipFormatter={format}
        />
      </>
    );
  }
}
