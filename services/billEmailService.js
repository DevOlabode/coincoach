const { transporter } = require('../config/email');
const User = require('../models/user');
const { getPendingNotifications, markAsNotified } = require('./billPredictionService');

/**
 * Sends bill alert email to user
 */
async function sendBillAlertEmail(to, userName, bills) {
    const billListHTML = bills.map(bill => `
        <div style="background: ${bill.isUnusual ? '#fff5f5' : '#f8f9fa'}; 
                    padding: 1rem; 
                    margin-bottom: 1rem; 
                    border-radius: 6px; 
                    border-left: 4px solid ${bill.isUnusual ? '#dc3545' : '#ffc107'};">
            <h3 style="margin: 0 0 0.5rem 0; color: #333;">
                ${bill.isUnusual ? '⚠️' : '📅'} ${bill.billName}
            </h3>
            <p style="font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0; color: ${bill.isUnusual ? '#dc3545' : '#28a745'};">
                $${bill.predictedAmount.toLocaleString()}
            </p>
            ${bill.isUnusual ? `
                <p style="color: #dc3545; font-weight: bold; margin: 0.5rem 0;">
                    ↑ $${Math.abs(bill.deviation).toLocaleString()} higher than average
                </p>
            ` : ''}
            <p style="color: #666; margin: 0.5rem 0; font-size: 0.9rem;">
                <strong>Due:</strong> ${new Date(bill.predictedBillDate).toLocaleDateString()} (${bill.daysUntil} day${bill.daysUntil !== 1 ? 's' : ''})<br>
                <strong>Category:</strong> ${bill.category}<br>
                <strong>Average:</strong> $${bill.averageAmount.toLocaleString()}
            </p>
        </div>
    `).join('');

    const unusualCount = bills.filter(b => b.isUnusual).length;

    return transporter.sendMail({
        from: '"CoinCoach App" <solabode499@gmail.com>',
        to,
        subject: unusualCount > 0 ? 
            `⚠️ Bill Alert: ${unusualCount} Unusual Bill${unusualCount !== 1 ? 's' : ''} Detected` : 
            `💰 Upcoming Bill Reminder: ${bills.length} Bill${bills.length !== 1 ? 's' : ''} Due Soon`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    
                    <h1 style="color: #333; margin-top: 0;">Hi ${userName},</h1>

                    ${unusualCount > 0 ? `
                        <div style="background: #fff5f5; border: 2px solid #dc3545; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
                            <h2 style="color: #dc3545; margin: 0;">⚠️ Unusual Bills Detected</h2>
                            <p style="margin: 0.5rem 0 0 0;">Some bills are significantly higher than usual.</p>
                        </div>
                    ` : ''}

                    <p style="font-size: 16px; color: #555;">
                        You have ${bills.length} bill${bills.length !== 1 ? 's' : ''} coming up in the next few days:
                    </p>

                    ${billListHTML}

                    <a href="https://yourwebsite.com/bills"
                        style="display: inline-block; margin-top: 20px; padding: 12px 20px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        View All Bills
                    </a>

                    <p style="margin-top: 30px; font-size: 14px; color: #777;">
                        💡 Tip: Plan ahead for these upcoming expenses to avoid surprises!
                    </p>

                    <p style="margin-top: 30px; font-size: 14px; color: #777;">
                        — The CoinCoach Team
                    </p>

                </div>
            </div>
        `
    });
}

/**
 * Sends bill alerts to all users with pending notifications
 * Should be called daily
 */
async function sendDailyBillAlerts() {
    try {
        console.log('Starting daily bill alert emails...');
        
        const users = await User.find().select('_id email displayName').lean();
        
        let sentCount = 0;
        let errorCount = 0;

        for (const user of users) {
            try {
                const pendingBills = await getPendingNotifications(user._id);
                
                if (pendingBills.length > 0) {
                    await sendBillAlertEmail(
                        user.email, 
                        user.displayName || 'User', 
                        pendingBills
                    );
                    
                    // Mark as notified
                    const billIds = pendingBills.map(b => b._id).filter(id => id);
                    if (billIds.length > 0) {
                        await markAsNotified(billIds);
                    }
                    
                    sentCount++;
                    console.log(`Sent bill alert to ${user.email} (${pendingBills.length} bills)`);
                }
            } catch (error) {
                console.error(`Failed to send alert to user ${user._id}:`, error);
                errorCount++;
            }
        }

        console.log(`Daily bill alerts complete: ${sentCount} sent, ${errorCount} errors`);
        return { sentCount, errorCount };
    } catch (error) {
        console.error('Error sending daily bill alerts:', error);
        throw error;
    }
}

module.exports = {
    sendBillAlertEmail,
    sendDailyBillAlerts
};