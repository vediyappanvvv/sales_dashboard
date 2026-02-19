import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lead from "../models/Lead.js";

dotenv.config();

// Connect DB and then seed (avoid top-level await for compatibility)

const run = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB — starting seed...");
    await seedData();
  } catch (error) {
    console.error("Run Error:", error);
    process.exit(1);
  }
};

const statuses = [
  "New",
  "Contacted",
  "Follow Up",
  "Appointment Booked",
  "Converted",
  "Lost",
];

const names = [
  "Ravi Kumar",
  "Arun Prakash",
  "Suresh Babu",
  "Karthik",
  "Divya",
  "Meena",
  "Vijay",
  "Anitha",
];

const seedData = async () => {
  try {
    console.log("Clearing old leads...");
    await Lead.deleteMany();

    const leads = Array.from({ length: 50 }).map(() => ({
      name: names[Math.floor(Math.random() * names.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      revenue: Math.floor(Math.random() * 10000), // up to 10k revenue
      date: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      ), // last 30 days
    }));

    const inserted = await Lead.insertMany(leads);

    console.log(`Dummy Leads Seeded: ${inserted.length} records 🚀`);
    process.exit();
  } catch (error) {
    console.error("Seed Error:", error);
    process.exit(1);
  }
};

run();
