// include required packages
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();
 
const port = 3000;
 
// database config
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
 
// initialize app
const app = express();
app.use(express.json());
 
// CORS config
const allowedOrigins = [
    "http://localhost:3000",
    "https://onlinecardapp.onrender.com"
];
 
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false,
    })
);
 
// start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
 
 
// ================= ROUTES =================
 
// GET all cards
app.get('/allcars', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM cars');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allcars' });
    } finally {
        if (connection) await connection.end();
    }
});
 
// ADD a card
app.post('/addcar', async (req, res) => {
    const { car_name, car_pic } = req.body;
    let connection;
 
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO cars (car_name, car_pic) VALUES (?, ?)',
            [card_name, card_pic]
        );
        res.status(201).json({ message: `${car_name} has been added successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add car' });
    } finally {
        if (connection) await connection.end();
    }
});
 
// UPDATE a card
app.put('/updatecar/:id', async (req, res) => {
    const { id } = req.params;
    const { car_name, car_pic } = req.body;
    let connection;
 
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE cars SET car_name=?, car_pic=? WHERE id=?',
            [car_name, car_pic, id]
        );
        res.json({ message: `Car ${id} updated successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update car' });
    } finally {
        if (connection) await connection.end();
    }
});
 
// DELETE a card
app.delete('/deletecar/:id', async (req, res) => {
    const { id } = req.params;
    let connection;
 
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM cars WHERE id=?',
            [id]
        );
        res.json({ message: `Car ${id} deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete car' });
    } finally {
        if (connection) await connection.end();
    }
});
