const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seats: [{
        type: String,
        required: true
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    paymentId: {
        type: String
    },
    bookingStatus: {
        type: String,
        enum: ['Confirmed', 'Cancelled', 'Pending'],
        default: 'Pending'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    // Temporary hold on seats (expires after 10 minutes)
    seatHoldExpiry: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    },
    transactionDetails: {
        paymentMethod: String,
        transactionId: String,
        paymentGateway: String
    }
}, { timestamps: true });

// Index for efficient querying
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ show: 1, bookingStatus: 1 });
bookingSchema.index({ seatHoldExpiry: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;