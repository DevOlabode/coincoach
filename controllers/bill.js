const BillPrediction = require('../models/billsPredictor');
const { generateBillPredictions, getPendingNotifications } = require('../services/billPredictionService');

module.exports.billDashboard = async (req, res) => {
    try {
        // Get all predictions for user
        const predictions = await BillPrediction.find({ userId: req.user._id })
            .sort({ predictedBillDate: 1 })
            .lean();

        // Calculate daysUntil for each prediction and filter
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const predictionsWithDays = predictions.map(pred => {
            const predDate = new Date(pred.predictedBillDate);
            predDate.setHours(0, 0, 0, 0);
            const daysUntil = Math.ceil((predDate - today) / (1000 * 60 * 60 * 24));
            return { ...pred, daysUntil };
        }).filter(pred => pred.daysUntil >= 0); // Only future bills

        // Separate into upcoming and unusual bills
        const upcomingBills = predictionsWithDays.filter(p => p.daysUntil <= 7);
        const unusualBills = predictionsWithDays.filter(p => p.isUnusual);

        res.render('bills/dashboard', { 
            predictions: predictionsWithDays, 
            upcomingBills, 
            unusualBills 
        });
    } catch (error) {
        console.error('Error loading bill dashboard:', error);
        req.flash('error', 'Failed to load bill predictions');
        res.redirect('/transactions');
    }
};

module.exports.generatePredictions = async (req, res) => {
    try {
        const predictions = await generateBillPredictions(req.user._id);
        
        req.flash('success', `Generated ${predictions.length} bill prediction(s)`);
        res.redirect('/bills');
    } catch (error) {
        console.error('Error generating predictions:', error);
        req.flash('error', 'Failed to generate bill predictions');
        res.redirect('/bills');
    }
};

module.exports.getNotifications = async (req, res) => {
    try {
        const notifications = await getPendingNotifications(req.user._id);
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

module.exports.dismissPrediction = async (req, res) => {
    try {
        const { id } = req.params;
        
        await BillPrediction.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { notified: true }
        );

        req.flash('success', 'Notification dismissed');
        res.redirect('/bills');
    } catch (error) {
        console.error('Error dismissing prediction:', error);
        req.flash('error', 'Failed to dismiss notification');
        res.redirect('/bills');
    }
};