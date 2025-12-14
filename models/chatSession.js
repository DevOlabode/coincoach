const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSessionSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    title : {
        type : String,
        required : true
    },
    messages : [{
        type : Schema.Types.ObjectId,
        ref : 'ChatMessage'
    }]
}, {timestamps : true});

module.exports = mongoose.model('ChatSession', chatSessionSchema);