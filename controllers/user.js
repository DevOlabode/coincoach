const User = require('../models/user');

module.exports.userProfile = async(req, res) =>{
    const user = await User.findById(req.user.id);
    res.render('user/profile', {user});
}