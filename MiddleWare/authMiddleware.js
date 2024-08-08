const jwt = require('jsonwebtoken');

class auth_Jwt{
    async authJWT(req,res,next){
        try{
             console.log("The MiddleWare data: ", req.cookies.Token_Data);
            if(req.cookies && req.cookies.Token_Data){
                jwt.verify(req.cookies.Token_Data,process.env.SECRET_KEY,(error,data)=>{
                    console.log("Verifying Cookie data: ",data);
                    req.user = data;
                    next();
                })
            }else{
                next();
            }

        }catch(error){
            console.log("Error in Jwt Token Verification: ",error);
        }
    }
}


module.exports =  new auth_Jwt();