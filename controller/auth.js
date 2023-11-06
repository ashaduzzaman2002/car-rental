import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import OTP from "../models/OTP.js";
import User from "../models/User.js";
import { generateOTP } from "../utils/helper.js";

// const client = twilio(process.env.TIWLIO_ACCOUNT_SID, process.env.TIWLIO_AUTH_TOKEN);
const accountSid = 'AC79e078f9ca186159b5c1a3e848c00bac';
const authToken = 'a2f39a136902bd7e0af9c75609d9ae3b';

const client = twilio(accountSid, authToken);

// get user
export const getUser = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized access" });

    res.json({ error: false, message: "User data fetched", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// send otp
export const sendOtp = async (req, res) => {
  const { phoneNumber, type } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ error: true, message: err.array()[0].msg });
  }

  try {
    const user = await User.findOne({ phoneNumber });

    if ((type === "signup" || type === "edit") && user)
      return res
        .status(401)
        .json({ error: true, message: "User already exist" });

    if (type === "signin" && !user)
      return res
        .status(401)
        .json({ error: true, message: "User does not exist" });
    const salt = bcrypt.genSaltSync(10);

    const otp = generateOTP();
    const hashOTP = bcrypt.hashSync(otp, salt);

    const isOTPExist = await OTP.findOne({ phoneNumber });
    let newOtp;
    if (isOTPExist) {
      newOtp = await OTP.findOneAndUpdate({ phoneNumber }, { value: hashOTP });
    } else {
      newOtp = new OTP({
        phoneNumber,
        value: hashOTP,
      });
      await newOtp.save();
    }

    client.messages.create({
      body: `your car rental app otp is  ${otp} please verify before expire.`,
      from: '+13342597676',
      to: `+91${phoneNumber}`
    })
      .then(
        message => {
          console.log(message.sid);
          res.setHeader('Content-Type', 'application/json');
          res.json({
            error: false,
            message: "OTP send successfully",
          });
        })
      .catch(
        error => {
          console.error(error);
          res.status(500).send({ error: true, message: "Fqailed to send an otp " });
        });


  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Signup
export const userSignup = async (req, res) => {
  const { firstname, lastname, email, phoneNumber, otp } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ error: true, message: err.array()[0].msg });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    const isOTPExist = await OTP.findOne({ phoneNumber });
    if (!isOTPExist)
      return res
        .status(400)
        .json({ error: true, message: "OTP does not exists" });

    const isOTPMatched = bcrypt.compareSync(otp, isOTPExist.value);
    if (!isOTPMatched)
      return res.status(400).json({ error: true, message: "Invalid OTP" });

    const newUser = new User({ firstname, lastname, phoneNumber, email });

    await newUser.save();

    res.clearCookie("token");

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRECT, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      error: false,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Login
export const userLogin = async (req, res) => {
  const { otp, phoneNumber } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res
      .status(400)
      .json({ error: true, message: err.array().at(0).msg });
  }

  try {
    let user = await User.findOne({ phoneNumber });

    if (!user)
      return res.status(404).json({ error: true, message: "User not exist" });

    const isOTPExist = await OTP.findOne({ phoneNumber });
    if (!isOTPExist)
      return res
        .status(400)
        .json({ error: true, message: "OTP does not exists" });

    const isOTPMatched = bcrypt.compareSync(otp, isOTPExist.value);
    if (!isOTPMatched)
      return res.status(400).json({ error: true, message: "Invalid OTP" });

    res.clearCookie("token");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRECT, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      httpOnly: true,
      sameSite: "lax",
    });

    res
      .status(200)
      .json({ error: false, message: "User logged in successfully", user });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: true, message: "Internal server error" });
  }
};

// Logout
export const userLogout = async (req, res) => {
  try {
    res.cookie("token", null, {
      path: "/",
      expires: 0,
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      error: false,
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};


// update number
export const updateNumber = async (req, res) => {
  const { phoneNumber, otp } = req.body

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ error: true, message: err.array()[0].msg });
  }

  try {

    const userId = req.userId
    const existingUser = await User.findById(userId)

    if (!existingUser) return res.status(404).json({ error: true, message: 'User does not exist' })

    const registeredNumber = await User.findOne({ phoneNumber });

    if (registeredNumber) {
      return res
        .status(400)
        .json({ error: true, message: "Phonenumber already register" });
    }

    const isOTPExist = await OTP.findOne({ phoneNumber });
    if (!isOTPExist)
      return res
        .status(400)
        .json({ error: true, message: "OTP does not exists" });

    const isOTPMatched = bcrypt.compareSync(otp, isOTPExist.value);
    if (!isOTPMatched)
      return res.status(400).json({ error: true, message: "Invalid OTP" });

    // const updatedProrfile = new User({ phoneNumber });
    const updatedProrfile = await User.findByIdAndUpdate(userId, { phoneNumber })
    updatedProrfile.phoneNumber = phoneNumber

    res.json({
      error: false,
      message: "profile Updated successfully",
      user: updatedProrfile
    });


  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}


// update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId
    const path = req.file.path;

    if (!req.file) {
      return res.status(400).json({ error: true, message: "No file uploaded" });
    }

    const user = await User.findByIdAndUpdate(userId, { profilePic: path })

    if (!user) return res.json({ error: true, message: 'Unauthorized access' })


    res.status(201).json({ error: false, message: "Profile updated successully", user });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: true, message: "internal server error" });
  }
}