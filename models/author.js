var mongoose = require("mongoose")

var authorSchema = new mongoose.Schema({
    name:String,
    nationality:String,
    language:Array,
    books:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Books"
        }
    ]
})

module.exports = mongoose.model("Authors",authorSchema)