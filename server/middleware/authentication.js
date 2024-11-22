import jwt from 'jsonwebtoken';

const isLoggedIn = (req,res,next) =>{

    const { token } = req.cookies;
    console.log("Token from cookies:", token); 
    
    const tokenDetails = jwt.verify(token, process.env.JWT_PASSWORD);

    if(!token || !tokenDetails){
        res.status(401).send({status:false, message: "Invalid credentials"});
        return;
    }
    req.user = tokenDetails;
    console.log('Token:', token);
    next();
}

export default isLoggedIn;