const { z } = require('zod');

const userSchema = z.object({
    name: z.string().min(3, 'Name is required').max(50, 'Name must be less than 50 characters'),
    email: z.email('Invalid email address')
});

const updateUserSchema = z.object({
    name: z.string().min(3, 'Name is required').max(50, 'Name must be less than 50 characters').optional(),
    email: z.email('Invalid email address').optional()

});

const userIDParamSchema = z.string().uuid('User ID must be a valid UUID');

module.exports = { userSchema, updateUserSchema, userIDParamSchema };