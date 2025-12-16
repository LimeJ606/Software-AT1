const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

const sqlite3 = require('sqlite3').verbose(); // Use .verbose() for more detailed error messages

const db2 = new sqlite3.Database('./DATA/datasource2.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database datasource2.db.');
});

app.get('/data2', (req, res) => {
    const sql = `SELECT * FROM SwedishMethod`; // Table name is SwedishMethod

    db2.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json(rows);
    });
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at http://Localhost:${PORT}/index.html`);
});