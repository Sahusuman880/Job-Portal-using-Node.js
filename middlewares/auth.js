const { createHmac, randomBytes } = require("crypto");
const { validateToken } = require("../services/authentication");
const hashPassword = (req, res, next) => {
  const { password } = req.body;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  req.body.password = hashedPassword;
  req.body.salt = salt;
  next();
};

function checkForAutentication(cookieName) {
  return (req, res, next) => {
    const token = req.cookies[cookieName];
    if (!token) {
      return res.redirect("/login");
    }
    try {
      const user = validateToken(token);
      req.user = user;
    } catch (error) {
      return res.redirect("/login");
    }
    return next();
  };
}

module.exports = { hashPassword, checkForAutentication };
