const asyncHandler = require('express-async-handler');
const { User, Todo } = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()



const generateToken = (id) => {
    // The payload of the JWT contains the user's id.
    const payload = { id };
  
    // The JWT is signed with the secret key.
    const secret = process.env.JWT_SECRET;
  
    // The JWT expires in one day (86400 seconds).
    const options = {
      expiresIn: "1h",
    };
  
    // Return the signed JWT as a string.
    return jwt.sign(payload, secret, options);
  };



const registerUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Received request with body:', req.body)


        // Create new user with the provided role
        const newUser = await User.create({
            email,
            password,
        });

        //   Generate Token
        const token = generateToken(newUser.id);

        res.status(201).json({
            "status": "success",
            "message": "Registration successful",
            "data": {
              "accessToken": token,
              "user": newUser.email
            }
        });
    } catch (error) {
        console.error(error)
        res.status(400).json({
            "status": "Bad request",
            "message": "Registration unsuccessful",
            "statusCode": 400
        });
    }
});



const loginUser = asyncHandler(async (req, res) => {
    try {
        // Destructure Email and password from request body
        const { email, password } = req.body;
    
    
        // Check if user exists by searching for mail in the DB
        const user = await User.findOne({ 
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                "status": "Bad request",
                "message": "Authentication failed",
                "statusCode": 401
            });
        }
    
        // Compare entered password with hashed password in DB
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
    
        // Generate the JWT token if password is correct
        const token = generateToken(user.id);
    
        // If user exists and password is correct
        if (user && passwordIsCorrect) {
            // Send the user data and JWT token back to the client
            res.status(200).json({
                "status": "success",
                "message": "Login successful",
                "data": {
                    "accessToken": token,
                    "user": user.email
                }
            });
        } else {
            return res.status(401).json({
                "status": "Bad request",
                "message": "Authentication failed",
                "statusCode": 401
            });
        }
    } catch (e) {
        console.error(e);
        res.status(401).json({
            "status": "Bad request",
            "message": "Authentication failed",
            "statusCode": 401
        });
    }
});

const getTodoById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if user exists by searching for mail in the DB
    const todo = await Todo.findOne({ 
        where: { id }
    });

    if (!todo) {
        return res.status(404).json({
            "status": "Bad request",
            "message": "User not found",
            "statusCode": 404
        });
    }

    return res.status(200).json({
        "status": "success",
        "message": "User found",
        "data": todo
    })
})

const getAllTodo = asyncHandler(async (req, res) => {
    try {
        const todos = await Todo.findAll();
        if (!todos) {
            return res.status(404).json({
                "status": "Bad request",
                "message": "User not found",
                "statusCode": 404
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Todos found",
            "data": todos
        })
    } catch(e) {
        console.error(e);
        res.status(400).json({
            "status": "Bad Request",
            "message": "Client error",
            "statusCode": 400
        })
    }

})

const createTodo = asyncHandler(async (req, res) => {
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Client error",
                "statusCode": 400
            })
        }

        const todo = await Todo.create({description});
        

        return res.status(201).json({
            "status": "success",
            "message": "Todo created successfully",
            "data": todo
        })
    } catch (e) {
        console.error(e);
        res.status(400).json({
            "status": "Bad Request",
            "message": "Client error",
            "statusCode": 400
        })
    }
})

const updateTodo = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body;

        await Todo.update({ description },{ where: { id }});

        return res.status(200).json({
            "status": "success",
            "message": "Todo updated successfully"
        })
    } catch (e) {
        console.error(e);
        res.status(400).json({
            "status": "Bad Request",
            "message": "Client error",
            "statusCode": 400
        })
    }
})

const deleteTodo = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;

        await Todo.destroy({
            where: {id,},
        });

        return res.status(204).json({
            "status": "success",
            "message": "Todo deleted successfully",
        })
    } catch(e) {
        console.error(e);
        res.status(400).json({
            "status": "Bad Request",
            "message": "Client error",
            "statusCode": 400
        })
    }
})

module.exports = { registerUser, loginUser, createTodo, getTodoById, updateTodo, deleteTodo, getAllTodo };