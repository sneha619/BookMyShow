const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModel');
// const authMiddlewares = require('../Middlewares/authMiddlewares');

// Get all movies with filters
router.get('/get-all-movies', async (req, res) => {
    try {
        const { city, genre, language, search, theaterId } = req.query;
        let filter = { isActive: true };
        
        if (genre) {
            filter.genre = { $in: [genre] };
        }
        
        if (language) {
            filter.language = { $in: [language] };
        }
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { director: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by theater if provided
        if (theaterId) {
            filter.theaters = { $in: [theaterId] };
        }
        
        // Filter by city if provided
        if (city) {
            // First find theaters in the specified city
            const Theater = require('../models/theaterModel');
            const theaterIds = await Theater.find({ 'address.city': city })
                .distinct('_id');
            
            // Then find movies associated with those theaters
            filter.theaters = { $in: theaterIds };
        }
        
        const movies = await Movie.find(filter)
            .populate('theaters', 'name address')
            .sort({ releaseDate: -1 });
        
        res.send({
            success: true,
            data: movies
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get movie by ID
router.get('/get-movie-by-id/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate('theaters', 'name address');
        
        if (!movie) {
            return res.status(404).send({
                success: false,
                message: 'Movie not found'
            });
        }
        
        res.send({
            success: true,
            data: movie
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Add new movie (Anyone can add)
router.post('/add-movie', async (req, res) => {
    try {
        
        // Validate that theaters exist
        const { theaters } = req.body;
        if (!theaters || !theaters.length) {
            return res.status(400).send({
                success: false,
                message: 'At least one theater must be selected'
            });
        }
        
        // Verify all theaters exist
        const Theater = require('../models/theaterModel');
        const theaterCount = await Theater.countDocuments({ _id: { $in: theaters } });
        
        if (theaterCount !== theaters.length) {
            return res.status(400).send({
                success: false,
                message: 'One or more selected theaters do not exist'
            });
        }
        
        const newMovie = new Movie(req.body);
        await newMovie.save();
        
        res.send({
            success: true,
            message: 'Movie added successfully',
            data: newMovie
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Update movie (Anyone can update)
router.put('/update-movie/:id', async (req, res) => {
    try {
        
        // Validate that theaters exist if provided
        const { theaters } = req.body;
        if (theaters) {
            if (!theaters.length) {
                return res.status(400).send({
                    success: false,
                    message: 'At least one theater must be selected'
                });
            }
            
            // Verify all theaters exist
            const Theater = require('../models/theaterModel');
            const theaterCount = await Theater.countDocuments({ _id: { $in: theaters } });
            
            if (theaterCount !== theaters.length) {
                return res.status(400).send({
                    success: false,
                    message: 'One or more selected theaters do not exist'
                });
            }
        }
        
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!movie) {
            return res.status(404).send({
                success: false,
                message: 'Movie not found'
            });
        }
        
        res.send({
            success: true,
            message: 'Movie updated successfully',
            data: movie
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Delete movie (Anyone can delete)
router.delete('/delete-movie/:id', async (req, res) => {
    try {
        
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!movie) {
            return res.status(404).send({
                success: false,
                message: 'Movie not found'
            });
        }
        
        res.send({
            success: true,
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get movies by city (based on theaters showing them)
router.get('/get-movies-by-city/:city', async (req, res) => {
    try {
        const { city } = req.params;
        
        // This would require joining with shows and theaters
        // For now, returning all active movies
        const movies = await Movie.find({ isActive: true }).sort({ releaseDate: -1 });
        
        res.send({
            success: true,
            data: movies
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;