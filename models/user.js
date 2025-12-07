const mongoose = require('mongoose');
const _plm = require('passport-local-mongoose');
const passportLocalMongoose = (typeof _plm === 'function') ? _plm : (_plm && _plm.default) ? _plm.default : _plm;
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passportLocalMongoose, { 
  usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);