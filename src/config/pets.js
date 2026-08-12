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

let amenities = [
    'swimming',
    'extra_walks',
    'play_area',
    '24/7_CCTV',
    'veg_meal',
    'wet_meal',
    'dry_kibble_meal',
    'grooming',
    'pet_store',
    'pet_cafe',
    'vaternity_support',
    'daily_cleaning',
    'vaccination_pet_only',
    'ticks_control',
    'spa',
    'jacuzzi',
    'bubble_bath',
    'ac',
    'cooler',
    'live_update',
    'fresh_water'
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
    'emergency_boarding'
]

module.exports = {
    hostStatus,
    petGender,
    bookingStatus,
    PetTypes,
    amenities,
    bookingType,
    bussinessType,
    property,
    Services,
    petSize
};