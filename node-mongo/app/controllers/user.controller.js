const User = require("../models/user.model.js");
const Joi = require("@hapi/joi");
const { hashing } = require("../helpers/general");
async function createUser(req, res) {
  const joiValidation = {
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    name: Joi.string().min(3).required(),
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
  try {
    let { password, email, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(422).json({
        status: "error",
        message: "Invalid request data",
        error: "email already registerd",
      });
    }
    password = await hashing(password);
    const user = new User({ password, email, name });

    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
}

async function findAllUser(req, res) {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
}

async function findOneUser(req, res) {
  const joiValidation = {
    userId: Joi.required(),
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
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found with id " + userId,
      });
    }
    res.send(user);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "User not found with id " + userId,
      });
    }
    return res.status(500).send({
      message: "Error retrieving user with id " + userId,
    });
  }
}

async function updateUser(req, res) {
  const joiValidation = {
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    name: Joi.string().min(3).required(),
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
  const { userId } = req.params;
  let { password, email, name } = req.body;
  try {
    password = await hashing(password);
    const user = await User.findByIdAndUpdate(
      userId,
      { password, email, name },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        message: "User not found with id " + userId,
      });
    }
    res.send(user);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "User not found with id " + userId,
      });
    }
    return res.status(500).send({
      message: "Error updating user with id " + userId,
    });
  }
}

async function deleteUser(req, res) {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndRemove(userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found with id " + userId,
      });
    }
    res.send({ message: "User deleted successfully!" });
  } catch (err) {
    if (err.kind === "ObjectId" || err.name === "NotFound") {
      return res.status(404).send({
        message: "User not found with id " + userId,
      });
    }
    return res.status(500).send({
      message: "Could not delete user with id " + userId,
    });
  }
}

module.exports = {
  createUser,
  findAllUser,
  findOneUser,
  updateUser,
  deleteUser,
};
