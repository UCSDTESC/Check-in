import React from 'react';
import ApplyPage from '../../ApplyPage';
import { Alert } from 'reactstrap';

class PreviewApplication extends React.Component {

  render() {
    return (
      <>
        <Alert color="danger">
          You are in preview mode. You will not be able to create an application
        </Alert>
        <ApplyPage previewMode={true} />
      </>
    );
  }
}

export default PreviewApplication;