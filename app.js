var express = require("express");
var app = express()
var Book = require("./models/book")
var Author = require("./models/author")
var User = require("./models/user")
var Review = require("./models/reviews")
var Rating = require("./models/rating")
var mongoose = require("mongoose")
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var LocalStrategy = require("passport-local")
var passport = require("passport")

mongoose.set('useNewUrlParser',true)
mongoose.set('useCreateIndex',true)
app.use(bodyParser.urlencoded({extended:true}))
//Routes
var reviewsRoutes = require("./routes/reviews")
var bookRoutes = require("./routes/book")
var authorRoutes = require("./routes/author")
var userRoutes = require("./routes/user")

app.use(methodOverride("_method"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"secret text",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// passing info to all pages
app.use(function(req,res,next){
    res.locals.currentUser = req.user
    next();
})

app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs")
mongoose.connect("mongodb://localhost/book_gradify",{useNewUrlParser:true})


// Routes
app.get("/demo",function(req,res){
    res.render("extras/demo")
    
})
app.post("/books/:id",function(req,res){
    Book.findById(req.params.id,function(err,book){
        if(err){
            console.log(err)
            res.redirect("/")
        }else{
            var ratinggot = req.body.star
            var total = parseInt(book.rating.total)
            var totalnow = parseFloat(book.rating.numofrate*total) + parseInt(ratinggot)
            var number = parseInt(book.rating.numofrate) + 1
            total = parseFloat(totalnow/number)
            var condition = {
                rating:{
                    numofrate:number,
                    total:total
                }
            }
            
            Book.findByIdAndUpdate(req.params.id,condition,function(err,info){
                if(err){
                    console.log(err)
                }else{
                    Rating.findOne({user:req.user._id},function(err,ratinginfo){
                        if(err){
                            console.log("error")
                            console.log(err)
                        }else{
            
                            if(ratinginfo == null){
                                console.log("null")
                                var user = req.user._id
                                console.log("before rating create")
                                Rating.create({user:req.user._id},function(err,created){
                                    if(err){
                                        console.log("error in creating rate")
                                        console.log(err)
                                        res.redirect("back")
                                    }else{
                                        console.log("Rating created")
                                        created.book.push(req.params.id)
                                        created.rating.push(ratinggot)
                                        created.save()
                                        res.redirect("back")
                                    }
                                })
                            }
                            else{
                                        console.log("user find in")
                                        ratinginfo.book.push(req.params.id)
                                        ratinginfo.rating.push(ratinggot)
                                        ratinginfo.save()
                                        res.redirect("back")
                            }
                        }
                    })
                    // book.rating.userid.push(req.user._id)
                    // book.save()
                    
                }
            })
            
        }
    })
    
})

app.post("/test",function(req,res){
    console.log(req.body.input)
    res.redirect("/")
})
app.post("/search",function(req,res){
    var query = new RegExp("^"+req.body.name);
        Book.findOne({name:query},function(err,book){
            if(err){
                console.log(err)
            }else{
                console.log(book)
                res.render("extras/search",{book:book})
            }
        })
        // console.log(req.body.name)
        // res.render("extras/search")
})


app.get("/",function(req,res){
    res.redirect("/books")
})
app.use("/books/:id/reviews",reviewsRoutes)
app.use("/books",bookRoutes);
app.use("/authors",authorRoutes)
app.use("/user",userRoutes)



app.listen(8080,function(){
    console.log("Server is listening.........")
})
