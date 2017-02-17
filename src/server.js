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
// ********************
app.post("/login",function(req,res){
    console.log(req.body);
    var username=req.body.username;
    var password=req.body.password;
    res.send("Do your login");
});
// **************************
const mongoose = require('mongoose');
const UserSchema = mongoose.model('User',   {
    username:   { type: String, required: true},
    fname:   { type: String, required: true},
    lname:   { type: String, required: true},
    password:   { type: String, required: true},
    imageUrl:   { type: String},

});



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
  console.info(`Server running on http://localhost:${port} [${env}]`);
});
