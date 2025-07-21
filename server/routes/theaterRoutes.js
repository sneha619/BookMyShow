const express = require('express');
const router = express.Router();
const Theater = require('../models/theaterModel');
const authMiddlewares = require('../Middlewares/authMiddlewares');

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

// Add new theater (Anyone can add)
router.post('/add-theater', async (req, res) => {
    try {
        const theaterData = {
            ...req.body
            // No owner assignment - anyone can add
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

// Update theater (Anyone can update)
router.put('/update-theater/:id', async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        
        if (!theater) {
            return res.status(404).send({
                success: false,
                message: 'Theater not found'
            });
        }
        
        // No ownership check - anyone can update

        
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

// Delete theater (Anyone can delete)
router.delete('/delete-theater/:id', async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        
        if (!theater) {
            return res.status(404).send({
                success: false,
                message: 'Theater not found'
            });
        }
        
        // No ownership check - anyone can delete

        
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