const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewRatings_Schema = new Schema({
    userName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true

    },
    review :{
        type: String,
        required:true
    },
    rating:{
        type:String,
        required: false
    },
    movieReviewId:{
        type:Schema.Types.ObjectId,
        ref: 'movie_details'
    }
},
{
    timestamps:true,
    versionKey:false
}
);

const reviewModel = new mongoose.model('review_details',reviewRatings_Schema);
module.exports = reviewModel;