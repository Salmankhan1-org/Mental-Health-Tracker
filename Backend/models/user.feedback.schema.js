const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    feedback:{
        type:String,
        required: true,
        trim: true,
        maxlength: 500
    },

    sentiment:{
        type: String,
        enum: ['positive','negative','neutral'],
        default: 'neutral'
    }

    // isApproved:{
    //     type:Boolean,
    //     default:false
    // }

},{timestamps: true});

feedbackSchema.index({ createdAt: 1, rate: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;