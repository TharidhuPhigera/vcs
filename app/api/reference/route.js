import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Cargo from '@/app/models/Cargo';

async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGO_URI);
}

export async function POST(req) {
  await connectToDatabase();

  try {
    const { referenceNumber, password } = await req.json();

    // Find cargo with the reference number
    const cargo = await Cargo.findOne({ referenceNumber });

    if (!cargo) {
      return NextResponse.json({ message: "Cargo not found" }, { status: 404 });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, cargo.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid reference number or password" }, { status: 401 });
    }

    console.log("Cargo found:", cargo);  // Log the cargo data to see if it’s correct
    return NextResponse.json(cargo);  // Return cargo details if found
  } catch (error) {
    console.error("Error fetching cargo details:", error);
    return NextResponse.json({ message: "Error fetching cargo details" }, { status: 500 });
  }
}