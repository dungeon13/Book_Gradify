var express = require("express");
var app = express()
var Book = require("./models/book")
var Author = require("./models/author")
var User = require("./models/user")
var Review = require("./models/reviews")
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
    res.render("./books/carousel")
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
