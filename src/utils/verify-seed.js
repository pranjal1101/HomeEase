import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Service from '../models/service.model.js';
import { SERVICE_CATEGORIES } from '../constants.js';

dotenv.config();

async function verifySeed() {
  await connectDB();
  console.log('--- SEED & CATEGORY VERIFICATION REPORT ---\n');

  const allServices = await Service.find().lean();
  console.log(`Total Services in MongoDB: ${allServices.length}`);

  let allValid = true;

  for (const cat of SERVICE_CATEGORIES) {
    const catServices = allServices.filter(s => s.category === cat);
    console.log(`\nCategory: "${cat}" (${catServices.length} providers):`);
    if (catServices.length !== 3) {
      allValid = false;
    }
    for (const s of catServices) {
      console.log(`  - Name: ${s.serviceName}`);
      console.log(`    Price: ₹${s.price}/hr | Available: ${s.availability}`);
      console.log(`    Desc: ${s.description}`);
    }
  }

  console.log(`\n----------------------------------------`);
  console.log(`Every category has exactly 3 providers: ${allValid ? 'YES' : 'NO'}`);
  console.log(`Total categories: ${SERVICE_CATEGORIES.length}`);
  console.log(`Total providers: ${allServices.length}`);
  console.log(`----------------------------------------\n`);

  process.exit(0);
}

verifySeed().catch(err => {
  console.error(err);
  process.exit(1);
});
