import express from "express";
const userRouter = express.Router();
import prisma from "../db/index.js";

userRouter.get('/', async (req, res) => {
    // Gets all the todos from the database
    const users = await prisma.userProfiles.findMany();
    // Responds back to the client with json with a success status and the todos array
    res.status(200).json({
        success: true,
        users,
    });
});

// Define a POST route for creating a new user
userRouter.post('/', async (req, res) => {
    // Destructure `name` and `description` from the request body
    const { name, email } = req.body;
    try {
        // Use Prisma to create a new user entry in the database
        const newUser = await prisma.userProfiles.create({
            data: {
                name,               // Set the name of the todo from the request
                email,        // Set the description of the todo from the request
                authId: req.user.sub, // Assign the auth ID
            },
        });
        
        // Check if the new todo was created successfully
        if (newUser) {
            // Respond with a success status and include the ID of the newly created todo
            res.status(201).json({
                success: true,
                user: newUser.id,
            });
        } else {
            // Respond with a failure status if todo creation failed
            res.status(500).json({
                success: false,
                message: "Failed to create new user",
            });
        }
    } catch (e) {
        // Log the error for debugging purposes
        console.log(e);
        // Respond with a generic error message if something goes wrong
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
});


export default userRouter;