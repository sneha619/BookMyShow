const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModel');
const authMiddlewares = require('../middlewares/authMiddlewares');

// Get all movies with filters
router.get('/get-all-movies', async (req, res) => {
    try {
        const { city, genre, language, search } = req.query;
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
        
        const movies = await Movie.find(filter).sort({ releaseDate: -1 });
        
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
        const movie = await Movie.findById(req.params.id);
        
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

// Add new movie (Admin only)
router.post('/add-movie', authMiddlewares, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'Only admins can add movies'
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

// Update movie (Admin only)
router.put('/update-movie/:id', authMiddlewares, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'Only admins can update movies'
            });
        }
        
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
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

// Delete movie (Admin only)
router.delete('/delete-movie/:id', authMiddlewares, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'Only admins can delete movies'
            });
        }
        
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