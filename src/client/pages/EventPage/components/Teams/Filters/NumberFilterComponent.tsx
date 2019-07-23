import { Range, Handle, createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import React from 'react';

// tslint:disable-next-line
import 'rc-slider/assets/index.css';
import FilterComponent from './FilterComponent';
import NumberFilter, { NumberOperation } from './NumberFilter';

interface NumberFilterComponentProps {
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
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
  extends FilterComponent<NumberFilterComponentProps, NumberFilterComponentState> {
  onChange = (value1: number, value2: number) => {
    const { label, propertyName } = this.props;
    let newFilter: NumberFilter;
    if (!!value1 && !!value2) {
      // Between two
      newFilter = new NumberFilter(propertyName, label, NumberOperation.BETWEEN, value1, value2);
    } else if (!!value1 && !value2) {
      // Above value 1
      newFilter = new NumberFilter(propertyName, label, NumberOperation.GTE, value1);
    } else if (!value1 && !!value2) {
      // Below value 2
      newFilter = new NumberFilter(propertyName, label, NumberOperation.LTE, value2);
    }
    this.props.onFiltersChanged(newFilter);
  }

  render() {
    const { min, max, label, step, format } = this.props;
    const TooltipRange = createSliderWithTooltip(Range);

    return (
      <>
        <div>
          {label}
        </div>
        <TooltipRange
          min={min}
          max={max}
          step={step ? step : 1}
          onAfterChange={value => this.onChange(value[0], value[1])}
          handle={handle}
          tipFormatter={format}
          className="teams-filters__slider"
        />
      </>
    );
  }
}
