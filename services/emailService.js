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

module.exports.sendPasswordResetEmail = async function (to, displayName, resetCode) {
  return transporter.sendMail({
    from: '"CoinCoach App" <solabode499@gmail.com>',
    to,
    subject: "CoinCoach Password Reset",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">

    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>

    <p style="font-size: 15px; color: #555;">
      Hi <strong>${displayName}</strong>,
    </p>

    <p style="font-size: 15px; color: #555;">
      We received a request to reset your CoinCoach account password.  
      Use the verification code below to complete the process.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; padding: 15px 25px; background: #007bff; color: #ffffff; font-size: 24px; letter-spacing: 3px; border-radius: 6px;">
        <strong>${resetCode}</strong>
      </div>
    </div>

    <p style="font-size: 14px; color: #777; margin-top: 30px;">
      If you didn’t request this, you can safely ignore this email.  
      Your password will remain unchanged.
    </p>

    <p style="font-size: 14px; color: #777;">
      — The CoinCoach Team
    </p>

  </div>
</div>
        `,  
  });
};


module.exports.sendGoalCompletionEmail = async function (to, userName, goalTitle, targetAmount) {
  return transporter.sendMail({
    from: '"CoinCoach App" <solabode499@gmail.com>',
    to,
    subject: "🎉 Congratulations! You've Completed Your Financial Goal!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <div style="text-align: center; margin-bottom: 2rem;">
            <h1 style="color: #28a745; font-size: 2.5rem; margin: 0;">🎉</h1>
            <h1 style="color: #333; margin-top: 0.5rem;">Congratulations, ${userName}!</h1>
          </div>

          <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px;">
            <p style="margin: 0; color: #155724; font-size: 1.1rem;">
              <strong>You've successfully completed your goal:</strong><br>
              "${goalTitle}"
            </p>
          </div>

          <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 1.5rem;">
            <p style="font-size: 0.9rem; color: #6c757d; margin: 0 0 0.5rem 0;">Target Amount Achieved</p>
            <p style="font-size: 2.5rem; font-weight: bold; color: #28a745; margin: 0;">
              $${targetAmount.toLocaleString()}
            </p>
          </div>

          <p style="font-size: 16px; color: #555;">
            This is a huge accomplishment! Your dedication and financial discipline have paid off.
          </p>

          <p style="font-size: 16px; color: #555;">
            Keep up the great work and consider setting your next financial goal to continue building your financial future.
          </p>

          <a href="https://yourwebsite.com/goals"
            style="display: inline-block; margin-top: 20px; padding: 12px 20px; background: #28a745; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Your Goals
          </a>

          <p style="margin-top: 30px; font-size: 14px; color: #777;">
            — The CoinCoach Team
          </p>

        </div>
      </div>
    `
  });
};