import { UserYearOptions } from '@Shared/UserEnums';
import { Range, Handle, createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import React from 'react';

// tslint:disable-next-line
import 'rc-slider/assets/index.css';
import FilterComponent from './FilterComponent';
import StringFilter, { StringOperation } from './StringFilter';

interface YearFilterComponentProps {
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
  extends FilterComponent<YearFilterComponentProps, YearFilterComponentState> {
  onValueChange = (newValues: number[]) => {
    const { label, propertyName } = this.props;
    const newOptions = UserYearOptions.slice(newValues[0], newValues[1] + 1);
    const newFilter: StringFilter = new StringFilter(propertyName, label, StringOperation.EQUALS, ...newOptions);
    this.props.onFiltersChanged(newFilter);
  }

  render() {
    const { label } = this.props;
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
