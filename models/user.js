const mongoose = require('mongoose');
const _plm = require('passport-local-mongoose');
const passportLocalMongoose = (typeof _plm === 'function') ? _plm : (_plm && _plm.default) ? _plm.default : _plm;
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName : {
    type : String,
    required: true,
  },
  displayName : {
    type: String,
    required: false,
  },
  preferredCurrency : {
    type: String,
    required: false,
    default: 'CAD'
  },
  bio : {
    type: String,
    required : false,
    default: ''
  },
  location : {
    type: String,
    required : false,
    default: ''
  },
  accountCreatedAt : {
    type: Date,
    default: Date.now
  },
  resetCode: {
        type: String,
        required: false
  },
  resetCodeExpires: {
      type: Date,
      required: false,
      index: { expires: 0 }
  },
});

userSchema.plugin(passportLocalMongoose, { 
  usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);

/*
Potential Things to add to the schema :
- profile picture upload or take picture from webcam
- social media links
- badges /achievement
- transaction history (could be in a separate model)
- notification preferences
*/
