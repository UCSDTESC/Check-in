import React from 'react';

class NotFoundPage extends React.Component {
  render() {
    return (
      <div className="not-found">
        <div className="not-found__panel">
          <h1 className="not-found__header">Page Not Found</h1>
          <div className="not-found__body">
            <p className="not-found__info">
              I&#39;m sorry, the page you were looking for cannot be found!
            </p>
            <p className="not-found__info">
              <a href="/">← Back to our homepage</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default NotFoundPage;
