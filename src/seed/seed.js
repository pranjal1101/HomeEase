import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import Service from '../models/service.model.js';
import Booking from '../models/booking.model.js';
import { BOOKING_STATUS } from '../constants.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Service.deleteMany();
    await Booking.deleteMany();

    console.log('Seeding users...');
    const user1 = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '9876543210',
      address: '123, Baker Street, Vadodara, Gujarat'
    });

    const user2 = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '9876543211',
      address: '456, Elm Street, Vadodara, Gujarat'
    });

    const salt = await bcrypt.genSalt(10);
    user1.password = await bcrypt.hash(user1.password, salt);
    user2.password = await bcrypt.hash(user2.password, salt);

    const savedUser1 = await user1.save();
    const savedUser2 = await user2.save();
    console.log('Users seeded successfully.');

    console.log('Seeding realistic Indian service providers (3 per category)...');
    const services = [
      {
        serviceName: 'Rajesh Sharma Plumbing Services',
        category: 'Plumber',
        description: 'Master plumber with 10 years experience. Rating: 4.9 out of 5 (120+ reviews). Expert in luxury bathroom fittings, pipe leak detection, and sanitary installs.',
        price: 750,
        availability: true
      },
      {
        serviceName: 'QuickFix Plumbers by Manoj Verma',
        category: 'Plumber',
        description: 'Affordable local plumbing repair with 4 years experience. Rating: 4.5 out of 5 (65+ reviews). Specializes in tap replacement, drain unclogging, and quick fixes.',
        price: 400,
        availability: true
      },
      {
        serviceName: 'Suresh Patel Senior Plumbing Specialist',
        category: 'Plumber',
        description: 'Senior plumbing contractor with 15 years experience. Rating: 4.8 out of 5 (210+ reviews). Expert in full building pipework, water heater installation, and sewage lines.',
        price: 600,
        availability: true
      },
      {
        serviceName: 'Anil Kumar Premium Electrical Services',
        category: 'Electrician',
        description: 'Certified electrical engineer with 9 years experience. Rating: 4.9 out of 5 (140+ reviews). Specializes in smart home wiring, circuit breaker upgrades, and short circuit fixes.',
        price: 850,
        availability: true
      },
      {
        serviceName: 'Spark Electricals by Deepak Saini',
        category: 'Electrician',
        description: 'Budget-friendly residential electrician with 3 years experience. Rating: 4.4 out of 5 (50+ reviews). Quick fan installation, light switch replacement, and minor wiring.',
        price: 450,
        availability: true
      },
      {
        serviceName: 'Vikram Singh Master Electrician',
        category: 'Electrician',
        description: 'Veteran industrial and home electrician with 14 years experience. Rating: 4.8 out of 5 (180+ reviews). Expert in heavy load panel setups, inverter installation, and rewiring.',
        price: 650,
        availability: true
      },
      {
        serviceName: 'CleanNest Deep Cleaning by Sunita Rao',
        category: 'Cleaner',
        description: 'Top-rated deep cleaning specialist with 7 years experience. Rating: 4.9 out of 5 (160+ reviews). Uses eco-friendly products for full home sanitization and sofa shampooing.',
        price: 1800,
        availability: true
      },
      {
        serviceName: 'Express Home Cleaners by Ramesh Yadav',
        category: 'Cleaner',
        description: 'Affordable home cleaning service with 4 years experience. Rating: 4.5 out of 5 (75+ reviews). Kitchen scrubbing, bathroom cleaning, and general dusting.',
        price: 950,
        availability: true
      },
      {
        serviceName: 'Priya Cleaning Solutions',
        category: 'Cleaner',
        description: 'Highly experienced cleaning crew supervisor with 12 years experience. Rating: 4.8 out of 5 (220+ reviews). Specializes in post-renovation cleaning, carpet care, and full house scrubbing.',
        price: 1400,
        availability: true
      },
      {
        serviceName: 'WoodCraft Carpentry by Amit Panchal',
        category: 'Carpenter',
        description: 'Fine woodworking expert with 8 years experience. Rating: 4.9 out of 5 (95+ reviews). Custom modular kitchen cabinets, wardrobe repair, and teak wood furniture restoration.',
        price: 900,
        availability: true
      },
      {
        serviceName: 'FastFix Furniture Repairs by Vinod Carpenter',
        category: 'Carpenter',
        description: 'Pocket-friendly local carpenter with 5 years experience. Rating: 4.4 out of 5 (40+ reviews). Door lock repair, chair fixing, hinge replacement, and minor wooden repairs.',
        price: 450,
        availability: true
      },
      {
        serviceName: 'Rameshwar Artisan Carpentry',
        category: 'Carpenter',
        description: 'Master craftsman with 16 years experience. Rating: 4.8 out of 5 (190+ reviews). Full interior woodwork, custom bed construction, and antique furniture restoration.',
        price: 700,
        availability: true
      },
      {
        serviceName: 'Bright Horizon Wall Painting by Dinesh Joshi',
        category: 'Painter',
        description: 'Premium interior decorator and painter with 9 years experience. Rating: 4.9 out of 5 (110+ reviews). Royal texture painting, waterproof putty application, and color consultation.',
        price: 2800,
        availability: true
      },
      {
        serviceName: 'Budget Painters by Pankaj Sharma',
        category: 'Painter',
        description: 'Economical wall painting services with 4 years experience. Rating: 4.5 out of 5 (55+ reviews). Single room repainting, touch-ups, and basic emulsion wall coats.',
        price: 1500,
        availability: true
      },
      {
        serviceName: 'Master Brush Painters by Vijay Chauhan',
        category: 'Painter',
        description: 'Veteran painting contractor with 15 years experience. Rating: 4.8 out of 5 (230+ reviews). Complete exterior waterproofing, interior wall finishes, and dampness treatment.',
        price: 2200,
        availability: true
      },
      {
        serviceName: 'Urban Helper Elite by Rekha Ben',
        category: 'House Helper',
        description: 'Top-rated domestic helper with 8 years experience. Rating: 4.9 out of 5 (130+ reviews). Background-checked, trained in north and south Indian cooking, dusting, and laundry.',
        price: 1500,
        availability: true
      },
      {
        serviceName: 'Reliable Home Care by Geeta Devi',
        category: 'House Helper',
        description: 'Affordable daily household support with 3 years experience. Rating: 4.5 out of 5 (60+ reviews). Utensil washing, floor mopping, and general house chores.',
        price: 800,
        availability: true
      },
      {
        serviceName: 'Seema Senior Domestic Caretaker',
        category: 'House Helper',
        description: 'Experienced housekeeper and cook with 13 years experience. Rating: 4.8 out of 5 (175+ reviews). Elderly care support, meal preparation, house management, and child assistance.',
        price: 1200,
        availability: true
      },
      {
        serviceName: 'CoolAir AC Technicians by Sanjay Mehta',
        category: 'AC Repair',
        description: 'Certified HVAC engineer with 10 years experience. Rating: 4.9 out of 5 (150+ reviews). Split and window AC gas charging, PCB board repairs, and compressor replacement.',
        price: 950,
        availability: true
      },
      {
        serviceName: 'Quick Chill AC Service by Rahul Gujjar',
        category: 'AC Repair',
        description: 'Low-cost AC servicing specialist with 4 years experience. Rating: 4.4 out of 5 (70+ reviews). Jet pump wet service, filter cleaning, and minor leak fixing.',
        price: 500,
        availability: true
      },
      {
        serviceName: 'ProCool Climate Control by Nitin Solanki',
        category: 'AC Repair',
        description: 'Senior AC repair specialist with 14 years experience. Rating: 4.8 out of 5 (200+ reviews). Inverter AC diagnostics, duct cleaning, seasonal overhaul, and installation.',
        price: 750,
        availability: true
      }
    ];

    const savedServices = await Service.insertMany(services);
    console.log(`${savedServices.length} Services seeded successfully (3 per category).`);

    console.log('Seeding a sample booking...');
    const booking = new Booking({
      userId: savedUser1._id,
      serviceId: savedServices[0]._id,
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
