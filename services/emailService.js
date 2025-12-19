const {transporter} = require('../config/email');

module.exports.sendWelcomeEmail = async function(to, name) {
  return transporter.sendMail({
    from: '"Leumas App" <solabode499@gmail.com>',
    to,
    subject: "Welcome to Leumas!",
    html: `<h1>Hi ${name},</h1><p>Thanks for signing up. We're excited to have you!</p>`
  });
}
