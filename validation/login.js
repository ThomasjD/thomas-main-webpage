onst Validator = require("validator");
const isEmpty = require("./is-empty");
//this function is also used on client side

//we can access this function from outside
module.exports = function validateLoginInput(data) {
  let errors = {};

  //terniary: if its not empty then its going to be -> data.name
  //if it is empty then its going to be just an empty string, then tested later with validator

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //Email
  if (Validator.isEmpty(data.email)) {
    //tested with empty string
    errors.email = "Email field is required";
  }

  //inValid Email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  //Empty password field
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    //errors: errors, shortened
    errors,
    isValid: isEmpty(errors)
    //we want to check if isValid is empty
  };
};
