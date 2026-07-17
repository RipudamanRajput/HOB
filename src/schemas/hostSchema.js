const { z, size } = require('zod');
const { PetTypes, amenities } = require('../config/pets');

const AmenitiesEnum = z.enum([
    "WiFi",
    "Air Conditioning",
    "Heating",
    "Parking",
    "Garden",
    "Pool",
    "Other"
]);

const createHostSchema = z.object({
    userId: z.string().uuid(),
    name: z.string().min(2).max(100),
    address: z.string().min(5).max(200),
    about: z.string().optional(),
    bussinessType: z.enum(['Homestyle', 'Professional']),
    property: z.enum(['Owned', 'Rented']),
    idProof: z.string().url().optional(),
    addressProof: z.string().url().optional(),
    numberOfCareTakers: z.number().int().min(1),
    businessDetails: z.string().optional(),
    nameOfBusiness: z.string().optional(),
    yearsOfExperience: z.number().int().min(0).optional(),
    boardingOfPets: z.enum(PetTypes),
    boardingType: z.enum(['Homestyle', 'Professional']),
    capacity: z.array(z.any()).min(1),
    numberOfRooms: z.record(z.any()),
    pricePerPet: z.array(z.any()).min(1),
    sizeOfRooms: z.record(z.any()),
    limitationsForGuests: z.boolean().optional(),
    limitationsDescription: z.string().optional(),
    propertyAreaType: z.enum(['Square Feet', 'Square Meters']).optional(),
    propertyAreaSize: z.float32().optional(),
    amenities: z.array(AmenitiesEnum).optional(),
    paidAmenities: z.array(z.any()).min(1),
    fareAccordingToPetSize: z.boolean().optional(),
    noc: z.string().url().optional(),
    businessProf: z.string().url().optional(),
    rule: z.string().optional()
});

module.exports = { createHostSchema };