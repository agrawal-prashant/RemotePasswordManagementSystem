require("dotenv").config()
const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const cookieParser=require("cookie-parser");
const flash=require("connect-flash");
const homeRoute=require('./routes/homeRoute');
const registerRoute=require('./routes/registerRoute');
const loginRoute=require('./routes/loginRoute');
const forgetRoute=require('./routes/forgetRoute');

const app=express();

const cors=require('cors');
app.use(cors());

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser(process.env.SESSION_COOKIES_SECRET_KEY));
app.use(session({ secret: process.env.SESSION_COOKIES_SECRET_KEY,resave: false,saveUninitialized: false,}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req,res,next){
    res.locals.sorry_msg=req.flash("sorry_msg");
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

mongoose
.connect(process.env.MONGODB_URIS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
.then(() => console.log("MongoDB Connection Successfull...!!"))
.catch(() => console.log("Error, Not Connected with MongoDB"));

require('./controller/passport')(passport);
app.use('/',homeRoute);
app.use('/register',registerRoute);
app.use('/login',loginRoute);
app.use('/forget',forgetRoute);
app.all('*',(req,res)=> {
    res.render('error404');
});

const PORT = process.env.PORT || 3000 
app.listen(PORT,function() {
    console.log("server is listening at port "+PORT);
})
