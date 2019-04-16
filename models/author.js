var mongoose = require("mongoose")

var authorSchema = new mongoose.Schema({
    name:{
        type:String,
        lowercase:true
    },
    nationality:{
        type:String,
        lowercase:true
    },
    language:{
        type:Array,
        lowercase:true
    },
    books:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Books"
        }
    ]
})

module.exports = mongoose.model("Authors",authorSchema)