const express = require('express');
const router = express.Router();
const authMiddleware = require('../MiddleWare/authMiddleware');
const{body} = require('express-validator');

const { getAllMovieList, getReviewRatingsPage, postReview, ownReviews, deleteReview, viewEditPage, postEditDetails, searchMovieName, myProfile, profileDelete, getEditPage, editDetails, editSuccessPage} = require('../Controller/userController');
const { userAuth } = require('../Controller/AuthController');


router.get("/allMovies",authMiddleware.authJWT,userAuth,getAllMovieList);
router.get("/ReviewPage/:id/:movieName",authMiddleware.authJWT,userAuth,getReviewRatingsPage);
router.post("/postReview",[body('review',"Your Review text Should be in between 50 to 150 characters").isLength({min:50,max:150})],postReview);

router.get("/viewEditPage/:id",viewEditPage);
router.post("/postEdit",postEditDetails);

router.get("/deleteReview/:id",deleteReview);

router.get("/ownReviews",ownReviews);

router.post("/searchMovie",searchMovieName);

router.get("/myProfile",authMiddleware.authJWT,userAuth,myProfile);
router.get("/myProfileDelete/:id",profileDelete);
router.get("/myProfileEdit/:id",getEditPage);
router.post("/postEditUser",editDetails);

router.get("/editSuccessPage",editSuccessPage)
module.exports = router;