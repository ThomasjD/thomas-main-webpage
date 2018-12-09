const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
//will check on inputs from newUser from register.js

const validateLoginInput = require("../../validation/login");

// Load User model
// "../" go out of api & routes folder & go into models
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));
//res.json() similiar to res.send() which we used to serve text instead of json

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  //use mongoose to first find if email exist

  //validateRegisterInput is from register.js of validation folder, which req will get passed into, to see whatever rules w/in register will pass
  const { errors, isValid } = validateRegisterInput(req.body);
  //include email name password in the body
  //to check if there are errors, check to see if errors is valid(passed in parameter is false)

  // Check Validation
  if (!isValid) {
    //send along the whole entire error's object
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      //if user is true = it exist in db return this response
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default (show an avatar w/ no photo 'generic' )
      });

      //if user not exist, create a newUser using the User model using data from the req as an object
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      }); // all of this come from react form

      //access it via req.body.(whatever its called)
      //w/ mongoose can use callback or promise (we use promise here)

      //salt for hashing
      //1st parameter: it will take in 10 char
      //2nd parameter: callback function using arrow function (which takes an error if there is one & it will give us back that salt
      //salt is used to create hash
      bcrypt.genSalt(10, (err, salt) => {
        //1st parameter newUser just created above
        //2nd parameter  salt(generated above)
        //3rd parameter callback gives an error if there is one, or if no error it gives us hash
        //hash is whats stored in db (not actual password)
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          //set user password to the hash
          newUser.password = hash;
          newUser
            .save()
            //after new User gets saved -> the response is json of user info
            .then(user => res.json(user))
            .catch(err => console.log(err));
        }); //closing of bcrypt.hash
      }); //closing of bycrypt.genSalt
    } //closing else
  }); //closing of .then(user)
}); //closing post register

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  //extraction of email & password from form sent in
  const { errors, isValid } = validateLoginInput(req.body);
  //include email name password in the body
  //to check if there are errors, check to see if errors is valid(passed in parameter is false)

  // Check Validation
  if (!isValid) {
    //send along the whole entire error's object
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    //User is a model
    // Check for user
    //email shortened from email: email
    //if user is found(match) -> give us the user as a promise
    //if user doesn't match -> will user variable will be False

    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    //validation of password
    //bcrypt used to reverse the password hashed into text to compare w/ password from form sent in
    //hashed password is from user (which was found in db)
    bcrypt.compare(password, user.password).then(isMatch => {
      //isMatch is a promised that shows if True if there there was a match
      if (isMatch) {
        //Instead of send back a response message
        //res.json({ msg: "Success" });

        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

        // Sign Token
        //sign() takes in 3 arguments & a callback()
        //1. payload: (what we want to include in the token) -> this is user info that will get decoded so that it can know what user it is
        //2. keys.secret or key (located in config folder... changes to keys done here)
        //3. expiration object: we know we need to send an expiration if we want it to expire at certain amt of time (in secs)
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            //should get token back if login was successful l
            res.json({
              success: true,
              token: "Bearer " + token
              //Bearer is a type of protocol to format the token in the header
              //we're gonna attach that on to the token, so that we don't have to do it when we actually make the request
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //callback contain req response
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
