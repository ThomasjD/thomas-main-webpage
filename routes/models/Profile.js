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
  bio: {
    type: String
  },
  placesvisited: [
    {
      country: {
        type: String
      },
      city: {
        type: String
      },
      attraction: {
        type: String
      }
    }
  ],
  location: {
    type: String,
    required: true
  },
  social: {
    network: {
      type: String
    },
    handle: {
      type: String,
      required: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

model.exports = Profile = mongoose.model("profile", ProfileSchema);
