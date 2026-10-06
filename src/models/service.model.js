import mongoose from 'mongoose';
import { SERVICE_CATEGORIES } from '../constants.js';

const ServiceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: SERVICE_CATEGORIES,
        message: '{VALUE} is not a valid category'
      }
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    availability: {
      type: Boolean,
      default: true
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    image: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: '1 hour',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Service = mongoose.model('Service', ServiceSchema);

export default Service;
