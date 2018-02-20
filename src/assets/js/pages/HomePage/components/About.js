import React from 'react';

export default class About extends React.Component {
  render() {
    return (<div className="about">
      <div className="container">
        <div className="row row-eq-height">

          <div class="col-md-12 text center">
            <h1>Other Events</h1>
          </div>

          <div className="col-md-4">
            <a href="http://hackxr.io/">
              <div className="card mb-4 box-shadow">
                <img src=
                  "https://images.typeform.com/images/Eib2d4NsykvM/image/default#.png" 
                  width="156" height="176" className="card-img-top" />
                <div className="card-body">
                  <p className="card-text">
                    HackXR
                  </p>
                </div>
              </div>
            </a>
          </div>

          <div className="col-md-4">
            <a href="http://tesc.ucsd.edu/decaf/">
              <div className="card mb-4 box-shadow">
                <img src="http://tesc.ucsd.edu/decaf/assets/decaf-graphic.svg" 
                  width="156" height="176" className="card-img-top" />
                <div className="card-body">
                  <p className="card-text">
                    Previous: Decaf
                  </p>
                </div>
              </div>
            </a>
          </div>

          <div className="col-md-4">
            <a href="https://www.sdhacks.io/">
              <div className="card mb-4 box-shadow">
                <img src="https://www.sdhacks.io/assets/img/vectors/logo.svg" 
                width="156" height="176" className="card-img-top" />
                <div className="card-body">
                  <p className="card-text">
                    Previous: SDHacks
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>);
  }
};
