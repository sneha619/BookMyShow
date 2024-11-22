import React, { useEffect, useState } from 'react';

const MovieList = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function fetchMovies() {
            try {
                const response = await fetch('http://localhost:5050/api/movie/list?type=ALL');
                const movieList = await response.json();
                setMovies(movieList);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            }
        }
        fetchMovies();
    }, []); 

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-[2%] px-4 pb-2">
            {movies.map((movie) => (
                <div key={movie.email} className="bg-white shadow-md rounded-lg overflow-hidden transform scale-[1.03] transition-transform hover:scale-105">
                    <img src={movie.thumbnail} alt={movie.title} className="w-full h-64 object-cover" />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{movie.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{movie.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 font-medium">Rating: {movie.rating}</span>
                            <span className="text-sm text-gray-500">Genre: {movie.genre}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MovieList;
