const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type : {
        type : String,
        enum : ['expense', 'income'],
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    date : {
        type : Date,
        required : true,
        default : Date.now
    },
    category : {
        type : String,
        required : true
    }    
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);