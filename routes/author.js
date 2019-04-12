var express = require("express")
var router = express.Router();
var Author  = require("../models/author");

router.get("/",function(req,res){
    res.render("./author/authors")
})

router.get("/new",function(req,res){
    res.render("./author/newAuthor")
})
router.post("/",function(req,res){
    Author.create(req.body.author,function(err,info){
        if(err){
            console.log(err)
            res.redirect("back")
        }else{
            console.log("Created: "+info)
            res.redirect("/authors")
        }
    })
})

module.exports = router