import React from 'react';

interface ScannerProps {
  onUserScanned: (userId: string) => void;
}

/**
 * Abstraction to ensure the `onUserScanned` prop is provided to the scanner tabs.
 */
export default class Scanner<P = {}, S = {}> extends React.Component<P & ScannerProps, S> {

}
