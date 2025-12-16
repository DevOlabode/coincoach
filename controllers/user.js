const Transaction = require('../models/transactions');
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

module.exports.deleteAcct = async (req, res)=>{
    const displayName = req.params.displayName;
    const user = await User.findByIdAndDelete(req.user._id);
    const transactions = await Transaction.deleteMany({user: req.user._id});
    req.logout(err=>{
        if(err) return next(err);
        req.flash('success', "Your account has been successfully deleted");
        res.redirect('/')
    })
}