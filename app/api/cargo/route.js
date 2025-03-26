import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Cargo from '@/app/models/Cargo';

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGO_URI);
}

export async function GET() {
  await connectToDatabase();

  try {
    const cargos = await Cargo.find(); // Fetch all cargos from the DB
    return NextResponse.json(cargos); // Return as JSON response
  } catch (error) {
    console.error("Error fetching cargo:", error);
    return NextResponse.json({ message: "Error fetching cargo" }, { status: 500 });
  }
}

export async function POST(req) {
  await connectToDatabase();

  try {
    const data = await req.json(); // Parse JSON body of the request
    const { referenceNumber, status, origin, destination, estimatedDelivery, unitCount, payment, note, imageUrl, password } = data;
    
    // Convert the estimatedDelivery field to a Date object if it's a string
    const deliveryDate = new Date(estimatedDelivery);
    
    const newCargo = new Cargo({
      referenceNumber,
      status,
      origin,
      destination,
      estimatedDelivery: deliveryDate, // Store as Date in MongoDB
      unitCount,
      payment,
      note,
      imageUrl,
      password,
    });

    await newCargo.save(); // Save the new cargo document to the database
    return NextResponse.json(newCargo, { status: 201 }); // Return the created cargo
  } catch (error) {
    console.error("Error adding cargo:", error);
    return NextResponse.json({ message: "Error adding cargo" }, { status: 500 });
  }
}