const mongoose = require('mongoose')


const topicSchema = new mongoose.Schema({
   
    title:{
      type :String,
      unique: true,
    },
    price:{
      type: Number,
      trim: true,
      required: false,
      default:100
  },
    images: Object,
    description: String,
    numReviews:{
      type:Number,
      default:0
    },
    rating:{
        type:Number,
        default:0
      } 
}, {
    timestamps: true
})


module.exports = mongoose.model('Topics',topicSchema)