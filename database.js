const sqlite3 = require('sqlite3').verbose();

const DB_FILE = 'database.db';

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role INTEGER NOT NULL,
    FOREIGN KEY (role) REFERENCES roles(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT UNIQUE NOT NULL
  )
`, [], () => {
  db.run('INSERT INTO roles (role_name) SELECT ? WHERE NOT EXISTS (SELECT * FROM roles WHERE role_name = ?)', ['general', 'general']);
  db.run('INSERT INTO roles (role_name) SELECT ? WHERE NOT EXISTS (SELECT * FROM roles WHERE role_name = ?)', ['admin', 'admin']);
});

module.exports = db;
