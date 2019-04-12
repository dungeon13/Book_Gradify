var express = require("express")
var router = express.Router()
var Book = require("../models/book")
var Author = require("../models/author")

router.get("/",function(req,res){
    Book.find({},function(err,allbooks){
        if(err){
            console.log("Error while finding books")
        }else{
            res.render("./index",{allbooks})
        }
    })
})
router.get("/new",function(req,res){
    res.render("./books/new")
})
router.post("/",function(req,res){
    
    Book.create(req.body.book,function(err,info){
        if(err){
            console.log("Some error")
        }else{
            
            // Author.create()
            console.log(req.body.book.author)
            console.log("Created:  "+info)
            res.redirect("/books")
        }
    })

})
router.get("/:id",function(req,res){
    Book.findById(req.params.id).populate("reviews").exec(function(err,foundBook){
        if(err){
            console.log(err);
            res.redirect("back")
        }else{
            Book.find({genre:foundBook.genre},function(err,books){
                if(err){
                    console.log(err)
                    res.redirect("back")
                }else{
                    foundBook.reviews.forEach(function(review){
                        var date = new String(review.date)
                        console.log(date.split(" ")[0])
                    })
                    res.render("./books/show",{foundBook:foundBook,books:books})
                }
            })
            
        }
    })
})





module.exports = router;