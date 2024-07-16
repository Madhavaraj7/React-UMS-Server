
import User from "../models/usermodel.js";
import bcrypt from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    console.log('Valid User:', validUser); 

    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong credentials'));
    }

  
    if (validUser.is_verified !== 1) {
      return next(errorHandler(403, 'User is not verified'));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); 

    res.cookie('access_token', token, {
      httpOnly: true,
      expires: expiryDate
    }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
}



const getAllUsersController = async (req, res) => {
  console.log("hello");
  try {
    const users = await User.find({ is_verified: { $ne: 1 } }).select("username email profilePicture").exec();

    console.log(users);

    res.status(200).json({
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getAllUsersController };

export const deleteUserController = async (req, res) => {
  try {
    const id = req.params.id;

    await User.findByIdAndDelete(id);

    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "User deletion failed",
    });
  }
};


export const getUserDetailsController = async (req, res) => {
  console.log("hello");
  try {
    const users = await User.find({ is_verified: { $ne: 1 } }).select("username email profilePicture").exec();

    console.log(users);

    res.status(200).json({
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const editUserDetailsController = async (req, res, next) => {
  try {
    const updateFields = {
      username: req.body.username,
      email: req.body.email,
    };

    if (req.body.password) {
      updateFields.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({ success: true, ...rest });
  } catch (error) {
    next(error);
  }
};




export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};