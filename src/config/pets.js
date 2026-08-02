let PetTypes = [
    "Dog",
    "Cat",
    "Bird",
    "smallPet"
];

let petGender = [
    'Male',
    'Female'
]

let petSize = [
    'Small',
    'Medium',
    'Large'
]


let behavioralIssues = [
    "No",
    "Yes",
    "Aggression",
    "Anxiety",
    "Resource Gaurding",
    "Food Agression",
    "Fear",
    "Other"
];

let amenities = [
    'WiFi',
    'Air Conditioning',
    'Heating',
    'Parking',
    'Garden',
    'Pool',
    'Other'
]

let bookingType = [
    'hourly',
    'daily',
    'multidays'
]

let bookingStatus = [
    'initiated',
    'scheduled',
    'running',
    'completed',
    'cancelled'
]

let hostStatus = [
    'verified',
    'unverified',
    'rejected',
    'suspend'
]

let bussinessType = [
    'Homestay',
    'Professional'
]

let property = [
    'Owned',
    'Rented'
]

let Services = [
    'overnight_multiday_boarding',
    'emergency_boarding',
    'hourly_boarding',
]

let propertyAreaType = [
    'Square Feet',
    'Square Meters'
]

module.exports = {
    hostStatus,
    petGender,
    bookingStatus,
    PetTypes,
    behavioralIssues,
    amenities,
    bookingType,
    bussinessType,
    property,
    Services,
    propertyAreaType,
    petSize
};