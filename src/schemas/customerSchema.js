const { z } = require('zod');
const { behavioralIssues, PetTypes } = require('../config/pets');


const createCustomerSchema = z.object({
    userId: z.string().uuid(),
    name: z.string().min(2).max(100),
    contactNumber: z.string().max(15),
    email: z.string().email(),
    petProfile: z.string().optional(),
    petType: z.enum(PetTypes),
    petName: z.string().min(1).max(50),
    petAge: z.number().int().min(0),
    petGender: z.enum(['Male', 'Female']),
    petSize: z.enum(['Small', 'Medium', 'Large']),
    vaccinationDate: z.string().optional(),
    tickTreatmentStatus: z.boolean().optional(),
    tickTreatmentDate: z.string().optional(),
    healthIssues: z.boolean().optional(),
    healthIssuesDescription: z.string().optional(),
    medicalHistory: z.boolean().optional(),
    medicalHistoryDescription: z.string().optional(),
    behavioralIssues: z.enum(behavioralIssues),
    behavioralIssuesDescription: z.string().optional()
});

module.exports = { createCustomerSchema };