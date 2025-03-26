import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import { connect } from '@/utils/db'; 
import User from '@/app/models/User'; 

export async function POST(req) {
  try {
    await connect(); // Connect to the database

    // Parse the JSON data sent in the request
    const { username, password } = await req.json();

    // Find user by username in the database
    const user = await User.findOne({ username });

    if (!user) {
      // If user not found, return a 404 response
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // If password doesn't match, return a 400 response
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400 });
    }

    // Generate JWT token on successful login
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the token and user role
    return new Response(
      JSON.stringify({ token, role: user.role }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during login:', error);
    // Handle unexpected errors by returning a 500 status code
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}