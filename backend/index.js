const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise'); // Updated import

const app = express();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1@mIronman',
  database: 'tickers_database',
  connectionLimit: 10, // Adjust the connection limit as per your requirements
});

// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Set the origin URL of your frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allow GET requests
  next();
});

// Fetch data from the API and store it in the database
axios
  .get('https://api.wazirx.com/api/v2/tickers')
  .then(async (response) => {
    const tickers = response.data;
    const top10Tickers = Object.values(tickers).slice(0, 10);

    const connection = await pool.getConnection(); // Get a connection from the pool

    for (const ticker of top10Tickers) {
      const { name, last, buy, sell, volume, base_unit } = ticker;

      const insertQuery = `INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [name, last, buy, sell, volume, base_unit];

      try {
        await connection.query(insertQuery, values); // Execute the insert query
        console.log('Data inserted successfully!');
      } catch (err) {
        console.error('Error inserting data into MySQL:', err);
      }
    }

    connection.release(); // Release the connection back to the pool
  })
  .catch((error) => {
    console.error('Error fetching data from API:', error);
  });

// Route to fetch data from the database
app.get('/api/tickers', async (req, res) => {
  const selectQuery = 'SELECT name, last, buy, sell, volume, base_unit FROM tickers LIMIT 10';

  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    const [results] = await connection.query(selectQuery); // Execute the select query
    connection.release(); // Release the connection back to the pool
    res.header('Content-Type', 'text/plain'); // Set the response content type to plain text
    res.send(results.map(row => Object.values(row).join(', ')).join('\n')); // Format the data as text
  } catch (err) {
    console.error('Error retrieving data from MySQL:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = 3000; // Choose your desired port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
