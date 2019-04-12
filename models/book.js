var mongoose = require("mongoose")

var bookSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    language:String,
    rating:String,
    genre:String,
    buylink:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Authors"
        },
        authorname:String
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})

module.exports = mongoose.model("Books",bookSchema);