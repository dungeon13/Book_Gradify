var mongoose = require("mongoose")

var bookSchema = new mongoose.Schema({
    name:{
        type:String,
        lowercase:true
    },
    image:String,
    description:String,
    language:String,
    rating:{
        numofrate:{
            type:Number,
            default:0
        },
        total:{
            type:Number,
            default:0
        }
    },
    genre:{
        type:String,
        lowercase:true
    },
    buylink:String,
    author:{
        // id:{
        //     type:mongoose.Schema.Types.ObjectId,
        //     ref:"Authors"
        // }
        type:String,
        lowercase:true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})

bookSchema.methods.findSimiliarTypes = function(book){
    return this.model('Books').find({type: this.type},book)
}

module.exports = mongoose.model("Books",bookSchema);