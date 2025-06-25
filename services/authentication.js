const jwt = require("jsonwebtoken");
const secret = "secret";
function createTokenFroUser(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(payload, secret);
}

function validateToken(token) {
  return jwt.verify(token, secret);
}
module.exports = { createTokenFroUser, validateToken };
