const { transporter } = require('../config/email');

module.exports.sendWelcomeEmail = async function (to, name) {
  return transporter.sendMail({
    from: '"CoinCoach App" <solabode499@gmail.com>',
    to,
    subject: "Welcome to CoinCoach!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <h1 style="color: #333; margin-top: 0;">Hi ${name},</h1>

          <p style="font-size: 16px; color: #555;">
            Thanks for signing up — we're really excited to have you with us!
          </p>

          <p style="font-size: 16px; color: #555;">
            Your account is now active, and you can start exploring everything CoinCoach has to offer.
          </p>

          <a href="https://yourwebsite.com/login"
            style="display: inline-block; margin-top: 20px; padding: 12px 20px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Get Started
          </a>

          <p style="margin-top: 30px; font-size: 14px; color: #777;">
            — The Leumas Team
          </p>

        </div>
      </div>
    `
  });
};