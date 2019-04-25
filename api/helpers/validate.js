var validate = require("validate.js");
 

validate.async.options = {
  format: "flat",
  fullMessages: false
};
validate.extend(validate.validators.datetime, {
  parse: function (value, options) {
    return new Date(value).valueOf()
  },
  // Input is a unix timestamp
  format: function (value, options) {
    return new Date(value)
  }
})
module.exports = validate;
