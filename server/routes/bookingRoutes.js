const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');
const authMiddlewares = require('../middlewares/authMiddlewares');

// Make booking (Create temporary reservation)
router.post('/make-booking', authMiddlewares, async (req, res) => {
    try {
        const { show, seats } = req.body;
        
        // Verify show exists
        const showData = await Show.findById(show);
        if (!showData) {
            return res.status(404).send({
                success: false,
                message: 'Show not found'
            });
        }
        
        // Check if seats are available
        const unavailableSeats = seats.filter(seat => 
            showData.bookedSeats.includes(seat)
        );
        
        if (unavailableSeats.length > 0) {
            return res.status(400).send({
                success: false,
                message: `Seats ${unavailableSeats.join(', ')} are already booked`
            });
        }
        
        // Check for existing pending bookings for these seats
        const existingBookings = await Booking.find({
            show: show,
            seats: { $in: seats },
            bookingStatus: 'Pending',
            seatHoldExpiry: { $gt: new Date() }
        });
        
        if (existingBookings.length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Some seats are temporarily held by other users'
            });
        }
        
        // Calculate total amount
        const totalAmount = seats.length * showData.ticketPrice;
        
        // Create booking with temporary hold
        const booking = new Booking({
            show,
            user: req.user._id,
            seats,
            totalAmount,
            paymentStatus: 'Pending',
            bookingStatus: 'Pending'
        });
        
        await booking.save();
        
        res.send({
            success: true,
            message: 'Seats reserved temporarily. Please complete payment within 10 minutes.',
            data: booking
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Confirm booking (After successful payment)
router.post('/confirm-booking', authMiddlewares, async (req, res) => {
    try {
        const { bookingId, paymentId, transactionDetails } = req.body;
        
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).send({
                success: false,
                message: 'Booking not found'
            });
        }
        
        // Check if booking belongs to user
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized access'
            });
        }
        
        // Check if booking is still valid (not expired)
        if (booking.seatHoldExpiry < new Date()) {
            await Booking.findByIdAndUpdate(bookingId, {
                bookingStatus: 'Cancelled',
                paymentStatus: 'Failed'
            });
            
            return res.status(400).send({
                success: false,
                message: 'Booking expired. Please try again.'
            });
        }
        
        // Update show's booked seats
        await Show.findByIdAndUpdate(booking.show, {
            $addToSet: { bookedSeats: { $each: booking.seats } }
        });
        
        // Update booking status
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                paymentStatus: 'Completed',
                bookingStatus: 'Confirmed',
                paymentId,
                transactionDetails
            },
            { new: true }
        ).populate('show').populate('user', 'name email');
        
        res.send({
            success: true,
            message: 'Booking confirmed successfully',
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get user bookings
router.get('/get-user-bookings', authMiddlewares, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({
                path: 'show',
                populate: [
                    { path: 'movie', select: 'title poster duration' },
                    { path: 'theater', select: 'name address' }
                ]
            })
            .sort({ bookingDate: -1 });
        
        res.send({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get booking by ID
router.get('/get-booking-by-id/:id', authMiddlewares, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'show',
                populate: [
                    { path: 'movie' },
                    { path: 'theater' }
                ]
            })
            .populate('user', 'name email');
        
        if (!booking) {
            return res.status(404).send({
                success: false,
                message: 'Booking not found'
            });
        }
        
        // Check if user owns this booking or is admin
        if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized access'
            });
        }
        
        res.send({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Cancel booking
router.put('/cancel-booking/:id', authMiddlewares, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).send({
                success: false,
                message: 'Booking not found'
            });
        }
        
        // Check if user owns this booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized access'
            });
        }
        
        // Check if booking can be cancelled (e.g., at least 2 hours before show)
        const show = await Show.findById(booking.show);
        const showDateTime = new Date(`${show.date.toDateString()} ${show.time}`);
        const currentTime = new Date();
        const timeDifference = showDateTime.getTime() - currentTime.getTime();
        const hoursDifference = timeDifference / (1000 * 3600);
        
        if (hoursDifference < 2) {
            return res.status(400).send({
                success: false,
                message: 'Booking cannot be cancelled less than 2 hours before the show'
            });
        }
        
        // Remove seats from show's booked seats
        await Show.findByIdAndUpdate(booking.show, {
            $pullAll: { bookedSeats: booking.seats }
        });
        
        // Update booking status
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
                bookingStatus: 'Cancelled',
                paymentStatus: 'Refunded'
            },
            { new: true }
        );
        
        res.send({
            success: true,
            message: 'Booking cancelled successfully. Refund will be processed.',
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get all bookings (Admin only)
router.get('/get-all-bookings', authMiddlewares, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'Only admins can view all bookings'
            });
        }
        
        const bookings = await Booking.find({})
            .populate('user', 'name email')
            .populate({
                path: 'show',
                populate: [
                    { path: 'movie', select: 'title' },
                    { path: 'theater', select: 'name' }
                ]
            })
            .sort({ bookingDate: -1 });
        
        res.send({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Clean up expired bookings (This should be run as a scheduled job)
router.post('/cleanup-expired-bookings', async (req, res) => {
    try {
        const expiredBookings = await Booking.find({
            bookingStatus: 'Pending',
            seatHoldExpiry: { $lt: new Date() }
        });
        
        for (let booking of expiredBookings) {
            await Booking.findByIdAndUpdate(booking._id, {
                bookingStatus: 'Cancelled',
                paymentStatus: 'Failed'
            });
        }
        
        res.send({
            success: true,
            message: `Cleaned up ${expiredBookings.length} expired bookings`
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;