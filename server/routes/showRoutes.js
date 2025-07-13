const express = require('express');
const router = express.Router();
const Show = require('../models/showModel');
const Theater = require('../models/theaterModel');
const Movie = require('../models/movieModel');
const authMiddlewares = require('../Middlewares/authMiddlewares');

// Get all shows with filters
router.get('/get-all-shows', async (req, res) => {
    try {
        const { movie, theater, date, city } = req.query;
        let filter = { isActive: true };
        
        if (movie) {
            filter.movie = movie;
        }
        
        if (theater) {
            filter.theater = theater;
        }
        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            filter.date = {
                $gte: startDate,
                $lt: endDate
            };
        }
        
        let shows = await Show.find(filter)
            .populate('movie', 'title poster duration genre language rating')
            .populate('theater', 'name address')
            .sort({ date: 1, time: 1 });
        
        // Filter by city if provided
        if (city) {
            shows = shows.filter(show => 
                show.theater.address.city.toLowerCase().includes(city.toLowerCase())
            );
        }
        
        res.send({
            success: true,
            data: shows
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get shows by movie ID
router.get('/get-shows-by-movie/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const { date, city } = req.query;
        
        let filter = {
            movie: movieId,
            isActive: true
        };
        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            filter.date = {
                $gte: startDate,
                $lt: endDate
            };
        } else {
            // Default to today and next 7 days
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            filter.date = {
                $gte: today,
                $lt: nextWeek
            };
        }
        
        let shows = await Show.find(filter)
            .populate('theater', 'name address')
            .sort({ date: 1, time: 1 });
        
        // Filter by city if provided
        if (city) {
            shows = shows.filter(show => 
                show.theater.address.city.toLowerCase().includes(city.toLowerCase())
            );
        }
        
        res.send({
            success: true,
            data: shows
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get show by ID
router.get('/get-show-by-id/:id', async (req, res) => {
    try {
        const show = await Show.findById(req.params.id)
            .populate('movie')
            .populate('theater');
        
        if (!show) {
            return res.status(404).send({
                success: false,
                message: 'Show not found'
            });
        }
        
        res.send({
            success: true,
            data: show
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Add new show (Theater owner only)
router.post('/add-show', authMiddlewares, async (req, res) => {
    try {
        // Verify theater ownership
        const theater = await Theater.findById(req.body.theater);
        if (!theater) {
            return res.status(404).send({
                success: false,
                message: 'Theater not found'
            });
        }
        
        if (theater.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'You can only add shows to your own theaters'
            });
        }
        
        // Verify movie exists
        const movie = await Movie.findById(req.body.movie);
        if (!movie) {
            return res.status(404).send({
                success: false,
                message: 'Movie not found'
            });
        }
        
        // Check for conflicting shows
        const existingShow = await Show.findOne({
            theater: req.body.theater,
            date: req.body.date,
            time: req.body.time,
            isActive: true
        });
        
        if (existingShow) {
            return res.status(400).send({
                success: false,
                message: 'A show already exists at this time slot'
            });
        }
        
        const showData = {
            ...req.body,
            totalSeats: theater.seats.length,
            bookedSeats: []
        };
        
        const newShow = new Show(showData);
        await newShow.save();
        
        res.send({
            success: true,
            message: 'Show added successfully',
            data: newShow
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Update show (Theater owner only)
router.put('/update-show/:id', authMiddlewares, async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate('theater');
        
        if (!show) {
            return res.status(404).send({
                success: false,
                message: 'Show not found'
            });
        }
        
        // Check ownership
        if (show.theater.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'You can only update shows in your own theaters'
            });
        }
        
        const updatedShow = await Show.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('movie').populate('theater');
        
        res.send({
            success: true,
            message: 'Show updated successfully',
            data: updatedShow
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Delete show (Theater owner only)
router.delete('/delete-show/:id', authMiddlewares, async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate('theater');
        
        if (!show) {
            return res.status(404).send({
                success: false,
                message: 'Show not found'
            });
        }
        
        // Check ownership
        if (show.theater.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'You can only delete shows in your own theaters'
            });
        }
        
        await Show.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        res.send({
            success: true,
            message: 'Show deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get shows by theater owner
router.get('/get-shows-by-theater-owner', authMiddlewares, async (req, res) => {
    try {
        const theaters = await Theater.find({ owner: req.user._id });
        const theaterIds = theaters.map(theater => theater._id);
        
        const shows = await Show.find({
            theater: { $in: theaterIds },
            isActive: true
        })
        .populate('movie', 'title poster')
        .populate('theater', 'name')
        .sort({ date: 1, time: 1 });
        
        res.send({
            success: true,
            data: shows
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get shows by theater ID
router.get('/get-shows-by-theater/:theaterId', async (req, res) => {
    try {
        const { theaterId } = req.params;
        const { date } = req.query;
        
        let filter = {
            theater: theaterId,
            isActive: true
        };
        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            filter.date = {
                $gte: startDate,
                $lt: endDate
            };
        } else {
            // Default to today and next 7 days
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            filter.date = {
                $gte: today,
                $lt: nextWeek
            };
        }
        
        const shows = await Show.find(filter)
            .populate('movie', 'title poster duration genre language rating')
            .sort({ date: 1, time: 1 });
        
        res.send({
            success: true,
            data: shows
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;