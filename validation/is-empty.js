//specialized function to check for undefined, null, empty object, empty string
//this is necessary bec isvalidator only check for empty strings

/*  
function isEmpty(value) {     

  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
*/
//refactoring it
//1) const instead of function, name = arrow funciton, take off () around parameter bec its single parameter, add => after parameter
//since its an arrow function take off {}, don't need a return ()
const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  //Object.keys(value).length = finding length of keys
  //0 keys length = empty object
  (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty;
