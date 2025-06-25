const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { createTokenFroUser } = require("../services/authentication");
const { createHmac } = require("crypto");
const handleRegister = async (req, res) => {
  try {
    const { name, email, password, salt } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        salt,
      },
    });
    if (!user) {
      return res.status(500).json({ message: "Error during registration" });
    }
    return res.redirect("/");
  } catch (err) {
    return res.status(500).json({ message: "Error during registration" });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.isAdmin) {
      return res.cookie("token", createTokenFroUser(user)).redirect("/admin");
    }
    return res.cookie("token", createTokenFroUser(user)).redirect("/");
  } catch (err) {
    return res.status(500).json({ message: "Error during login" });
  }
};
module.exports = { handleRegister, handleLogin };
