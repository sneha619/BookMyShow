require("dotenv").config();

const express = require('express');

const mongoose = require('mongoose');

const app = express();

const PORT = 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes.js');

app.use('/api/user', userRoutes);

app.listen(PORT, ()=> {
    console.log('server started');
});

mongoose.connect('mongodb+srv://sneha1995sarkar25:Aw26F43kgMZhBlH9@cluster0.xzg3n.mongodb.net/BMS?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log('Connected to Database');
}).catch((error)=>{
    console.log(error);
})

