const mongoose = require('mongoose');

const ToBeIssuedMessageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },  
  message: {
    type: String,
    required: true
  },
  phoneNumber: {
      type : Number,
      default: 0
  },
  isVerified: {
    type : Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  uuid: {
      type: String,
      default: 0
  },
  otp:{
      type: Number,
      default: 0,
  }
});

const TobeIssued = mongoose.model(' TobeIssued', ToBeIssuedMessageSchema);


module.exports = TobeIssued;