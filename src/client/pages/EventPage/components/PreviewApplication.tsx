import React from 'react';
import { Alert } from 'reactstrap';

import ApplyPage from '../../ApplyPage';

class PreviewApplication extends React.Component {

  render() {
    return (
      <>
        <Alert color="danger">
          You are in preview mode.
        </Alert>
        <ApplyPage previewMode={true} />
      </>
    );
  }
}

export default PreviewApplication;
