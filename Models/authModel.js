const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authModel = new Schema({
    userName:{
        type: String,
        required: true
    },
    emailId:{
        type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true,
    versionKey:false
});

const authenticationModel = new mongoose.model('Auth_Details',authModel);
module.exports = authenticationModel;