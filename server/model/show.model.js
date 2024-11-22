import { model, Schema } from "mongoose";

const showSchema = new Schema ({
    datetime: {
        type : Date,
        require : true
    },
    language : String,
    movie : {
        type : Schema.Types.ObjectId,
        ref : 'movie',
        required : true
    },
    theatre : {
        type : Schema.Types.ObjectId,
        ref : 'theatre',
        required : true
    },
    totalSeats : {
        type : Number,
    },
    availableSeats : {
        type : Number,
    },
    seats : [
        {
            category : String,
            price : Number,
            arrangements : [[
                {
                    seatNumber : String,
                    status : String
                }
            ]] 
        }
    ]
})

const Show = new model('show', showSchema);

export default Show;