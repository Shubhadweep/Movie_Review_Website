const movieModel = require('../Models/movieModel');
const reviewModel = require('../Models/reviewRatingsModel');
const authModel = require('../Models/authModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const transporter = nodemailer.createTransport({
    host:'smtp',
    port:465,
    requireTLS:true,
    secure:false,
    service:'gmail',
    auth:{
        user:'rohanslife1202@gmail.com',
        pass: 'ifyq bscp rxrh xdsv'
    }
})
const getHomePage =async (req,res)=>{
    try{
        let allMovies = await movieModel.find({});
    //console.log("All Movie Details Fetched From the Database: ",allMovies);
    let allreviews = await reviewModel.find({});
    console.log("All review Details Fetched From the Database: ",allreviews);
    res.render("User/HomePage",{
        title:'Home Page',
        data:allMovies,
        movieData: allreviews
    })
 }catch(error){
    console.log("The Error in HomePage Controller Function: ",error);
 }
    
}
const getSignup = (req,res)=>{
    let flashSms = req.flash('mailError');
    console.log("The Sms collected for same Email: ",flashSms);
    let mailData = flashSms.length > 0 ? flashSms[0] : null;
    res.render("User_Auth/signup",{
        title:'Signup Page',
        data: mailData
    })
}

const postSignup = async(req,res)=>{
    try{
        console.log("The User Details Collected From the Form: ",req.body);
        let existmail = await authModel.findOne({emailId:req.body.email});
        console.log("Existing User details: ",existmail);
        if(existmail){
            req.flash('mailError','SomeOne has Already Registered With this MailId')
            console.log("SomeOne has Already Registered With this MailId");
            res.redirect("/Signup");
        }else{
            let hashPassword = await bcrypt.hash(req.body.password,12);
            console.log("The Generated Hash Password is: ",hashPassword);
        
        let formData = new authModel({
            userName: req.body.username,
            emailId: req.body.email,
            contactNumber:req.body.contact,
            password: hashPassword
        })
        let saveData = await formData.save();

        if(saveData){
            console.log("User Registration Data Saved Successfully");
            let mailOptions = {
                from:'rohanslife1202@gmail.com',
                to: req.body.email,
                subject:'Email verification',
                text: 'Welcome '+ saveData.userName + '\n\n'+
                "You have Successfully Submitted Your Details, Please click on the link below to Verify Your Account"+'\n\n'+
                "http://"+req.headers.host+"/mailConfirmation/"+req.body.email+'\n\n'+
                'Thank You'
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("Error in Sending Mail ",error);
                    res.redirect("/Signup");
                }else{
                    console.log("The mail has been send to Your registered Mail id ",info.response);
                    res.redirect("/login");
                }
            })
            
        }
        }
    }catch(error){
        console.log("Failed to save user data into the Database ",error);
    }
}
const mailConfirmation = async(req,res)=>{
    try{
        console.log("The Mail id collected from Params: ",req.params.mail);
        let userDetails = await authModel.findOne({emailId:req.params.mail});
        console.log("The user details who is Trying to verify the Account : ",userDetails);
        if(userDetails.isVerified){
            res.send("Your Account is Already Verified");
            console.log("Your Account is Already Verified");
        }else{
            userDetails.isVerified = true;
            let VerifyAcc = await userDetails.save();
            if(VerifyAcc){
                console.log("Your account has been verified Successfully");
                res.redirect("/login");
            }
        }

    }catch(error){
        console.log("Failed To Verify Account ",error);
    }
}

const getEmailForforotPassword = (req,res)=>{
    let mailError = req.flash('errorMail');
    console.log("The Flash Sms collected for wrong mail to reset Password: ",mailError);
    let mailSms = mailError.length>0 ? mailError[0] : null;

    let sendMail = req.flash('mailSending');
    console.log("The Flash Sms for mail Sending for Reset Password: ",sendMail);
    let mailSend = sendMail.length>0 ? sendMail[0] : null;

    res.render("User_Auth/emailForForgotPass",{
        title:'PassWord Generation',
        data: mailSms,
        mailData: mailSend
    })

}

const postEmailforForgotPass = async(req,res)=>{
    try{
        console.log("The user Email Collected For generate new Password: ",req.body.email);
        let valid_User_Check = await authModel.findOne({emailId:req.body.email})
        if(valid_User_Check){
            mail_options ={
                from:'rohanslife1202@gmail.com',
                to: req.body.email,
                subject: 'Forget Password Mail',
                text: 'Great, '+' You can Easily reset Your Password by Following Steps as Instructed below..'+'\n\n'
                +'At fisrt You just need to Click the link given below to reset Your Password '+'\n\n'+
                'http://'+req.headers.host+'/resetPassword/'+req.body.email+
                '\n\nThank You'
            }
            transporter.sendMail(mail_options,(error,info)=>{
                if(error){
                    console.log("Failed to Send Mail For reset Password ",error);
                    res.redirect("/emailForPassword");
                }else{
                    req.flash('mailSending',"The mail for reset password has been send to your Registered Mail Id Successfully")
                    console.log("The mail for reset password has been send to your Registered Mail Id Successfully");
                    res.redirect("/emailForPassword");
                }
            })

        }else{
            req.flash('errorMail',"Invalid Email, Please Write Your Correct Email-id to Reset Password");
            console.log("Invalid Mail Id, Please Write Your Correct Mail-id to Reset Password");
            res.redirect("/emailForPassword");
        }

    }catch(error){
        console.log("Error in Mail Sending for Reset Password ",error);
    }
}

const resetPassword = (req,res)=>{
    console.log("The Email-id Collected from Params: ",req.params.email);
    res.render("User_Auth/ForgetPass",{
        title:'Reset Password',
        data:req.params.email
    })    
}

const postResetPsssword = async(req,res)=>{
    try{
        console.log("The user Details Collected For reset Password: ",req.body);
        let userDetails = await authModel.findOne({emailId:req.body.email});
        console.log("The user details whose password needs to be reset: ",userDetails);

        if(req.body.password === req.body.retypePass){
            let hashPassword = await bcrypt.hash(req.body.password,12);
            console.log("The Generated Hash Password is: ",hashPassword);

            userDetails.password  = hashPassword;
            let saveNewPass = await userDetails.save();
            if(saveNewPass){
            console.log("The Password has been reset successfully");
            res.redirect("/successPassword");
            }

        }else{
            console.log("Your Password and Retype Password does't Match");
            res.send("Your Password and Retype Password does't Match");
        }
        
    }catch(error){
        console.log("Failed to reset Password ",error);
    }
}

const passwordResetSuccessPage =(req,res)=>{
    res.render("User_Auth/changePasswordSuccess",{
        title:'Success Page'
    })
}
const getLogin = (req,res)=>{
    let errorMail = req.flash('invalidMail');
    console.log("The Flash Sms collected for Wrong mail: ",errorMail);
    let mailError = errorMail.length>0 ? errorMail[0] : null;

    let userVerify = req.flash('notVerified');
    console.log("The flash Sms collected for not verification: ",userVerify);
    let verifyError = userVerify.length>0 ? userVerify[0] : null;

    let errorPassword = req.flash('wrongPass');
    console.log("The flash Sms collected for Wrong Password: ",errorPassword);
    let passwordErr = errorPassword.length>0 ? errorPassword[0] : null;

    res.render("User_Auth/login",{
        title:'Login Page',
        mailData: mailError,
        verifyData: verifyError,
        passData: passwordErr
    })
}

const postLogin = async(req,res)=>{
    try{
        console.log("The Login details Connected from the Page: ",req.body);
        let existmail = await authModel.findOne({emailId:req.body.email});
        console.log("The existing user deatails Check for login: ",existmail);
        if(!existmail){
            req.flash('invalidMail','You have Entered Wrong mail-id');
            console.log("Invalid Mail id");
            res.redirect("/login");
        }else if(existmail.isVerified === false){
            req.flash('notVerified','Your Account is Not Verified, Please Verify Your Account by Clicking the link that has been Send to your registered Mail-id')
            console.log("You are Not a verified user");
            res.redirect("/login");
        }else{
            let comparePassword = await bcrypt.compare(req.body.password,existmail.password);
            console.log("The Compare Password is: ", comparePassword);
            if(comparePassword){
                let token_PlayLoad = {userData:existmail};
                let jwt_token = jwt.sign(token_PlayLoad,process.env.SECRET_KEY,{expiresIn:'1h'});
                console.log('Token Data',jwt_token);
                res.cookie("Token_Data",jwt_token,{
                    expires: new Date(Date.now() + 3600000),
                    httpOnly: true
                });

                console.log("The Login is SuccessFull");
                // res.send("Login SuccessFull");
                res.redirect('/myProfile');

            }else{
                req.flash('wrongPass',"You have entered Wrong Password")
                console.log("Wrong Password");
                res.redirect("/login");
            }
        }
    }catch(error){
        console.log("Failed To login ",error);
    }
}

const userAuth = async(req,res,next)=>{
    try{
        console.log("The Login data Stored in Cookies: ", req.user);
        if(req.user){
            next();
        }else{
            console.log("You need to login first");
            res.redirect("/login");
        }

    }catch(error){
        console.log("Failed to find cookie Data: ",error);
    }
}

const logout = async(req,res)=>{
    try{
        await res.clearCookie("Token_Data");
        res.redirect("/login");
        console.log("Logout SuccessFull");

    }catch(error){
        console.log("Error in logout Process: ",error);
    }
}

module.exports = {getSignup,postSignup,getLogin,postLogin,getHomePage,
    mailConfirmation,getEmailForforotPassword,postEmailforForgotPass,
    resetPassword,postResetPsssword,userAuth,logout,passwordResetSuccessPage};