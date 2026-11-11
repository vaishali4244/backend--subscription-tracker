import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";


//what is req body? - req.body is an object that contains the data sent by the client in the request body. It is typically used to send data to the server when making POST or PUT requests. The data can be in various formats, such as JSON, form data, or URL-encoded data. In this case, we are using express.json() middleware to parse JSON request bodies and populate req.body with the parsed data.

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //atomic operation - either all operations succeed or none of them do
  try {
    //create a new user

    const { name, email, password } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      const error = new Error("User already exists ");
      error.statusCode = 409;
      throw error;
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session },
    );
    //session - if anything go wrong,user will not be created in this session

    const token = jwt.sign({ userId: newUsers[0].id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction(); //commitTransaction -  create the new user

    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfuly",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction(); //abort the transaction if any error occurs
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {};
