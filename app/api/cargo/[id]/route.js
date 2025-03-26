import { connect } from '@/utils/db';
import Cargo from "@/app/models/Cargo";

export async function PUT(req) {
  await connect();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
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
      return new Response(JSON.stringify({ message: "Cargo not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedCargo), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error updating cargo" }), { status: 500 });
  }
}