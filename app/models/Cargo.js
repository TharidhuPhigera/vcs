import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the schema
const CargoSchema = new mongoose.Schema({
  referenceNumber: { type: String, required: true, unique: true },
  status: { type: String, required: false },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  estimatedDelivery: { type: Date, required: false },
  unitCount: { type: Number, required: true, min: 1 },
  payment: { type: Number, required: true },
  password: { type: String, required: true },
  note: { type: String, required: false },
  imageUrl: { type: String },
});

// Pre-save middleware to hash the password
CargoSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Create the model if it doesn't already exist
const Cargo = mongoose.models.Cargo || mongoose.model('Cargo', CargoSchema);

// Export the model
export default Cargo;