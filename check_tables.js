const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./DATA/datasource2.db');
db.all("SELECT * FROM SwedishMethod", [], (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Data:', rows);
  }
  db.close();
});