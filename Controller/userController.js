const movieModel = require('../Models/movieModel');
const ratingReviewModel = require('../Models/reviewRatingsModel');
const authModel = require('../Models/authModel');
const{validationResult} = require('express-validator');
const getAllMovieList = async (req,res)=>{
    
    let allMovies = await movieModel.find({});
    console.log("The Movie Details Got from Database: ",allMovies);
    res.render("User/allMovies",{
        title:'add Review page',
        Data: allMovies
    })
}

const getReviewRatingsPage = (req,res)=>{
    //console.log("The user Details got from token: ",req.user);
    console.log("The The movie Name Collected from params: ",req.params.movieName);
    console.log("The The movie id Collected from params: ",req.params.id);
    let userData = req.user;
    res.render("User/addReviewRatings",{
        title:'Review & Rating',
        data: userData,
        movieId:req.params.id,
        movieName: req.params.movieName
    })
    
}

const postReview = async(req,res)=>{
    try{
        console.log("Ratings and Reviews Collected from the Page: ",req.body);
       
        let formData = new ratingReviewModel({
            userName: req.body.userName,
            emailId: req.body.emailId,
            review:req.body.review,
            rating:req.body.rating,
            movieReviewId:req.body.Id
    });
    let saveData = await formData.save();
    if(saveData){
        console.log("The Review & Rating Details are Saved Successfully into the Database");
        res.redirect("/ownReviews");
    }
    }catch(error){
        console.log("Failed To Save Review and Ratings details into the database",error);
    }   
}

const ownReviews = async (req,res)=>{
    try{

        let allReviews = await ratingReviewModel.aggregate([
            {
                $lookup:{
                    from: "movie_details",
                    localField: "movieReviewId",
                    foreignField: "_id",
                    as:"allDetails"  

                },
            },
            {
                $unwind:{
                    path:"$allDetails"
                },
            },
            {
                $project:{
                    createdAt:0,
                    updatedAt:0,
                    'allDetails.createdAt': 0,
                    'allDetails.updatedAt' : 0
                }
            }
        ])
        console.log("All Reviews details including Movie Details: ",allReviews);
        res.render("User/ownReviews",{
            title:'Visit my reviews',
            allData: allReviews
        })

    }catch(error){
        console.log("Failed to merge all details from review and Movie Collection ",error);
    }
    
}

const deleteReview = async(req,res)=>{
    try{
        console.log("The id collected from Params for Delete: ",req.params.id);
        let deletedData = await ratingReviewModel.findOneAndDelete({_id:req.params.id});
        console.log("The Deleted Review details: ",deletedData);
        if(deletedData){
            res.redirect("/ownReviews");
        }

    }catch(error){
        console.log("Failed to Delete Data: ",error);
    }
}

const viewEditPage = async (req,res)=>{
    try{
        console.log("The id collected from Params for Edit: ",req.params.id);
        let oldDetails = await ratingReviewModel.findOne({_id:req.params.id});
        console.log("The old Details Collected for edit: ",oldDetails);
        res.render("User/editReviewRatings",{
        title:'View Edit Details',
        data: oldDetails
   })

    }catch(error){
        console.log("Error in view edit Page: ",error);
    }  
}

const postEditDetails = async(req,res)=>{
    try{
        console.log("The new review and Rating Details for Edit: ",req.body);
        let updatedReview = req.body.review;
        let updatedRatings = req.body.rating

        let updatedData = await ratingReviewModel.findOne({_id:req.body.id});
        console.log("The existing details that needs to be updated: ",updatedData);

        updatedData.review = updatedReview;
        updatedData.rating = updatedRatings;

        await updatedData.save();

        res.redirect("/ownReviews");

    }catch(error){
        console.log("Error in Editing Process ",error);
    }
}



const allReviewRatings = async (req,res)=>{
    try{
       
        let allReviewRatings = await ratingReviewModel.aggregate([
            {
                $lookup:{
                    from: "movie_details",
                    localField: "movieReviewId",
                    foreignField: "_id",
                    as:"allDetails"  

                },
            },
            {
                $unwind:{
                    path:"$allDetails"
                },
            },
            {
                $project:{
                    createdAt:0,
                    updatedAt:0,
                    'allDetails.createdAt': 0,
                    'allDetails.updatedAt' : 0
                }
            }
        ])
        console.log("All Reviews details including Movie Details: ",allReviewRatings);
        res.render("User/ownReviews",{
            title:'Visit my reviews',
            allData: allReviewRatings
        })

    }catch(error){
        console.log("Failed to merge all details from review and Movie Collection ",error);
    }
    
}

const searchMovieName = async(req,res)=>{
    try{
        console.log("The Movie name Collected from the Home Page: ",req.body.movieName.trim());
        let searchMovie = req.body.movieName.trim();
        let movieDetails = await movieModel.aggregate([
            {
                $match:{movieName:searchMovie}
            }
        ])
        console.log("The Search Movie Details: ",movieDetails);
        
        
        console.log("The Movie id Collected from the Home Page: ",movieDetails[0]._id);
        let mId = movieDetails[0]._id;
        let reviewDetails = await ratingReviewModel.find({movieReviewId:mId});
        console.log("The Review and rating details of the Particular Movie: ",reviewDetails);
        
        res.render("User/searchMovies",{
            title:'search Movie',
            allData: movieDetails,
            reviewData: reviewDetails
        })

    }catch(error){
        console.log("Failed to fetch Search Movie Details ",error);
        
    }
}

const myProfile = async(req,res)=>{
    try{
        console.log("The User Details Collected From Tokens: ",req.user);
        let userDetails = req.user;
       res.render("User/myaccountPage",{
        title:'My Account',
        data:userDetails
       })
    }catch(error){
     console.log("Error in My Profile Page ",error);
     
    }
}

const profileDelete = async(req,res)=>{
    try{
        let userId = req.params.id;
        console.log("The User Id collected From Params for Edit: ",userId);
        
        let deleted_data = await authModel.findOneAndDelete({_id:userId});
        console.log("The Deleted User Account Details: ",deleted_data);
        
        if(deleted_data){
            res.send("Your Account has been Deleted Successfully")
        }
        

    }catch(error){
        console.log("Failed to delete Account Details: ",error);
        
    }
}

const getEditPage = async(req,res)=>{
    try{
        console.log("The Id collected for edit user Details: ",req.params.id);
        let oldData = await authModel.findOne({_id:req.params.id});
        console.log("The user Details who wants to Edit her Profile: ",oldData);
        res.render("User_Auth/editProfile.ejs",{
            title:'Edit Profile',
            Data: oldData
        })
        

    }catch(error){
        console.log("Error in User Profile Editing ",error);
        
    }
}

const editDetails = async(req,res)=>{
    try{
        console.log("The user Details Collected from the Page For edit: ",req.body);
        let oldDetails = await authModel.findOne({_id:req.body.id});
        console.log("The old details of the User: ",oldDetails);

        oldDetails.userName = req.body.username;
        oldDetails.emailId = req.body.email;
        oldDetails.contactNumber = req.body.contact;

        await oldDetails.save();
        console.log("The user Details Edited Successfully");
        
        res.redirect("/editSuccessPage");
        

    }catch(error){
        console.log("Error in user Profile Editing ",error);
        
    }
}

const editSuccessPage = (req,res)=>{
    res.render("User_Auth/editSuccessPage",{
        title:'Account Updated'
    })
}
module.exports = {getAllMovieList,getReviewRatingsPage,postReview,ownReviews,deleteReview,viewEditPage,allReviewRatings,
    postEditDetails,searchMovieName,myProfile,profileDelete,getEditPage,editDetails,editSuccessPage};