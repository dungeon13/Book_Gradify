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

router.post("/",function(req,res){
    var obj = req.body.book
    // obj[author] = 
    Book.create(req.body.book,function(err,info){
        if(err){
            console.log("Some error")
        }else{
            Author.findById(req.body.book.authorid,function(err,author){
                author.books.push(info)
                author.save()
                console.log("Created:  "+info._id)
                res.redirect("/books")
            })
            //  Author.update(
            //     {_id:req.body.book.authorid},
            //     {$push:{books:info._id}},
            //     done
            //  );
            
        }
    })

})
router.get("/new",function(req,res){
    Author.find({},function(err,authors){
        if(err){
            console.log(err)
        }else{
            res.render("./author/selectauthor",{authors:authors})
        }
    })
    
})
router.get("/new/:id/book",function(req,res){
    Author.findById(req.params.id,function(err,author){
        if(err){
            console.log(err)
        }else{
            res.render("./books/new",{author:author})
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
                    
                    res.render("./books/show",{foundBook:foundBook,books:books})
                    
                }
            })
            
        }
    })
})





module.exports = router;