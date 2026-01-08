//include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialize Express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port, () => {
    console.log('Server running on port', port);
});

//Example Route: Get all cards
app.get('/allcars', async (requestAnimationFrame, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.cars'); //no need to specify default schema
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allcars'});
    }
});

//Example Route: Create a new card
app.post('/addCar/', async (req, res) => {const {card_name, card_pic} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO cars (car_name, car_pic) VALUES (?, ?)', [car_name, car_pic]);
        res.status(201).json({message: 'Car ' + car_name + ' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add car ' + car_name});
    }
});