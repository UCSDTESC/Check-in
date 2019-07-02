import { TESCUser } from '@Shared/ModelTypes';
import React from 'react';

import BaseFilter from './BaseFilter';

interface FilterComponentProps {
  label: string;
  propertyName: keyof TESCUser;
  onFiltersChanged: (...newFilters: BaseFilter[]) => void;
}

export default class FilterComponent<P, S>
  extends React.Component<P & FilterComponentProps, S> {
}
