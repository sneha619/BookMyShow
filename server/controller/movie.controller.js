import Movie from "../model/movie.model.js";
import Theatre from "../model/theatre.model.js"; 

export const createMovie = async (req, res) => {
    const movieData = req.body;
    
    try {
        
        const theatreDetails = movieData.Theatre; 
        
        let theatre = await Theatre.findOne({ name: theatreDetails.name, location: theatreDetails.location });

        if (!theatre) {
            theatre = await Theatre.create(
                movieData.theatre);
        }

        const movie = await Movie.create({
            ...movieData,
            Theatre: theatre._id  
        });

        console.log('Movie Created:', movie);

        res.setHeader("Content-Type", "application/json");
        return res.status(200).send(movie);
    } catch (error) {

        console.error('Error creating movie:', error);

        res.setHeader("Content-Type", "application/json");
        return res.status(500).send({ status: false, message: "Internal Server Error", error: error.message });
    }
};

export const getMovies = async (req, res) => {
    const type = req.query.type;
    const title = req.query.title?.trim();
    let queryFilter = {};

    if (title) {
        queryFilter.title = new RegExp(title, 'i');  
    }
    switch(type){

        case 'ALL':{
            break;
        }
        case 'UPCOMING': {
            queryFilter.releaseDate = { $gt: new Date() };
            break;
        }
        case 'LIVE': {
            queryFilter.releaseDate = { $lte: new Date() };
            break;
        }
    }

    try {
        const data = await Movie.find(queryFilter).populate('Theatre');
        res.status(200).json(data);
    }catch(e){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}