const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controller/userController");
const authorizedUser = require("../middleware/middleware");

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authorizedUser, getProfile);

module.exports = router;
