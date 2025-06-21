const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true
    },
    seatType: {
        type: String,
        enum: ['Regular', 'Premium', 'VIP', 'Recliner'],
        default: 'Regular'
    },
    price: {
        type: Number,
        required: true
    }
});

const theaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: String,
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    seats: [seatSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Theater = mongoose.model('Theater', theaterSchema);

module.exports = Theater;