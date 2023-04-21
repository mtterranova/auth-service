const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller")

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.put("/user/edit/role", AuthController.verifyToken, AuthController.updateRole);

module.exports = router;