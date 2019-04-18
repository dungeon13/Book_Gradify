var middlewareObj = {}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error","You need to be LogIn First")
    res.redirect("/user/login")
}
module.exports = middlewareObj;