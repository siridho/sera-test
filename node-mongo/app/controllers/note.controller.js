const Note = require("../models/note.model.js");
const Joi = require("@hapi/joi");

async function createNote(req, res) {
  const joiValidation = {
    content: Joi.string().min(3).required(),
    title: Joi.optional().allow("", null),
  };

  await Joi.validate(req.body, joiValidation, (err, value) => {
    if (err) {
      res.status(422).json({
        status: "error",
        message: "Invalid request data",
        error: err.details[0].message,
      });
    }
  });
  const { content, title } = req.body;
  try {
    const note = new Note({
      title: title || "Untitled Note",
      content,
    });

    await note.save();
    res.send(note);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Note.",
    });
  }
}

async function findAllNote(req, res) {
  try {
    const notes = await Note.find();
    res.send(notes);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving notes.",
    });
  }
}

async function findOneNote(req, res) {
  const joiValidation = {
    noteId: Joi.required(),
  };

  await Joi.validate(req.params, joiValidation, (err, value) => {
    if (err) {
      res.status(422).json({
        status: "error",
        message: "Invalid request data",
        error: err.details[0].message,
      });
    }
  });
  const { noteId } = req.params;
  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).send({
        message: "Note not found with id " + noteId,
      });
    }
    res.send(note);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Note not found with id " + noteId,
      });
    }
    return res.status(500).send({
      message: "Error retrieving note with id " + noteId,
    });
  }
}

async function updateNote(req, res) {
  const joiValidation = {
    content: Joi.string().min(3).required(),
    title: Joi.optional().allow("", null),
  };

  await Joi.validate(req.body, joiValidation, (err, value) => {
    if (err) {
      res.status(422).json({
        status: "error",
        message: "Invalid request data",
        error: err.details[0].message,
      });
    }
  });
  const { content, title } = req.body;
  const { noteId } = req.params;
  try {
    const note = await Note.findByIdAndUpdate(
      noteId,
      {
        title: title || "Untitled Note",
        content,
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).send({
        message: "Note not found with id " + noteId,
      });
    }
    res.send(note);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Note not found with id " + noteId,
      });
    }
    return res.status(500).send({
      message: "Error updating note with id " + noteId,
    });
  }
}

async function deleteNote(req, res) {
  const { noteId } = req.params;
  try {
    const note = await Note.findByIdAndRemove(noteId);
    if (!note) {
      return res.status(404).send({
        message: "Note not found with id " + noteId,
      });
    }
    res.send({ message: "Note deleted successfully!" });
  } catch (err) {
    if (err.kind === "ObjectId" || err.name === "NotFound") {
      return res.status(404).send({
        message: "Note not found with id " + noteId,
      });
    }
    return res.status(500).send({
      message: "Could not delete note with id " + noteId,
    });
  }
}

module.exports = {
  createNote,
  findAllNote,
  findOneNote,
  updateNote,
  deleteNote,
};
