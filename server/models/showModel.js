const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true // Format: "HH:MM"
    },
    totalSeats: {
        type: Number,
        required: true
    },
    bookedSeats: [{
        type: String // seat numbers
    }],
    ticketPrice: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for efficient querying
showSchema.index({ movie: 1, theater: 1, date: 1, time: 1 });
showSchema.index({ date: 1, theater: 1 });

const Show = mongoose.model('Show', showSchema);

module.exports = Show;