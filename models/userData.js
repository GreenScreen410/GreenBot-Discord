const mongoose = require('mongoose');

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

  guessTheFlagScores: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model("userData", userDataSchema);