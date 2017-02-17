// 'use strict';

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import NotFoundPage from './components/NotFoundPage';
import axios from 'axios';
const bodyParser = require('body-parser');


const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
mongoose.connect('mongodb://localhost/reactLoginDemo');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// ******  PASSWORD ENCRYPTION  ******
var bcrypt = require('bcrypt');
const saltRounds=10;
//never store plaintext password!!!!!EVER!!!!EVER!!!!

const myPass = 'secretpw';
bcrypt.genSalt(saltRounds,function(err,salt){
    console.log("salt",salt);
    bcrypt.hash(myPass,salt,function(err, hash){
        //Will store with user record
        console.log("hash",hash);
    });
});

var hash="$2a$10$FrjwaswIyGTg/RcTvUtpi.xvxSXEQiHHjBqnobQPHMolqDl4N3dGG";
bcrypt.compare(myPass,hash,function(err,res){
    console.log("res",res);
});

const UserSchema = mongoose.model('User',   {
    username:   { type: String, required: true},
    fname:   { type: String, required: true},
    lname:   { type: String, required: true},
    password:   { type: String, required: true},
    imageUrl:   { type: String},

});

var UserClass = function()  {
    this.fname = "";
    this.lname = "";
    this.username = "";
    this.password = "";
    this.imageUrl = "";
};

UserClass.prototype.register = function(callback) {
    var tryingThis = this;
    console.log("attemping to register");
    console.log(this);
    UserSchema.findOne({username: this.username})
        .then(function(err,user)    {
            if (err)    {
                console.log('Signup error', err.message);
                callback({success:false,message:'user not saved'});
            }
            // console.log(this.username);
            console.log(user);
            // if user found
            if (typeof user !== "undefined" && typeof user.username==="string" && user.username !== this.username ) {
                if (user.username[0].username)  {
                    console.log("username already exists, username: " + user.username);
                    callback({success:false,message:'user not saved'});
                }
            var err = new Error();
            err.status = 310;
            console.log('Signup error', err.message);
            callback({success:false,message:'user not saved'});
            }
            // save user
            else {
                {
                    // "this" instead of user to pass in
                    // console.log("anything else");
                    console.log(tryingThis);

                    var dbUser = new UserSchema(tryingThis);
                    console.log("about to save");
                    console.log(dbUser);
                    dbUser.save()
                        .then(function(savedObject) {
                            console.log("done");
                            callback({success:true,message:'user saved',data:savedObject});
                        })
                        .catch(function(err)    {
                            console.log("didn\'t save because", err.stack);
                        });
                };
            };
        });
    };

// ********************
app.post("/login",function(req,res){
    // console.log(req.body);
    var username=req.body.username;
    var password=req.body.password;
    UserSchema.findOne({"username":username})
        .then(function(user)    {
            if (user)    {
                console.log("User found. Comparing password next...");
                bcrypt.compare(password,user.password, function(err,loginresult)               {
                    // console.log("res compare",res);
                    if(loginresult){
                        console.log("passwords match");
                        console.log("user object is: "+user);
                        res.json({login:true,user:user});
                    } else {
                        console.log("passwords don't match");
                        res.json({login:false});
                    }
                });
            } else {
                        console.log('failed to login');
                        res.send({login:false});
                    }

                })
        .catch(function(err){
            console.log("error:",err.message);
            console.log(err.stack);
        });
});

// **************************
app.post("/register", function(req,res) {
    console.log("starting registration");
    var newUser = new UserClass();
    console.log("created new user");
    console.log(newUser);
    newUser.fname = req.body.fname;
    newUser.lname = req.body.lname;
    newUser.username = req.body.username;
    newUser.imageUrl = req.body.imageUrl;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    newUser.password = hash;
    console.log("Password is " + newUser.password);
    console.log("about to register this user info:");
    console.log(newUser);
    newUser.register(function(response){
        console.log("user created");
        console.log(response);
        if(response.success){
            res.send("all good");
        } else {
            res.send("already exists");
        }
    });
});



// **************************
// universal routing and rendering
app.get('*', (req, res) => {
    console.log("req.url: "  + req.url);
    match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {

      // in case of error display the error message
      if (err) {
        return res.status(500).send(err.message);
      }
      console.log("redirecting to :",redirectLocation);
      // in case of redirect propagate the redirect to the browser
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      // generate the React markup for the current route
      let markup;
      if (renderProps) {
        // if the current route matched we have renderProps
        markup = renderToString(<RouterContext {...renderProps}/>);
      } else {
        // otherwise we can render a 404 page
        markup = renderToString(<NotFoundPage/>);
        res.status(404);
      }

    //   console.log({ markup })
      // render the index template with the embedded React markup
      return res.render('index', { markup });
    }
  );
});

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info("Server running on http://localhost:${port} [${env}]");
});
