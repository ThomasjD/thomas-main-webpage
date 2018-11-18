const mongoose = require("mongoose");

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  relationship: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  location: {
    type: String
  },
  social: {
    network: {
      type: String
    },
    handle: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

model.exports = Profile = mongoose.model("profile", ProfileSchema);
