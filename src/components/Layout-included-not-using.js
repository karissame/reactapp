'use strict';

import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {

  render() {
      console.log("rendering Layout");
      return (
      <div className="app-container">
        <div>
          <Link to="/">
            <img className="logo" src="/img/logo.png"/>
          </Link>
        </div>
        <div className="app-content">{this.props.children}</div>
        <div id="footer">
          <p>
            FOOTER!!
          </p>
        </div>
      </div>
    );
  }
}
