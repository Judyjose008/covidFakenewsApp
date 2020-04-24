const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const TobeIssued = require('../models/TobeIssued');
const IssuedMessages = require ('../models/IssuedMessage');
const uuid = require('uuid/v4');
const { ensureAuthenticated,forwardAuthenticated } = require('../config/auth');

// Fake Message Reporting Page
router.get('/fake', forwardAuthenticated, (req, res) => res.render('fakeMessageReport'));

router.post('/fake', (req, res) => {
    const { title , message , phoneNumber, category } = req.body;
    let errors = [];
    
    if ( !title || !message || !phoneNumber || !category) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
      res.render('fakeMessageReport', {
        errors,
        title,
        message,
        phoneNumber
      });
    } else {
        fakeMessagePush();
        async function fakeMessagePush()  {
            const uuid = await genUuid();
            const otp = await otpMaker();
            const completed = await pushTobeisuued(uuid, otp);
        }
        function genUuid(){
            let Uuid = uuid();
            return new Promise( (resolve, reject) => {
              for(let i=0; i<2;i++ ){
                Uuid = Uuid + uuid();
              }
              resolve(Uuid);
            });
          }
          function otpMaker() {
              let otp = 123;
              return  new Promise((resolve) => {
                resolve(otp)
              })
          }
          function pushTobeisuued(uuid, otp){
            const newFakeMessage = TobeIssued({
                title,
                message,
                phoneNumber,
                category
            });
            newFakeMessage.uuid = uuid;
            newFakeMessage.otp = otp;
            newFakeMessage.save().then(company =>{
                req.flash(
                    'success_msg',
                    'Enter the OTP for confirm this message'
                  );
                  res.send({url:'/postMessage/otp/'+uuid});
            });
          }
  
    }
  });

// OTP registration of messages to valid message
router.get('/otp/:id', forwardAuthenticated, (req, res) => {
    res.render('otpSubmission');
});
router.post('/otp/:id',forwardAuthenticated, (req,res) => {
    const { userOtp } = req.body;
    let fakeMessageId = req.params.id;
    if(userOtp == 0){
        res.send("not authorised");
    }else {
        TobeIssued.findOne({uuid:fakeMessageId}).then( fakeMessage => {
            if(fakeMessage){
                if(fakeMessage.otp == userOtp){
                  fakeMessage.isVerified = true;
                  fakeMessage.save().then( fakeMessage =>{
                      req.flash(
                          'success_msg',
                          'your message will be validated by authorities'
                        );
                      res.redirect('/');
                  });
                }else{
                  req.flash(
                    'error_msg',
                    'Wrong OTP.Try again later'
                  );
                  res.redirect('/postMessage/otp/'+fakeMessageId);
                }
            }else{
                res.send("no message found");
            }
        });
    }
});



//subscribe data push to database



// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;