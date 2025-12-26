const mongoose = require('mongoose');
const { Schema } = mongoose;

const GoalSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    title : {
        type : String,
        required : true,
        trim : true
    },
    targetAmount : {
        type : Number,
        required : true,
        min : 0
    },
    currentAmount : {
        type : Number,
        default : 0,
        min : 0
    },
    completed :  {
        type : Boolean,
        required : true,
        default : false
    }
},{timestamps : true});

GoalSchema.virtual("progress").get(function () {
    if (!this.targetAmount || this.targetAmount === 0) return 0;
    return (this.currentAmount / this.targetAmount) * 100;
  });
  
GoalSchema.set("toJSON", { virtuals: true });
GoalSchema.set("toObject", { virtuals: true });
  
module.exports = mongoose.model("Goal", GoalSchema);
  