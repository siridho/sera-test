const User = require("../models/user.model.js");
const Joi = require("@hapi/joi");
const { verifyLogin, hashing } = require("../helpers/general");

async function login(req, res) {
  const joiValidation = {
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
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
    let { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.send({ message: "user not found" });
    }

    const { error, token } = verifyLogin({ user, password });
    if (token) {
      res.send({ user, token });
    } else {
      res.send({ message: "password incorrect" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while login.",
    });
  }
}

async function register(req, res) {
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
module.exports = {
  login,
  register,
};
