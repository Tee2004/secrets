//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email:String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"] });

const User = new mongoose.model("User", userSchema);


app.get("/", function(req,res){
    res.render("home");
});   

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});


app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password:req.body.password
    });
    

newUser.save()
.then(() => {
  console.log('User saved successfully!');
  // Do something else, if necessary
  res.render("secrets");
})
.catch((err) => {
  console.error(err);
  // Handle the error appropriately
});
});

app.post("/login", async(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = await User.findOne({ email: username }).exec();
try {
  if (foundUser && foundUser.password === password) {
    res.render("secrets");
  } else {
    // Handle incorrect username or password
    res.status(401).send("Invalid username or password");
  }
} catch (err) {
  console.error(err);
  // Handle error
  res.status(500).send("An error occurred");
}
});



app.listen(3000, function(){
    console.log("server started on port 3000")
});
    

