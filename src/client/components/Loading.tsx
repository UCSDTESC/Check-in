import React from 'react';

interface LoadingProps {
  title?: string;
}

export default class Loading extends React.Component<LoadingProps> {
  render() {
    const { title } = this.props;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h1>Loading{title && ' ' + title}...</h1>
            <img className="sd-form__loading" src="/img/site/loading.svg" />
          </div>
        </div>
      </div>
    );
  }
}
