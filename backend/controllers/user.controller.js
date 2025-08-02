
import bcrypt from "bcryptjs";
import {User} from "../Model/user.model.js";
import jwt from "jsonwebtoken";
// register

export const register = async (req, res) => {
  try {
    const { userName, email, phoneNumber, password } = req.body;

    if (!userName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "Something is missing !!",
        success: false,
      });
    }

    let Isuser = await User.findOne({
      email,
    });

    if (Isuser) {
      return res.status(400).json({
        message: "User already exist !!",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userName,
      email,
      password: hashPassword,
      phoneNumber,
    });

    newUser = {
      userName,
      email,
      phoneNumber,
    };

    res.status(201).json({
      message: "Account created successfully !!",
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Error occured !!",
      success: false,
      error:error.message,
    });
  }
};
//login

export const login = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      message: "Something is missing in login !!",
      success: false,
    });
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(400).json({
      message: "No registerd user with given email found !!",
      success: false,
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Invalid password !!",
      success: false,
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res
    .status(201)
    .cookie("token", token, {
      maxAge: 1 * 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: true,
    })
    .json({
      message: "User logged in !!",
      success: true,
    });
};
// logout
// update
