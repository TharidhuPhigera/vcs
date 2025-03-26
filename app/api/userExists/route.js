import { connect } from "@/utils/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username } = await req.json();
    console.log("Received username:", username);  // Log username

    // Connect to the database
    await connect();

    // Check if user exists in the database
    const user = await User.findOne({ username }).select("_id");

    // If user exists, return true, otherwise false
    if (user) {
      console.log("User found:", user);
      return NextResponse.json({ userExists: true });
    } else {
      console.log("No user found with the username:", username);
      return NextResponse.json({ userExists: false });
    }
  } catch (error) {
    console.error("Error during user existence check:", error);
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}