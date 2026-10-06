import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    address: {
      type: String,
      default: '',
      trim: true
    },
    role: {
      type: String,
      enum: ['customer', 'provider', 'admin'],
      default: 'customer'
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    bio: {
      type: String,
      default: '',
      trim: true
    },
    serviceArea: {
      type: String,
      default: '',
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
