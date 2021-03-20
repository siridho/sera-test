const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function hashing(input) {
  const result = await new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(input, salt, (error, hash) => {
        if (error) reject(error);

        resolve(hash);
      });
    });
  });

  return result;
}

function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
}

function verifyLogin({ user, password }) {
  let check = bcrypt.compareSync(password, user.password);
  let error = null;
  let token = null;
  if (check) {
    token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.SECRET,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );
  } else {
    error = "password not match";
  }
  return { error, token };
}

module.exports = {
  hashing,
  authenticateToken,
  verifyLogin,
};
