const Validator = require("validator");
const isEmpty = require("./is-empty"); //this function is also used on client side

//we can access this function from outside
module.exports = function validateRegisterInput(data) {
  //if name is not valid (min 2, max: 30)
  //-> send error message
  let errors = {};

  //isEmpty() version that can handle none string
  //can handle null, undefine etcs
  //lodash can be used to check if something is empty(but we want to minimize libraries)

  //If data is not there at all, it will be put into empty string, then tested later w/ validator
  //terniary: if its not empty then its going to be -> data.name
  //if it is empty then its going to be just an empty string, then tested later with validator
  // password2 = confirm password
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 & 30 characters";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  //Name
  //this isEmpty() is from Validator so has to be a string
  //Therefore we use our version of isEmpty from above

  //Email

  //inValid Email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    //tested with empty string
    errors.email = "Email field is required";
  }

  //Password length
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  //Empty password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  //Password 2
  //won't be used on server -> we still want to validate it to make sure its being sent
  if (!Validator.equals(data.password, data.password2)) {
    errors.password = "Passwords must match";
  }

  //Confirmation of password
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  return {
    //errors: errors, shortened
    errors,
    isValid: isEmpty(errors)
    //we want to check if isValid is empty
  };
};

/*
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  //console.log(data.name);
  //console.log(data.password);
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
*/
