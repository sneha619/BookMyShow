const mongoose = require('mongoose');
const express = require('express');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        validate: {
            validator: function (v) {
                return /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        },
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
},{timestamps: true})

const User = mongoose.model('user', userSchema );

module.exports = User;