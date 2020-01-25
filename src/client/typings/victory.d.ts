import { DomainPropType } from 'victory';
import React from 'react';

declare module 'victory' {
  interface VictoryChartProps extends VictoryCommonProps {
    domain?: DomainPropType;
    domainPadding?: DomainPaddingPropType;
    events?: EventPropTypeInterface<string, StringOrNumberOrCallback>[];
    eventKey?: StringOrNumberOrCallback;
    style?: Pick<VictoryStyleInterface, 'parent'>;
    minDomain?: number | { x?: number, y?: number };
  }
}
