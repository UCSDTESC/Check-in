declare module 'react-progress' {
  import React, { CSSProperties } from 'react';

  interface ProgressProps {
    className?: string;
    color?: string;
    height?: number;
    hideDelay?: number;
    percent?: number;
    speed?: number;
    style?: CSSProperties;
  }

  export default class Progress extends React.Component<ProgressProps> {
  }
}
