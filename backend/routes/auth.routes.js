import express from "express";
import {
  register,
  Login,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";

const authRoutesrouter = express.Router();

authRoutesrouter.post("/register", register);
authRoutesrouter.post("/login", Login);
authRoutesrouter.post("/forgot-password", forgotPassword);
authRoutesrouter.post("/reset-password", resetPassword);

export default authRoutesrouter;
