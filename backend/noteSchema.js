const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
  userEmail: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  active: {
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('notes', NotesSchema);