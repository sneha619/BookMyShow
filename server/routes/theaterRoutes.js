const express = require('express');
const router = express.Router();
const Theater = require('../models/theaterModel');
const authMiddlewares = require('../middlewares/authMiddlewares');

// Get all theaters
router.get('/get-all-theaters', async (req, res) => {
    try {
        const { city } = req.query;
        let filter = { isActive: true };
        
        if (city) {
            filter['address.city'] = { $regex: city, $options: 'i' };
        }
        
        const theaters = await Theater.find(filter)
            .populate('owner', 'name email')
            .sort({ name: 1 });
        
        res.send({
            success: true,
            data: theaters
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get theater by ID
router.get('/get-theater-by-id/:id', async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id)
            .populate('owner', 'name email');
        
        if (!theater) {
            return res.status(404).send({
                success: false,
                message: 'Theater not found'
            });
        }
        
        res.send({
            success: true,
            data: theater
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Add new theater (Theater owner only)
router.post('/add-theater', authMiddlewares, async (req, res) => {
    try {
        const theaterData = {
            ...req.body,
            owner: req.user._id
        };
        
        const newTheater = new Theater(theaterData);
        await newTheater.save();
        
        res.send({
            success: true,
            message: 'Theater added successfully',
            data: newTheater
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Update theater (Owner only)
router.put('/update-theater/:id', authMiddlewares, async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        
        if (!theater) {
            return res.status(404).send({
                success: false,
                message: 'Theater not found'
            });
        }
        
        // Check if user is the owner or admin
        if (theater.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'You can only update your own theaters'
            });
        }
        
        const updatedTheater = await Theater.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        res.send({
            success: true,
            message: 'Theater updated successfully',
            data: updatedTheater
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Delete theater (Owner only)
router.delete('/delete-theater/:id', authMiddlewares, async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        
        if (!theater) {
            return res.status(404).send({
                success: false,
                message: 'Theater not found'
            });
        }
        
        // Check if user is the owner or admin
        if (theater.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'You can only delete your own theaters'
            });
        }
        
        await Theater.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        res.send({
            success: true,
            message: 'Theater deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get theaters by owner
router.get('/get-theaters-by-owner', authMiddlewares, async (req, res) => {
    try {
        const theaters = await Theater.find({ 
            owner: req.user._id,
            isActive: true 
        }).sort({ name: 1 });
        
        res.send({
            success: true,
            data: theaters
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get theaters by city
router.get('/get-theaters-by-city/:city', async (req, res) => {
    try {
        const { city } = req.params;
        
        const theaters = await Theater.find({
            'address.city': { $regex: city, $options: 'i' },
            isActive: true
        }).sort({ name: 1 });
        
        res.send({
            success: true,
            data: theaters
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;