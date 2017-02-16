import React from "react";
import { Link } from 'react-router';
import Header from "./Header";
import Footer from "./Footer";
import Profile from "./Profile";

export default class Layout extends React.Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            user: {
                username: "testme",
                fname: "Patrick",
                lname: "Bullion",
                imgUrl: "https://avatars1.githubusercontent.com/u/20978249?v=3&u=26d15bb28c9158228d4ba593cdc7d2ad4482ff6b&s=400"
            }
        };
    }
    login(loginObj) {
        console.log("in login");
        console.log(loginObj);
        if (this.state.loggedIn) {
            this.setState({
                loggedIn: false
            });
        } else {
            this.setState({
                loggedIn: true
            });
        }
    }
    renderHeader() {
        return <Header login={(a) => this.login(a)} user={this.state.user} loggedIn={this.state.loggedIn}/>;
    }
    renderFooter() {
        return <Footer />;
    }
    renderProfile() {
        return <Profile user={this.state.user} loggedIn={this.state.loggedIn}/>;
    }
    render() {
            return (
                <div className="wrapper">
                    <div className="header">
                        {this.renderHeader()}
                    </div>
                    <div className="container">
                    <div className="profile">
                        {this.renderProfile()}
                    </div></div>
                    <div className="footer">
                        {this.renderFooter()}
                    </div>
                </div>
            );
        }
    }
