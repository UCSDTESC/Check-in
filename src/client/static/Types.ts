export interface ColumnDefinitions {
  [accessor: string]: string;
}

export interface FilterOption {
  filterName: string;
  optionValue: string;
}

export interface FilterOptions {
  [OptionName: string]: boolean;
}

export interface Filter {
  displayName: string;
  enabled: boolean;
  editable: boolean;
  options: FilterOptions;
}
