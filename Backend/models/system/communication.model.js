const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: { 
        type: String,
        enum: ['general', 'report_inquiry', 'warning', 'training'],
        default: 'general'
    },
    // relatedReport: { 
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Report', 
    //     required: false
    // },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: { 
        type: String,
        enum: ['sent', 'delivered', 'failed'],
        default: 'sent'
    }
}, { timestamps: true });


communicationSchema.index({ sender: 1, receiver: 1 });

const Communication = mongoose.model('Communication', communicationSchema);
module.exports = Communication;