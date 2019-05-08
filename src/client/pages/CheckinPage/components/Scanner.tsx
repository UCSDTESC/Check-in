import React from 'react';

interface ScannerProps {
  onUserScanned: (userId: string) => void;
}

export default class Scanner<P = {}, S = {}> extends React.Component<P & ScannerProps, S> {

}
