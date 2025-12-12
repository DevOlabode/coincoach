const joi = require('joi');

module.exports.transactionSchema = joi.object({
    name : joi.string().allow('').optional(),
    type : joi.string().valid('expense', 'income').required(),
    amount : joi.number().required(),
    currency : joi.string().optional(),
    date : joi.date().optional(),
    category : joi.string().required(),
    description : joi.string().allow('').optional(),
    recurring : joi.boolean().optional(),
    recurrence : joi.string().valid('daily', 'weekly', 'monthly', 'yearly', 'hourly').when('recurring', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

module.exports.userSchema = joi.object({
    email : joi.string().email().required(),
    password : joi.string().min(6).required(),
    confirmPassword : joi.any().valid(joi.ref('password')).required().messages({'any.only': 'Passwords do not match'})
})