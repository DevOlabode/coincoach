const Transaction = require('../models/transactions');
const Insight = require('../models/insights');
const generateInsights = require('../utils/generateInsights');
const PDFDocument = require('pdfkit');
const { calculateOpportunityCost } = require('../services/opportunityCostService');

module.exports.allInsights = async (req, res) => {
    try {
        // Get the most recent insight for the user
        const latestInsight = await Insight.findOne({ userId: req.user._id })
            .sort({ generatedAt: -1 })
            .lean();
        
        // Calculate opportunity cost
        const opportunityCost = await calculateOpportunityCost(req.user._id);
        
        if (!latestInsight) {
            // Check if user has transactions
            const transactionCount = await Transaction.countDocuments({ userId: req.user._id });
            
            if (transactionCount === 0) {
                return res.render('insights/all', { 
                    insight: null,
                    opportunityCost: null,
                    message: 'No transactions found. Add some transactions to generate insights.'
                });
            }
            
            // Generate insights if transactions exist but no insights
            try {
                const newInsight = await generateInsights(req.user._id);
                return res.render('insights/all', { 
                    insight: newInsight.toObject(),
                    opportunityCost,
                    message: undefined
                });
            } catch (error) {
                return res.render('insights/all', { 
                    insight: null,
                    opportunityCost,
                    message: error.message || 'Failed to generate insights. Please try again.'
                });
            }
        }
        
        res.render('insights/all', { 
            insight: latestInsight,
            opportunityCost,
            message: undefined
        });
    } catch (error) {
        console.error('Error in allInsights:', error);
        req.flash('error', 'Failed to load insights');
        res.redirect('/transactions');
    }
};

module.exports.generateInsights = async (req, res) => {
    try {
        const insight = await generateInsights(req.user._id);
        req.flash('success', 'Insights generated successfully!');
        res.redirect('/insights');
    } catch (error) {
        req.flash('error', error.message || 'Failed to generate insights');
        res.redirect('/transactions');
    }
};

module.exports.downloadPDF = async (req, res) => {
    try {
        // Get the most recent insight for the user
        const insight = await Insight.findOne({ userId: req.user._id })
            .sort({ generatedAt: -1 })
            .lean();

        if (!insight) {
            req.flash('error', 'No insights available to download');
            return res.redirect('/insights');
        }

        // Get opportunity cost data
        const opportunityCost = await calculateOpportunityCost(req.user._id);

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=CoinCoach_Insights_${new Date().toISOString().split('T')[0]}.pdf`
        );

        // Pipe PDF to response
        doc.pipe(res);

        // Helper function to add section
        const addSection = (title, content, isSubsection = false) => {
            if (!isSubsection) {
                doc.moveDown(0.5);
                doc.fontSize(16).font('Helvetica-Bold').text(title, { underline: true });
                doc.moveDown(0.3);
            } else {
                doc.fontSize(12).font('Helvetica-Bold').text(title);
                doc.moveDown(0.2);
            }
            doc.fontSize(10).font('Helvetica').text(content);
            doc.moveDown(0.3);
        };

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('📊 Financial Insights Report', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date(insight.generatedAt).toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(1);

        // Summary
        if (insight.summary) {
            addSection('Executive Summary', insight.summary);
        }

        // Opportunity Cost Analysis
        if (opportunityCost && opportunityCost.monthlyDiscretionary > 0) {
            doc.fontSize(14).font('Helvetica-Bold').text('💰 Opportunity Cost Analysis', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            doc.text(`Monthly Discretionary Spending: $${opportunityCost.monthlyDiscretionary.toLocaleString()}`);
            doc.text(`Annual Discretionary Spending: $${opportunityCost.annualDiscretionary.toLocaleString()}`);
            doc.moveDown(0.3);
            doc.text('If invested at 7% annual return, this could grow to:');
            doc.text(`• 1 Year: $${opportunityCost.opportunityCosts.oneYear.toLocaleString()}`);
            doc.text(`• 5 Years: $${opportunityCost.opportunityCosts.fiveYears.toLocaleString()}`);
            doc.text(`• 10 Years: $${opportunityCost.opportunityCosts.tenYears.toLocaleString()}`);
            doc.text(`• 20 Years: $${opportunityCost.opportunityCosts.twentyYears.toLocaleString()}`);
            doc.moveDown(0.3);
            doc.text(opportunityCost.message);
            doc.moveDown(0.5);
        }

        // Income vs Expenses
        if (insight.incomeVsExpenses) {
            doc.fontSize(14).font('Helvetica-Bold').text('Income vs Expenses', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            doc.text(`Total Income: $${(insight.incomeVsExpenses.totalIncome || 0).toLocaleString()}`);
            doc.text(`Total Expenses: $${(insight.incomeVsExpenses.totalExpenses || 0).toLocaleString()}`);
            doc.text(`Net: $${(insight.incomeVsExpenses.net || 0).toLocaleString()}`);
            doc.moveDown(0.5);
        }

        // Spending Efficiency Score
        if (insight.spendingEfficiencyScore !== undefined && insight.spendingEfficiencyScore !== null) {
            addSection('Spending Efficiency Score', `${insight.spendingEfficiencyScore} / 100`);
        }

        // Monthly Averages
        if (insight.monthlyAverages) {
            doc.fontSize(14).font('Helvetica-Bold').text('Monthly Averages', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            if (insight.monthlyAverages.averageMonthlyIncome) {
                doc.text(`Average Monthly Income: $${insight.monthlyAverages.averageMonthlyIncome.toLocaleString()}`);
            }
            if (insight.monthlyAverages.averageMonthlySpend) {
                doc.text(`Average Monthly Spend: $${insight.monthlyAverages.averageMonthlySpend.toLocaleString()}`);
            }
            if (insight.monthlyAverages.averageMonthlyNet) {
                doc.text(`Average Monthly Net: $${insight.monthlyAverages.averageMonthlyNet.toLocaleString()}`);
            }
            doc.moveDown(0.5);
        }

        // Top Expenses
        if (insight.topExpenses && Array.isArray(insight.topExpenses) && insight.topExpenses.length > 0) {
            doc.fontSize(14).font('Helvetica-Bold').text('Top Expenses', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            insight.topExpenses.forEach((exp, index) => {
                doc.text(`${index + 1}. ${exp.name} - $${(exp.amount || 0).toLocaleString()} (${exp.category})`);
            });
            doc.moveDown(0.5);
        }

        // Expense Breakdown
        if (insight.expenseBreakdown && insight.expenseBreakdown.categories && insight.expenseBreakdown.categories.length > 0) {
            doc.fontSize(14).font('Helvetica-Bold').text('Expense Breakdown by Category', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            insight.expenseBreakdown.categories.forEach(cat => {
                doc.text(`${cat.category}: $${(cat.total || 0).toLocaleString()}`);
            });
            doc.moveDown(0.5);
        }

        // Income Sources
        if (insight.incomeSources && insight.incomeSources.sources && insight.incomeSources.sources.length > 0) {
            doc.fontSize(14).font('Helvetica-Bold').text('Income Sources', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            insight.incomeSources.sources.forEach(source => {
                doc.text(`${source.category}: $${(source.total || 0).toLocaleString()}`);
            });
            doc.moveDown(0.5);
        }

        // Recent Large Transactions
        if (insight.recentLargeTransactions && Array.isArray(insight.recentLargeTransactions) && insight.recentLargeTransactions.length > 0) {
            doc.fontSize(14).font('Helvetica-Bold').text('Recent Large Transactions', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            insight.recentLargeTransactions.forEach(tx => {
                const date = tx.date ? new Date(tx.date).toLocaleDateString() : 'N/A';
                doc.text(`${tx.name} - $${(tx.amount || 0).toLocaleString()} (${tx.type}) on ${date}`);
            });
            doc.moveDown(0.5);
        }

        // Recurring Insights
        if (insight.recurringInsights) {
            doc.fontSize(14).font('Helvetica-Bold').text('Recurring Insights', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            if (insight.recurringInsights.totalRecurringIncome) {
                doc.text(`Recurring Income: $${insight.recurringInsights.totalRecurringIncome.toLocaleString()}`);
            }
            if (insight.recurringInsights.totalRecurringExpenses) {
                doc.text(`Recurring Expenses: $${insight.recurringInsights.totalRecurringExpenses.toLocaleString()}`);
            }
            if (insight.recurringInsights.recurringIncomePercentage !== undefined) {
                doc.text(`Recurring Income Percentage: ${insight.recurringInsights.recurringIncomePercentage.toFixed(2)}%`);
            }
            if (insight.recurringInsights.notes) {
                doc.moveDown(0.2);
                doc.text(insight.recurringInsights.notes);
            }
            doc.moveDown(0.5);
        }

        // Risk Signals
        if (insight.riskSignals && Array.isArray(insight.riskSignals) && insight.riskSignals.length > 0) {
            doc.fontSize(14).font('Helvetica-Bold').text('⚠️ Risk Signals', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            insight.riskSignals.forEach(risk => {
                doc.text(`[${risk.severity.toUpperCase()}] ${risk.type}: ${risk.message}`);
            });
            doc.moveDown(0.5);
        }

        // Optimization Suggestions
        if (insight.optimizationSuggestions && Array.isArray(insight.optimizationSuggestions) && insight.optimizationSuggestions.length > 0) {
            doc.fontSize(14).font('Helvetica-Bold').text('💡 Optimization Suggestions', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            insight.optimizationSuggestions.forEach(suggestion => {
                doc.text(`${suggestion.area}: ${suggestion.suggestion}`);
            });
            doc.moveDown(0.5);
        }

        // Behavior Patterns
        if (insight.behaviorPatterns) {
            doc.fontSize(14).font('Helvetica-Bold').text('Behavior Patterns', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            if (insight.behaviorPatterns.highestIncomeMonth) {
                doc.text(`Highest Income Month: ${insight.behaviorPatterns.highestIncomeMonth}`);
            }
            if (insight.behaviorPatterns.highestExpenseMonth) {
                doc.text(`Highest Expense Month: ${insight.behaviorPatterns.highestExpenseMonth}`);
            }
            if (insight.behaviorPatterns.notes) {
                doc.moveDown(0.2);
                doc.text(insight.behaviorPatterns.notes);
            }
            doc.moveDown(0.5);
        }

        // Future Projection
        if (insight.futureProjection) {
            doc.fontSize(14).font('Helvetica-Bold').text('🔮 Future Projection', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            if (insight.futureProjection.projectedMonthlyNet) {
                doc.text(`Projected Monthly Net: $${insight.futureProjection.projectedMonthlyNet.toLocaleString()}`);
            }
            if (insight.futureProjection.projectedYearlyNet) {
                doc.text(`Projected Yearly Net: $${insight.futureProjection.projectedYearlyNet.toLocaleString()}`);
            }
            if (insight.futureProjection.confidence) {
                doc.text(`Confidence: ${insight.futureProjection.confidence}`);
            }
            doc.moveDown(0.5);
        }

        // Footer
        doc.fontSize(8).font('Helvetica').text(
            `Generated by CoinCoach on ${new Date().toLocaleString()}`,
            { align: 'center' }
        );

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('PDF export error:', error);
        req.flash('error', 'Failed to generate PDF');
        res.redirect('/insights');
    }
};