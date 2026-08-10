import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import Service from '../models/service.model.js';
import Booking from '../models/booking.model.js';
import { BOOKING_STATUS } from '../constants.js';

// Load environment variables from root directory
dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Clear existing collections
    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Service.deleteMany();
    await Booking.deleteMany();

    // 3. Seed Users
    console.log('Seeding users...');
    const user1 = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '9876543210',
      address: '123, Baker Street, London'
    });

    const user2 = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '9876543211',
      address: '456, Elm Street, New York'
    });

    // Hash passwords using bcrypt before saving
    const salt = await bcrypt.genSalt(10);
    user1.password = await bcrypt.hash(user1.password, salt);
    user2.password = await bcrypt.hash(user2.password, salt);

    const savedUser1 = await user1.save();
    const savedUser2 = await user2.save();
    console.log('Users seeded successfully.');

    // 4. Seed Services (Realistic Startup Names)
    console.log('Seeding realistic services...');
    const services = [
      {
        serviceName: 'QuickFix Plumbing',
        category: 'Plumber',
        description: 'Professional plumbing solutions for leaks, blockages, and pipe repairs.',
        price: 500,
        availability: true
      },
      {
        serviceName: 'Spark Electrical',
        category: 'Electrician',
        description: 'Complete commercial and home electrical repair, short circuit fixes, and wiring.',
        price: 800,
        availability: true
      },
      {
        serviceName: 'CleanNest Services',
        category: 'Cleaner',
        description: 'Eco-friendly deep cleaning services for apartments, villas, and workspaces.',
        price: 1500,
        availability: true
      },
      {
        serviceName: 'WoodCraft Carpentry',
        category: 'Carpenter',
        description: 'Custom woodworking, furniture restoration, and minor wooden installations.',
        price: 600,
        availability: true
      },
      {
        serviceName: 'Bright Painters',
        category: 'Painter',
        description: 'Experienced exterior and interior wall painting with putty and color consultancy.',
        price: 2500,
        availability: true
      },
      {
        serviceName: 'Urban Helpers',
        category: 'House Helper',
        description: 'Vetted, reliable house helpers for household cleaning, cooking, and daily support.',
        price: 1200,
        availability: true
      },
      {
        serviceName: 'CoolAir AC Repair',
        category: 'AC Repair',
        description: 'Prompt air conditioner repairs, seasonal servicing, and gas recharging.',
        price: 700,
        availability: true
      }
    ];

    const savedServices = await Service.insertMany(services);
    console.log(`${savedServices.length} Services seeded successfully.`);

    // 5. Seed a Booking
    console.log('Seeding a sample booking...');
    const booking = new Booking({
      userId: savedUser1._id,
      serviceId: savedServices[0]._id, // QuickFix Plumbing
      bookingDate: new Date(),
      bookingTime: '10:00 AM',
      address: savedUser1.address,
      status: BOOKING_STATUS.PENDING
    });

    await booking.save();
    console.log('Sample booking seeded successfully.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during database seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
