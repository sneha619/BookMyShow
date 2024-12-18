import User from "../model/user.model.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const register = async(req, res) => {
    const userData = req.body;
    userData.password = await bcrypt.hash(userData.password, 10);
    const data = await User.create(userData);
    res.status(200).send({status: true, message: "Successfully registered"});
}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const userData = await User.findOne({ email : email.toLowerCase() }).select('+password');
        if(!userData){
            res.status(401).send({status: false, message: "Invalid credentials"});
            return;
        }
        if(!await bcrypt.compare(password,  userData.password)){
            return res.status(401).send({status: false, message: "Invalid credentials"});
        }

        //Generate JWT token

        const jwtToken =  await userData.generateJWTToken();

        res.cookie('token', jwtToken,{
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        //Put JWT token in cookie
        
        res.status(200).send(
            {status: true, message: "Successfully logged in!"}
        )
    }catch(error){
        console.error("Error during login:", error);
        res.status(500).send({ status: false, message: "Server error" });
    }
};


export const getProfile = async (req,res) => {

    const userId = req.user.id;

    const userDetail = await User.findById(userId);

    if (!userDetail) {
        return res.status(404).send({ status: false, message: "User not found" });
    }

    res.status(200).send(userDetail)
    
};
