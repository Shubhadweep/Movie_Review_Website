require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const authRouter = require('./Router/AuthRouter');
const adminRouter = require('./Router/adminRouter');
const userRouter = require('./Router/userRouter');
const cookie = require('cookie-parser');
   
const Server = express();
const Path = require('path');
const PORT = process.env.PORT || 5900;

Server.set('view engine','ejs');
Server.set('views','View');
   

Server.use(express.static(Path.join(__dirname,'Public')));
Server.use(express.static(Path.join(__dirname,'uploads')));
Server.use(express.urlencoded({extended:true}));

Server.use(flash());
Server.use(session({
    secret:'Project-Secret-Key',
    saveUninitialized:false,
    resave:false
}))
Server.use(cookie());
Server.use(authRouter);
Server.use(adminRouter);
Server.use(userRouter);

mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("The DataBase is Connected Successfully");
    Server.listen(PORT,()=>{
        console.log(`The Server is running at http://localhost${PORT}/`);
    })

}).catch(error=>{
    console.log("Failed To Connect With the Database",error);
});   





