import Show from "../model/show.model.js";
import mongoose from "mongoose";

export const createShow = async (req, res) => {
    const showDetails = req.body;

    try {
        // Creating a new Show document in the database
        const response = await Show.create(showDetails);

        // Sending a successful response with the created show details
        res.status(200).json(response);

    } catch (error) {
        // Handle errors during show creation
        console.error("Error creating show:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const listShow = async (req, res) => {
    const movieID = req.query.movie;
    const movieDate = req.query.date;

    console.log("Received movieID:", movieID);

    const allShows = await Show.find({});
    console.log("All Shows:", allShows);

    if (!mongoose.Types.ObjectId.isValid(movieID)) {
        return res.status(400).json({ message: "Invalid movie ID format." });
    }

    try {
        const response = await Show.aggregate([
            {
                $match: { movie: new mongoose.Types.ObjectId(movieID) }, 
            },
            {
                $match: {
                    datetime: {
                        '$gte': new Date(`${movieDate}T00:00:00.000+00:00`),//getting error
                        '$lt': new Date(`${movieDate}T23:59:59.999+00:00`)
                    }
                }
            },
            {
                $group: { _id: "$theatre", showDetails: { $push: "$$ROOT" } }
            }
        ]).exec();

        res.status(200).send(response);
        console.log(response);
    } catch (error) {
        console.error("Error fetching shows:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

    console.log("Aggregation Query:", [
        {
            $match: { movie: new mongoose.Types.ObjectId(movieID) },
        },
        {
            $match: {
                datetime: {
                    '$gte': new Date(`${movieDate}T00:00:00.000+00:00`),
                    '$lt': new Date(`${movieDate}T23:59:59.999+00:00`)
                }
            }
        },
        {
            $group: { _id: "$theatre", showDetails: { $push: "$$ROOT" } }
        }
    ]);
};
    // try {
    //     const response = await Show.aggregate([
    //         {
    //             $match: { movie: new mongoose.Types.ObjectId(movieID) }, // Use the variable here
    //         },
    //         {
    //             $match: {
    //                 datetime: {
    //                     '$gte': new Date(`${movieDate}T00:00:00.000+00:00`),
    //                     '$lt': new Date(`${movieDate}T23:59:59.999+00:00`)
    //                 }
    //             }
    //         },
    //         {
    //             $group: { _id: "$theatre", showDetails: { $push: "$$ROOT" } }
    //         }
    //     ]).exec();

    //     res.status(200).send(response);
    //     console.log(response);
    // } catch (error) {
    //     console.error("Error fetching shows:", error);
    //     res.status(500).json({ message: "Internal Server Error", error: error.message });
    // }


    
