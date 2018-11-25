//this is where we have or passport-jwt strategy

//only way this is going to be used if we specify it on a certain route (one that is protected... make one in users.js)

//bring in passport-jwt -> allows to extract payload
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

//bring in mongoose (need it for searching for the user that comes w/ payload)
const mongoose = require("mongoose");

//bring in model
const User = mongoose.model("users"); //users come from exporting line of the Model
//module.exports = User = mongoose.model("users", UserSchema);

const keys = require("../config/keys"); //bringing it in to verify

const opts = {};

//fromAuthHeaderAsBearerToken() is a meta function
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

//put in the secret key into options{} needed as a parameter in passport.use()
opts.secretOrKey = keys.secretOrKey;
//keys.secretOrKey is keyword in an object in the keys file in config folder

//passport is used in server.js as a middleware
//passport is a parameter, in ES6 does not require () if its only 1 parameter
//jwt_payload: is the object from users.js
/*const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar
              }*/

module.exports = passport => {
  //Use our new jwt strategy
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);

      User.findById(jwt_payload.id) // --> will give us a promise
        .then(user => {
          if (user) {
            //if user has been found -> want to return done function
            //2 parameters in done(): 1) error (if there is error) 2) actual user
            return done(null, user); //done was passsed in above
            //1st parameter = should be error(null bec no error, user found)
            //2nd parameter = user
          }
          return done(null, false); //false because user not found
          //1st parameter
          //2nd parameter false because there is no user
        })
        .catch(err => console.log(err));
    })
  );
};
