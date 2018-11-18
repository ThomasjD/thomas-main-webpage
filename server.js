//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-Parser");

//Initializing
const app = express();

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//DB config
//mongodb://<dbuser>:<dbpassword>@ds037688.mlab.com:37688/thomasjd
const db = require("/config/keys").mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log(" Hola Senor Dinh... Estas connectado a MongoDB!"))
  .catch(err => console.log(err));

//Passport Config
require("./config/passport")(passport);

//Use of Routes
app.use("/api/users", users);
app.use("/api/profile", profile);

const port = process.env.port || 8000;
app.listen(port, () => console.log("Server runjing on port ${port}"));
