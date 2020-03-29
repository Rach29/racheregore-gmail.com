//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
//replace code with Hashing way of password
//const encrypt = require("mongoose-encryption");
// #3 install bcrypt instead-const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/usersDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: "String",
    password: "String"
});

//remove code and use hashing way of password instead
//userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);


app.get("/",function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
       const newUser = new User({
        email: req.body.username,
        password: hash
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets")
        }
    }); 
 });
});
    
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username},function(err, foundUser){
       if(err){
           console.log(err)
       }else{
           if(foundUser){
               bcrypt.compare(password, foundUser.password, function(err, result){
                   res.render("secrets");
               });
           }
       }
    });
});







app.listen("3000",function(){
    console.log("Server start on port 3000")
})
