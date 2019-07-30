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
var flash = require("connect-flash")

mongoose.set('useNewUrlParser',true)
mongoose.set('useCreateIndex',true)
app.use(bodyParser.urlencoded({extended:true}))
app.use(flash());
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
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
})

app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs")
mongoose.connect("mongodb+srv://casanova:casanova%4012345@bookgradify-snu4a.mongodb.net/test?retryWrites=true",{useNewUrlParser:true})


// Routes
app.get("/demo",function(req,res){
    res.render("extras/demo")
    
})
app.post("/books/:id",function(req,res){
    Book.findById(req.params.id,function(err,book){
        if(err){
            console.log(err)
            req.flash("error","SomeThing Went Wrong")
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
                    req.flash("error","SomeThing Went Wrong")
                    res.redirect("/")
                }else{
                    Rating.findOne({user:req.user._id},function(err,ratinginfo){
                        if(err){
                            console.log("error")
                            console.log(err)
                            req.flash("error","SomeThing Went Wrong")
                            res.redirect("/")
                        }else{
            
                            if(ratinginfo == null){
                                console.log("null")
                                var user = req.user._id
                                console.log("before rating create")
                                Rating.create({user:req.user._id},function(err,created){
                                    if(err){
                                        console.log("error in creating rate")
                                        console.log(err)
                                        req.flash("error","SomeThing Went Wrong")
                                        res.redirect("back")
                                    }else{
                                        console.log("Rating created")
                                        created.book.push(req.params.id)
                                        created.rating.push(ratinggot)
                                        created.save()
                                        req.flash("success","Rating Done....")
                                        res.redirect("back")
                                    }
                                })
                            }
                            else{
                                        console.log("user find in")
                                        ratinginfo.book.push(req.params.id)
                                        ratinginfo.rating.push(ratinggot)
                                        ratinginfo.save()
                                        req.flash("success","Rating Done.....")
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

app.get("/test",function(req,res){
    console.log(req.body)
    res.redirect("/")
})
app.post("/search",function(req,res){
    var category = req.body.search.category
    var name = req.body.search.name
    if(category=="book"){
        Book.find({name:{ $regex:'.*' + name + '.*' }},function(err,info){
            console.log(info)
            // res.redirect("/")
            res.render("extras/search",{info:info,category:category})
        })
    }else if(category=="author"){
        Author.find({name:{ $regex:'.*' + name + '.*' }},function(err,info){
            console.log(info)
            res.render("extras/search",{info:info,category:category})
        })
    }else if(category=="category"){
        Book.find({genre:{ $regex:'.*' + category + '.*' }},function(err,info){
            console.log(info)
            res.render("extras/search",{info:info,category:category})
        })
    }
    // res.redirect("/")
})


app.get("/",function(req,res){
    res.redirect("/books")
})
app.use("/books/:id/reviews",reviewsRoutes)
app.use("/books",bookRoutes);
app.use("/authors",authorRoutes)
app.use("/user",userRoutes)



app.listen(process.env.PORT, process.env.IP);
