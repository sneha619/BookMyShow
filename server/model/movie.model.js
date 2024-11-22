import { Schema, model } from "mongoose";
import Theatre from './theatre.model.js';

const MovieSchema = new Schema(
    {
       title: {
        type: String,
        required: true
       },
        description: {
            type: String,
            required: true
           },
        thumbnail: {
            type: String,
            required: true
           },
        bannerImage: {
            type: String,
            required: true
           },
        trailerVid: {
            type: String,
            required: true
           },
        rating: Number,
        casts: [{
            name: String,
            image: String,
        }],
        duration: Number,
        genre: {
            type: [String],
            required: true,
            enum: [" Horror ", " Action ", " Thriller ", " Fiction ", " Comedy "]
        },
        releaseDate: {
            type: Date,
            required: true,
           },
        language: {
            type: [String],
            required: true,
            enum: ["Hindi", "English", "Telugu"]
        },
        Theatre: {
            type: Schema.Types.ObjectId,
            ref: 'theatre',
            required: true
        }
    }
);

const Movie = new model('movie', MovieSchema);

export default Movie;

