import { connect } from '@/utils/db';
import Cargo from "@/app/models/Cargo";
import mongoose from 'mongoose';

export async function PUT(req) {
  await connect();

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/").filter(segment => segment !== "");
  const id = pathSegments.pop(); // Correctly extracts ID

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: "Invalid Cargo ID" }), { 
      status: 400 
    });
  }

  const { 
    note, 
    imageUrl, 
    estimatedDelivery, 
    status,
    origin,
    destination,
    unitCount,
    payment
  } = await req.json();

  try {
    const updatedCargo = await Cargo.findByIdAndUpdate(
      id,
      { 
        note, 
        imageUrl, 
        estimatedDelivery, 
        status,
        origin,
        destination,
        unitCount,
        payment
      },
      { new: true }
    );

    if (!updatedCargo) {
      return new Response(JSON.stringify({ message: "Cargo not found" }), { 
        status: 404 
      });
    }

    return new Response(JSON.stringify(updatedCargo), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error updating cargo" }), { 
      status: 500 
    });
  }
}