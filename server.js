//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
//jwt is submodule of passport, but can also use local validation, & google auth

//Initializing express w/ a const
const app = express();

const bodyParser = require("body-Parser");
//bodyParser requires 2 middlewares: allows us to access req.body.(whatever: ex. email)

//Middleware
-app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//DB config
//mongoURI is in the keys.js file, its a string value that contains the username & password

const db = require("/config/keys").mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log(" Hola Senor Dinh... Estas connectado a MongoDB!"))
  .catch(err => console.log(err));

// Passport middleware -> aunthetication module & making routes private
app.use(passport.initialize());
//Passport Config
require("./config/passport")(passport);
//Use of passport requires a strategy depending on if its jwt, google, or local (goes in the Config file)
//our jwt strategy will is in the config folder passport.js file
//Passport Config inside of config folder

//Use of Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//process.env.PORT is for when deploying to heroku
const port = process.env.port || 8000;
app.listen(port, () => console.log("Server runjing on port ${port}"));
