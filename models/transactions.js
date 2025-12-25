const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name : {
        type : String,
        required : false
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
    currency : {
        type : String,
        required : true,
        default : 'CAD'
    },
    convertedAmount : {
        type : Number,
        reqiured : true,
        default : function() { return this.amount; } 
    },
    date : {
        type : Date,
        required : true,
        default : Date.now
    },
    category : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : false
    },
    recurring : {
        type : Boolean,
        required : false,
        default : false
    },
    inputMethod : {
        type : String,
        required : true,
        default : 'manual',
        enum : ['manual', 'CSV', 'JSON', 'receipt', 'AI']
    },   
    recurrence : {
        type : String,
        enum : ['daily', 'weekly', 'monthly', 'yearly', 'hourly'],
        required : function() { return this.recurrring; }
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);