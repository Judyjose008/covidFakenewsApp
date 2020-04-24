const mongoose = require('mongoose');

const IssuedMessagesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },  
  message: {
    type: String,
    required: true
  },
  postedPhoneNumber: {
      type : Number,
      default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  messageId:{
      type: String,
      required : true
  }
});

const IssuedMessages = mongoose.model('IssuedMessages', IssuedMessagesSchema);


module.exports = IssuedMessages;