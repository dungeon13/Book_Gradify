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
            console.log(err.message)
            req.flash("error","error")
            return res.render("./user/register")
        }else{
            passport.authenticate("local")(req,res,function(){
                console.log(user)
                req.flash("success","Registration Successful....")
                return res.redirect("/books")
            })
        }
    })
})

// login handler
router.get("/login",function(req,res){
    res.render("./user/login")
})

router.post("/login",function(req,res){
    passport.authenticate('local',function(err,user,info){
        if(err){
            req.flash("error","Some Error")
            res.redirect("back")
        }
        if(!user){
            req.flash("error","Invalid username or password")
            res.redirect("/user/login")
        }
        req.logIn(user,function(err){
            if(err){
                req.flash("error","Some error")
                res.redirect("/")
            }else{
                req.flash("success","Logged In successfully")
                res.redirect("/")
            }
        })
    })(req,res)
})
// router.post("/login",passport.authenticate("local",
// {
//     successRedirect:"/books",
//     failureRedirect:"/user/login",
//     error:"Invalid username or password"
// }),
// function(req,res){
// })
/////////////////////////////////////////////////////
// router.get("/login",function(req,res,next){
//     passport.authenticate('local',function(err,user,info){
//         if(err){ return next(err); }
//         if(!user){ return res.redirect('/login')}
//         req.logIn(user,function(err){
//             if(err){
//                 return next(err)
//             }
//             return res.redirect('/books')
//         })
//     })(req,res,next);
// })
/////////////////////////////////////////////////////
//logout handler
router.get("/logout",function(req,res){
    req.logOut()
    req.flash("error","Logged Out.....")
    res.redirect("/books")
})

module.exports = router;