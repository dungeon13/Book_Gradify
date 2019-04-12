var express = require("express")
var router  = express.Router()
var User = require("../models/user")
var passport = require("passport")

//sign up handler
router.get("/signup",function(req,res){
    res.render("./user/register")
})

router.post("/signup",function(req,res){
    var newUser = new User({username:req.body.username,email:req.body.email});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log("Error in: "+err)
            return res.render("./user/register")
        }else{
            passport.authenticate("local")(req,res,function(){
                console.log(user)
                res.redirect("/books")
            })
        }
    })
})

// login handler
router.get("/login",function(req,res){
    res.render("./user/login")
})

router.post("/login",passport.authenticate("local",
{
    successRedirect:"/books",
    failureRedirect:"/user/login"
}),
function(req,res){})

//logout handler
router.get("/logout",function(req,res){
    req.logOut()
    res.redirect("/books")
})

module.exports = router;