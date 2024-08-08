const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    movieName:{
        type: String,
        required:true
    },
    releaseDate:{
        type:Date,
        required: true
    },
    mainCasts:{
        type:String,
        required: true
    },
    duration:{
        type:String,
        required:true
    },
    movieImages:{
        type:[String],
        required: true
    },
    
    
},{
    timestamps:true,
    versionKey:false
})

const movieModel = new mongoose.model('movie_details',movieSchema);
module.exports= movieModel;