var express = require("express")
let router = express.Router({mergeParams: true});
var Review = require("../models/reviews")
var Books = require("../models/book")
var Author = require("../models/author")
var middleware = require("./middlewares")

router.get("/new",middleware.isLoggedIn,function(req,res){
    Books.findById(req.params.id,function(err,book){
        if(err){
            console.log(err)
        }else{
            console.log(req.params)
            res.render("./comments/newcomments",{book:book})
        }
    })
})

router.post("/",function(req,res){
    Books.findById(req.params.id,function(err,book){
        if(err){
            console.log(err)
            res.redirect("back")
        }else{
            Review.create(req.body.review,function(err,review){
                if(err){
                    console.log(err)
                    res.redirect("back")
                }
                else{
                    review.author.id = req.user._id
                    review.author.username = req.user.username
                    review.save()
                    book.reviews.push(review)
                    book.save()
                    res.redirect("/books/"+book._id)
                }
            })
        }
    })
})
module.exports = router;