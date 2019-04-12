var mongoose = require("mongoose")

var rateSchema = new mongoose.Schema({
    user:{
        id:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    book:{
        id:mongoose.Schema.Types.ObjectId,
        ref:"Books"
    },
    rating:{
        type:String,
        required:true
    }
})

module.exports = mongoose.Model("Ratings",rateSchema)