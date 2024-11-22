import { Schema, model} from "mongoose";
import jwt from 'jsonwebtoken';


const UserSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [3, 'Min 3 characters are required!'],
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /(([A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}))$/,
            'Please fill valid email id!'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: [8, 'Min 8 characters are required'],
        select: false

    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    }
    
}, {
    timestamps: true
});

UserSchema.methods = {
    generateJWTToken: function() {
        return jwt.sign(
            { id: this._id, role: this.role },
            process.env.JWT_PASSWORD,
            {
                expiresIn: process.env.JWT_EXPIRY || '2d'
            }
        );
    }
} 

const User = model('user', UserSchema);

export default User;
