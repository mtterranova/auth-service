const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/user.model");

dotenv.config();

const AuthController = {};

AuthController.register = async (req, res) => {
  const { username, password } = req.body;

  const usernameRegex = /^[a-z0-9]+$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error:
        "Username must be all lowercase and contain only letters and digits",
    });
  }

  try {
    const userExists = await User.findByUsername(username);

    if (userExists) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const createdUsername = await User.create(username, password);

    res.send(`${createdUsername} registered successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

AuthController.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

AuthController.updateRole = async (req, res) => {
  const { username, role } = req.body;

  if (req.decoded.role !== 2) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action" });
  }

  try {
    const updatedUser = await User.updateRoleByUsername(username, role);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

AuthController.verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "auth required" });
  }

  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        return res.status(401).json({ error: "Token has expired" });
      }

      req.decoded = decoded;
      next();
    }
  });
}

module.exports = AuthController;
