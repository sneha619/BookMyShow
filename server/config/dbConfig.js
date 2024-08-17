import mongoose from "mongoose";

const connectionToDatabase = async() => {
    try{
        const {connection} = await mongoose.connect(
            `mongodb+srv://sneha1995sarkar25:${process.env.DATABASE_PASSWORD}@cluster0.vdyspl1.mongodb.net/bookmyshow?retryWrites=true&w=majority&appName=Cluster0`
        );
    
        if(connection){
            console.log(`Connected to database ${connection.host}`);
        }
    }
    catch(e){
        console.log(e);
    }
}
export default connectionToDatabase;