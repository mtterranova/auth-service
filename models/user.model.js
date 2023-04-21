const db = require("../database");
const bcrypt = require("bcrypt");

const User = {};

User.create = async function (username, password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, 1],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(username);
        }
      }
    );
  });
};

User.findByUsername = function (username) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

User.updateRoleByUsername = function (username, role) {
  return new Promise((resolve, reject) => {
    db.run("UPDATE users SET role = ? WHERE username = ?", [role, username], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ username, role });
      }
    });
  });
};

module.exports = User;
