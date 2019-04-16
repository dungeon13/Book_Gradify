var express = require("express")
var router = express.Router();
var Author  = require("../models/author");

router.get("/",function(req,res){
    Author.find({},function(err,authors){
        if(err){
            console.log(err)
        }else{
            
            res.render("./author/authors",{authors:authors})
        }
    })
    
})
router.get("/detail/:id",function(req,res){
    Author.findById(req.params.id,function(err,author){
        if(err){
            console.log(err)
        }else{
            res.render("./author/authordetail",{author:author})
        }
    })
    
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
            
            res.redirect("/authors")
        }
    })
})

module.exports = router