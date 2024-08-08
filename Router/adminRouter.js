const express = require('express');
const router = express.Router();

const multer = require('multer');
const Path = require('path');
const {getAddMovie, postMovie} = require('../Controller/adminController');
//Multer Storage Setup:
const fileStorage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,Path.join(__dirname,"..","uploads","movieImages"),(error,data)=>{
            if(error) throw error;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(error,data)=>{
            if(error) throw error;
        })
    }
 }
);

//Multer File filter Setup;
const fileFilter =(req,file,callback)=>{
    if(
        file.mimetype.includes('jpg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('jpeg')||
        file.mimetype.includes('webp') ||
        file.mimetype.includes('AVIF')
    ){
        callback(null,true);
    }else{
        callback(null,false);
    }
}

const uploads = multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1024*1024*5}
});

const upload_type = uploads.array('movieImages',2);

router.get("/addMovie",getAddMovie);
router.post("/postMovie",upload_type,postMovie);

module.exports = router;

