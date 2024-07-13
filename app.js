const express = require('express');
const userRouter = require('./routes/userRouter');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors(
   { origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
}))

app.use('/user', userRouter)

module.exports= app;

