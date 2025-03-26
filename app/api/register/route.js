import { connect } from "@/utils/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password, role } = await req.json();

    // Validate role
    if (role !== "admin" && role !== "employee") {
      return NextResponse.json(
        { message: "Invalid role. Must be either 'admin' or 'employee'." },
        { status: 400 }
      );
    }

    // Check if user already exists by username
    const resUserExists = await fetch("http://localhost:3000/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
      });

    const userExistsData = await resUserExists.json();

    if (userExistsData.userExists) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connect to the database
    await connect();

    // Create a new user document
    await User.create({
      username,
      password: hashedPassword,
      role,
    });

    // Initialize session if it doesn't exist
    if (!req.session) {
      req.session = {};
    }

    // Store user information in the session
    req.session.user = { username, role };
    console.log('User session:', req.session.user);

    // Respond with success message
    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    // Log the error and return a failure response
    console.error('Error during registration:', error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}