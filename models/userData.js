const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  userID: {
    type: mongoose.SchemaTypes.String,
    required: true
  },

  userName: {
    type: mongoose.SchemaTypes.String,
    required: true
  },

  scores: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0
  },

  guessTheFlagScore: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0
  },

  triviaScore: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0
  },
});

module.exports = mongoose.model("userData", userDataSchema);