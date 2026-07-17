let PetTypes = [
    "Dog",
    "Cat",
    "Bird",
    "Rabbit",
    "Hamster"
];

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
    'completed',
    'confirmed',
    'initiated',
    'pending'
]

let hostStatus = [
    'verified',
    'unverified',
    'rejected'
]
module.exports = { hostStatus, bookingStatus, PetTypes, behavioralIssues, amenities, bookingType };