const app = (module.exports = require("express")());
const notes = require("../controllers/note.controller.js");
const { authenticateToken } = require("../helpers/general");

// Create a new Note
app.post("/", authenticateToken, notes.createNote);

// Retrieve all Notes
app.get("/", authenticateToken, notes.findAllNote);

// Retrieve a single Note with noteId
app.get("/:noteId", authenticateToken, notes.findOneNote);

// Update a Note with noteId
app.put("/:noteId", authenticateToken, notes.updateNote);
// Delete a Note with noteId
app.delete("/:noteId", authenticateToken, notes.deleteNote);
