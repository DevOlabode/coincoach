const Transaction = require('../models/transactions');

/**
 * Calculate opportunity cost of discretionary spending
 * Shows what money could be worth if invested instead
 */
async function calculateOpportunityCost(userId) {
  try {
    // Categories considered discretionary (wants, not needs)
    const discretionaryCategories = [
      'entertainment', 
      'dining', 
      'shopping', 
      'hobbies',
      'subscription',
      'leisure',
      'games',
      'travel'
    ];
    
    // Get last 30 days of discretionary spending
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const discretionarySpending = await Transaction.aggregate([
      { 
        $match: { 
          userId, 
          type: 'expense',
          category: { $in: discretionaryCategories },
          date: { $gte: thirtyDaysAgo }
        }
      },
      { 
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const totalDiscretionary = discretionarySpending.reduce((sum, cat) => sum + cat.total, 0);
    
    // Annualize the monthly spending
    const annualDiscretionary = totalDiscretionary * 12;
    
    // Calculate investment opportunity cost (7% average annual return)
    const annualReturn = 0.07;
    
    const opportunityCosts = {
      oneYear: annualDiscretionary * (1 + annualReturn),
      threeYears: annualDiscretionary * calculateFutureValue(1, 3, annualReturn),
      fiveYears: annualDiscretionary * calculateFutureValue(1, 5, annualReturn),
      tenYears: annualDiscretionary * calculateFutureValue(1, 10, annualReturn),
      twentyYears: annualDiscretionary * calculateFutureValue(1, 20, annualReturn)
    };
    
    // Calculate alternatives
    const alternatives = calculateAlternatives(totalDiscretionary);
    
    // Calculate potential wealth accumulation
    const wealthAccumulation = calculateWealthAccumulation(totalDiscretionary, annualReturn);
    
    return {
      monthlyDiscretionary: totalDiscretionary,
      annualDiscretionary,
      categoryBreakdown: discretionarySpending,
      opportunityCosts,
      alternatives,
      wealthAccumulation,
      message: generateMessage(totalDiscretionary, opportunityCosts)
    };
    
  } catch (error) {
    console.error('Error calculating opportunity cost:', error);
    throw error;
  }
}

/**
 * Calculate future value with regular contributions
 */
function calculateFutureValue(monthlyAmount, years, annualRate) {
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  
  // Future value of annuity formula
  const fv = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
  return fv;
}

/**
 * Calculate wealth accumulation over time
 */
function calculateWealthAccumulation(monthlyAmount, annualRate) {
  const years = [1, 5, 10, 15, 20, 25, 30];
  
  return years.map(year => ({
    year,
    value: calculateFutureValue(monthlyAmount, year, annualRate)
  }));
}

/**
 * Compare spending to relatable alternatives
 */
function calculateAlternatives(monthlyAmount) {
  return {
    coffee: {
      count: Math.floor(monthlyAmount / 5),
      item: 'premium coffees',
      unitCost: 5
    },
    streaming: {
      count: Math.floor(monthlyAmount / 15),
      item: 'streaming subscriptions',
      unitCost: 15
    },
    groceries: {
      count: Math.floor(monthlyAmount / 100),
      item: 'weeks of groceries',
      unitCost: 100
    },
    gasoline: {
      count: Math.floor(monthlyAmount / 60),
      item: 'tank fills of gas',
      unitCost: 60
    }
  };
}

/**
 * Generate insight message
 */
function generateMessage(monthlyAmount, costs) {
  if (monthlyAmount === 0) {
    return "Great job! You have minimal discretionary spending.";
  }
  
  const tenYearGain = costs.tenYears - (monthlyAmount * 12 * 10);
  
  return `By investing your monthly discretionary spending of $${monthlyAmount.toFixed(2)}, you could gain an additional $${tenYearGain.toFixed(2)} over 10 years through compound growth.`;
}

module.exports = {
  calculateOpportunityCost
};