const Transaction = require('../models/transactions');
const Goals = require('../models/goals');
const User = require('../models/user');

module.exports.userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const TransactionCount = await Transaction.countDocuments({userId: req.user._id});
    const GoalCount = await Goals.countDocuments({userId: req.user._id});

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('user/profile', { user, TransactionCount, GoalCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports.editProfileForm = async(req, res)=>{
  const user = await User.findById(req.user._id);
  res.render('user/editProfile', {user});
};

module.exports.editAccountForm = async (req, res) =>{
  const user = await User.findById(req.user._id);
  res.render('user/editAcct', {user});
};

module.exports.editProfile = async(req, res)=>{
  const {displayName, preferredCurrency, location, bio, fullName} = req.body;
  const user = await User.findById(req.user._id);
  user.displayName = displayName;
  user.preferredCurrency = preferredCurrency;
  user.location = location;
  user.bio = bio;
  user.fullName = fullName;

  await user.save();
  req.flash('success', 'Profile updated successfully');
  res.redirect(`/user/${user.displayName}`);
};

module.exports.editAccount = async( req, res)=>{
  const {currentPassword, newPassword, confirmPassword} = req.body;
  const user = await User.findById(req.user._id);

  if(newPassword !== confirmPassword){
    req.flash('error', 'New password and confirmation do not match');
    return res.redirect('/user/edit-account');
  }

  if(currentPassword === newPassword){
    req.flash('error', 'New password must be different from current password');
    return  res.redirect('/user/edit-account');
  }

  const result = await user.changePassword(currentPassword, newPassword);
  if(result){
    await user.save();
    req.flash('success', 'Password updated successfully');
    res.redirect(`/user/${user.displayName}`);
  } else{
    req.flash('error', 'Current password is incorrect');
    res.redirect('/user/edit-account');
  }
};

module.exports.completeProfileForm = async (req, res) =>{
  const user = await User.findById(req.user._id);
  res.render('user/completeProfile', {user});
};

module.exports.completeProfile = async (req, res) =>{
  const {sendWelcomeEmail} = require('../services/emailService'); 
  const {displayName, preferredCurrency, location, bio} = req.body;
  const user = await User.findById(req.user._id);
  user.displayName = displayName;
  user.preferredCurrency = preferredCurrency;
  user.location = location;
  user.bio = bio;

  await user.save();
  
  sendWelcomeEmail(user.email, user.displayName);
  req.flash('success', 'Profile completed successfully');
  res.redirect('/');
};

module.exports.deleteAcct = async (req, res)=>{
    const displayName = req.params.displayName;
    await Transaction.deleteMany({userId: req.user._id});
    await User.findByIdAndDelete(req.user._id);
    req.logout(err=>{
        if(err) return next(err);
        req.flash('success', "Your account has been successfully deleted");
        res.redirect('/')
    })
};