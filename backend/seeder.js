import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    await User.create({
      name: 'navaneeth9788',
      email: 'navaneeth9788@gmail.com',
      password: 'Navaneeth@530',
      role: 'admin'
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData();
} else {
  importData();
}
