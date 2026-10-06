import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email }).lean();
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = new User({
    ...userData,
    password: hashedPassword
  });

  const savedUser = await newUser.save();
  
  const userObject = savedUser.toObject();
  delete userObject.password;
  return userObject;
};

export const getAllUsers = async () => {
  return await User.find()
    .sort({ createdAt: -1 })
    .select('-password')
    .lean();
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password').lean();
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUser = async (id, updateData) => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password').lean();

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

export const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id).select('-password').lean();
  if (!deletedUser) {
    throw new Error('User not found');
  }
  return deletedUser;
};
