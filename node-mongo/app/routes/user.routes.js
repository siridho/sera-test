const app = (module.exports = require("express")());
const users = require("../controllers/user.controller.js");
const { authenticateToken } = require("../helpers/general");

// Create a new User
app.post("/", authenticateToken, users.createUser);

// Retrieve all Users
app.get("/", users.findAllUser);

// Retrieve a single User with userId
app.get("/:userId", users.findOneUser);

// Update a User with userId
app.put("/:userId", authenticateToken, users.updateUser);
// Delete a User with userId
app.delete("/:userId", authenticateToken, users.deleteUser);
