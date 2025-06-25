const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const SECRET_TOKEN = "my-super-secret-token";

exports.protect = async (req, res, next) => {
  const acessToken = req.headers.authorization;

  if (!acessToken) {
    return res.status(401).json({
      message: "Please login to access this route",
    });
  }

  try {
    const decoded = jwt.verify(acessToken, SECRET_TOKEN);
    const user = await User.findById(decoded.userId);
    req.user = user;
  } catch (ex) {
    console.error(ex.message);
    return res.status(401).json({
      message: ex.message + ": Please login to access this route.",
    });
  }

  next();
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPassCorrect = await bcrypt.compare(password, user.password);

  if (!isPassCorrect) {
    return res.status(401).json({
      message: "Incorrect password",
    });
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
    },
    SECRET_TOKEN,
    {
      expiresIn: 60 * 60, // 1 hour
    }
  );

  return res.status(200).json({
    accessToken,
    message: "User logged in successfully",
  });
};

exports.register = async (req, res) => {
  try {
    const userData = req.body;
    const hasedPass = await bcrypt.hash(userData.password, 12);
    await User.create({ ...userData, password: hasedPass });
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error registering user",
    });
  }
};
