const movieModel = require('../Models/movieModel');

const getAddMovie = (req,res)=>{
    res.render("admin/addMovie",{
        title:'Add Movie Page'
    })
}

const postMovie = async(req,res)=>{
    try{
        console.log("The Movie Details Collected From the Page: ", req.body,req.files);
        let imageArray = req.files.map(values=>{
            return values.originalname;
        });
        console.log("The Movie Images Collected in the array: ",imageArray);

        let formData = new movieModel({
            movieName: req.body.movieName,
            releaseDate: req.body.releaseDate,
            mainCasts: req.body.mainCasts,
            duration: req.body.duration,
            movieImages: imageArray
        });
        let saveData =  await formData.save();

        if(saveData){
            console.log("The Movie Details are Saved Successfully");
            res.redirect("/");
        }

    }catch(error){
        console.log("Failed To save Movie Details in the database ",error);
    }
}


module.exports ={getAddMovie,postMovie}