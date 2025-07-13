require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const PORT = 10000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load models first to ensure they are registered
require('./models/userModel');
require('./models/theaterModel');
require('./models/movieModel');
require('./models/showModel');
require('./models/bookingModel');

const userRoutes = require('./routes/userRoutes.js');
const movieRoutes = require('./routes/movieRoutes.js');
const theaterRoutes = require('./routes/theaterRoutes.js');
const showRoutes = require('./routes/showRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');

app.use('/api/user', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, ()=> {
    console.log('server started');
});

mongoose.connect('mongodb+srv://sneha1995sarkar25:Aw26F43kgMZhBlH9@cluster0.xzg3n.mongodb.net/BMS?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log('Connected to Database');
}).catch((error)=>{
    console.log(error);
})

