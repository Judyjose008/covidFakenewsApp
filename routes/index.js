const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const IssuedMessages = require ('../models/IssuedMessage');
const TobeIssued = require('../models/TobeIssued');
const uuid = require('uuid/v4');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
    IssuedMessages.find({} , function (err, messageDetails) {
        res.render('home', {
            fakeMessage : messageDetails
        }); 
    });
});
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
    TobeIssued.find({isVerified:true} , function (err, messageDetails) {
        res.render('dashboard', {
            fakeMessage : messageDetails
        }); 
    });
});
router.post('/dashboard/approve', ensureAuthenticated, (req, res) =>{
    const { messageId } = req.body;
    TobeIssued.findOne({uuid:messageId}).then( fakeMessage => {
        const newAuthorisedFakeMessage = IssuedMessages({
            title: fakeMessage.title,
            message: fakeMessage.message,
            postedPhoneNumber: fakeMessage.phoneNumber,
            messageId: uuid()
        });
        newAuthorisedFakeMessage.save().then( message => {
            TobeIssued.deleteOne({uuid:messageId}).then( err => {
                if(err){
                    console.log(err);
                }
            });
            req.flash(
                'success_msg',
                'New fake Message added to home page'
              );
            res.redirect('/dashboard');
        });
    });
});
router.post('/dashboard/delete', ensureAuthenticated, (req, res) => {
    const { messageId } = req.body
    TobeIssued.deleteOne({uuid:messageId}).then( err => {
        req.flash(
            'error_msg',
            'Message declined'
          );
        res.redirect('/dashboard');
    });
    
});
module.exports = router;