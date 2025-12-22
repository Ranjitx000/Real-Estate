import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const generateToken = (id) => {
    dotenv.config();
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}