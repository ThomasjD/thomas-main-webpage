const Validator = require("validator");
const isEmpty = require("./is-empty");
//this function is also used on client side

//we can access this function from outside
module.exports = function validateProfileInput(data) {
  let errors = {};

  //terniary: if its not empty then its going to be -> data.name
  //if it is empty then its going to be just an empty string, then tested later with validator

  //This makes sure if its null/undefined, its getting sent to our specialized isEmpty()
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.location = !isEmpty(data.location) ? data.location : "";

  //isLength() -> 2 parameters 1) data 2) length
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 & 40 characters";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }

  return {
    //errors: errors, shortened
    errors,
    isValid: isEmpty(errors)
    //we want to check if isValid is empty
  };
};
