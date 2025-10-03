const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

module.exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const requiredFields = [
    { field: "Username", value: username },
    { field: "Email", value: email },
    { field: "Password", value: password },
  ];

  for (let i = 0; i < requiredFields.length; i++) {
    if (!requiredFields[i].value) {
      return res.status(400).json({
        responseMsg: `Provide ${requiredFields[i].field}`,
        success: false,
      });
    }
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (user !== null) {
      return res.status(400).json({
        responseMsg: "Email already exist",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      return res.status(201).json({
        responseMsg: "User created successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(`Error => `, error.message);
    return res.status(400).json({
      responseMsg: "An error occured",
      success: false,
    });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const requiredFields = [
    { field: "Email", value: email },
    { field: "Password", value: password },
  ];

  for (let i = 0; i < requiredFields.length; i++) {
    if (!requiredFields[i].value) {
      return res.status(400).json({
        responseMsg: `Provide ${requiredFields[i].field}`,
        success: false,
      });
    }
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (user === null) {
      return res.status(404).json({
        responseMsg: "Authentication Error",
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        responseMsg: "Authentication failed",
        success: false,
      });
    }

    const expiresIn = 3600000;

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn,
    });

    res.cookie("access", token, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });

    const {
      id,
      password: hashedPassword,
      createdAt,
      updatedAt,
      ...others
    } = user.dataValues;

    return res.status(200).json({
      responseMsg: " Welcome, login successful",
      user: others,
      success: true,
    });
  } catch (error) {
    console.log(`Error => `, error.message);

    return res.status(400).json({
      responseMsg: "An error occured",
      success: false,
    });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const { id, password, active, createdAt, updatedAt, ...otherData } =
      req.user.dataValues;
    return res.status(200).json({
      profile: otherData,
    });
  } catch (error) {
    console.error(error.message);
    return;
  }
};
