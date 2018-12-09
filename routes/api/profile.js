const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
// "../" go out of api & routes folder & go into models
const User = require("../../models/User");
// after bringing in User.js you can use any model & any mongoose methods available from User.js

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));
//res.json() similiar to res.send() which we used to serve text instead of json

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    //only need slash bec this file is linked to api/profile from the server.js
    //we want to get current users profile
    //user schema contain an Id object

    Profile.findOne({ user: req.user.id })
      //go to user kw on profile schema, populate the name and avatar of this user
      .populate("user", ["name", "avatar"]) //populate from users
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          //404 is error for not found

          return res.status(404).json(errors);
          //now error sent as a response
        }
        //if profile is found
        //.json sends 200 req response, & profile
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id (this is backend route)
//Front end api route: api/profile/:user_id
// @desc    Get profile by user ID (user_id)
// @access  Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  //user is a key in the Profile model
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Validation of fields
    const { errors, isValid } = validateProfileInput(req.body);
    //all form fields available in req.body

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    //all the info coming through the form will be stored as profileFields
    const profileFields = {};
    //profileFields: handle,company,website,location,status,skills,bio,twitter/facebook/youtube/instagram

    //things that won't come from a form (comes from token)
    //will include avatar, name, email
    profileFields.user = req.user.id;

    //check if the field that we're looking for has come in
    //then assign it as propty of profileFields{}
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;

    Profile.findOne({ user: req.user.id }).then(profile => {
      //If profile already exist -> Update with new fields coming in then it will respond with this profile
      if (profile) {
        // Update
        //findOneAndUpdate()  -> method of mongoose
        //profileField is a giant object we created from all the input
        Profile.findOneAndUpdate(
          { user: req.user.id }, //who we are updating
          { $set: profileFields }, //object contain user info
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //If profile doesn't exist -> Create profile

        //1st check to see if handle exists, bec we don't want multiple handles, handle is for SEO friendly way
        //all our input should be in the profileFields object

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          //If handle aready exist
          if (profile) {
            //handle is our profile page address
            //if profile already exists
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          //If handle does not exist -> Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/placesvisited",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    //req.user.id comes from token
    Profile.findOne({ user: req.user.id }).then(profile => {
      //we dont' have an experience collection, so can't use save
      //we need to add it to the experience array w/in Profile collection

      const newPlace = {
        //all these fields come from a form
        country: req.body.country,
        city: req.body.city,
        attraction: req.body.attraction
      };

      // Add to exp array
      //unshift() => add to beggining
      //push() => add to end
      profile.experience.unshift(newPlace);
      //this will add new place you just been to
      //front end application will update our state -> so we'll see that new experience
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  "/placesvisited/:place_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //passing in the id of the particular experience to delete in the handle

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //2 ways to do delete it
        //1. maps(): map array to something else
        //2. index out
        //Get remove index ( find experience to delete )

        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          //create a new array consisting of all the id of eperiences
          .indexOf(req.params.exp_id);
        //get us correct index of the experience(of the particular id) to delete

        // Splice out of array
        profile.placesvisited.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
