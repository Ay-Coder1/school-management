const jwt = require("jsonwebtoken");
const secret = process.env.secret;
const generateToken = (id) => {
  return jwt.sign({ id }, secret, { expiresIn: "5d" });
};

module.exports = generateToken;
