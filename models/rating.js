var mongoose = require("mongoose")

var rateSchema = new mongoose.Schema({
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
    },
    book:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Books"
        }
    ],
    rating:[
        {
            type:String
        }
    ]
})

module.exports = mongoose.model("Ratings",rateSchema)