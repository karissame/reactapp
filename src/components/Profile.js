import React from "react";
import { Link } from 'react-router';

export default class Profile extends React.Component {
    render() {
            if (this.props.loggedIn) {
            return (
            <div className="row">
              <div id="profile" className="col-xs-8 col-xs-offset-2">
                  <h3 id="username">Username:&nbsp; &nbsp; </h3><h2>{this.props.user.username}</h2><br />
                  <h3 id="fname">First Name:&nbsp; &nbsp; </h3><h2>{this.props.user.fname}</h2><br />
                  <h3 id="lname">Last Name:&nbsp; &nbsp; </h3><h2>{this.props.user.lname}</h2><br />
                  <h3 id="pass">Password:&nbsp; &nbsp; </h3><h2>Click to Edit</h2><br />
                  <h3 id="passconfirm" className="hidden">Password:&nbsp; &nbsp; </h3><h2></h2><br />
                  <h3 id="imgUrl" className="hidden">Image Url:&nbsp; &nbsp;{this.props.user.imgUrl}</h3>
              </div>
            </div>
        );} else {
            return (
            <div className="row">
              <div id="profile" className="col-xs-8 col-xs-offset-2">
                  <h1>Log in to continue</h1>
              </div>
            </div>
        );
        }
      }

}
