const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSchema = new Schema({
    relation: {
        type: String,
        required: [true, "Table Relation is required."]
    },
    email: {
        type: String,
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Please enter a valid email address."
        ]
    },
    internetProtocolAddress: {
        type: String,
        required: [true, "Internet protocol address is required."]
    },
    status: {
        type: String,
        required: [true, "Status message is required."],
        enum: ["success", "failed"]
    },
    message: {
        type: String,
        required: false
    },
    content: {
        type: Object,
        required: false
    }
},{timestamps: true});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;