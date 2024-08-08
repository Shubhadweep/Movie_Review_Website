const express = require('express');
const router = express.Router();

const { getSignup, postSignup, getLogin, postLogin, getHomePage, mailConfirmation,
       getEmailForforotPassword, postEmailforForgotPass, resetPassword, 
       postResetPsssword,logout,
       passwordResetSuccessPage} = require('../Controller/AuthController');

router.get("/",getHomePage);
router.get("/Signup",getSignup);
router.post("/postSignup",postSignup);

router.get("/mailConfirmation/:mail",mailConfirmation);

router.get("/login",getLogin);
router.post("/postLogin",postLogin);

router.get("/logout",logout)

router.get("/emailForPassword",getEmailForforotPassword);
router.post("/postemailForPassword",postEmailforForgotPass);

router.get('/resetPassword/:email',resetPassword);
router.post('/postResetPass',postResetPsssword);
router.get("/successPassword",passwordResetSuccessPage);

module.exports = router;