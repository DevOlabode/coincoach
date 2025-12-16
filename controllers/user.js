const User = require('../models/user');

module.exports.userProfile = async (req, res) => {
  try {
    const displayName = req.params.displayName;
    const user = await User.findOne({ displayName });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('user/profile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};