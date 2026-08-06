import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

/**
 * Create a new user
 * @param {Object} userData 
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email }).lean();
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = new User({
    ...userData,
    password: hashedPassword
  });

  const savedUser = await newUser.save();
  
  // Return user without password (as plain object)
  const userObject = savedUser.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * Get all users sorted by newest first
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  return await User.find()
    .sort({ createdAt: -1 })
    .select('-password')
    .lean();
};

/**
 * Get a user by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password').lean();
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Update user details
 * @param {string} id 
 * @param {Object} updateData 
 * @returns {Promise<Object>}
 */
export const updateUser = async (id, updateData) => {
  // If password is being updated, hash it
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

/**
 * Delete a user
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id).select('-password').lean();
  if (!deletedUser) {
    throw new Error('User not found');
  }
  return deletedUser;
};
