import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';  // Fixed typo: 'bcyptjs' → 'bcryptjs'

// Defines the structure for user accounts in the database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,    // User must provide a name during registration
    trim: true         // Removes whitespace from beginning and end of name
  },
  email: {
    type: String,
    required: true,    // Email is mandatory for login and communication
    unique: true,      // Prevents multiple accounts with the same email address
    lowercase: true,   // Automatically converts email to lowercase for consistency
    trim: true         // Removes accidental spaces around email
  },
  password: {
    type: String,
    required: true     // Password is required but will be hashed before storing
  },
  currency: {
    type: String,
    default: 'USD'     // Default currency for user's financial transactions (e.g., USD, EUR, GBP)
  },
  createdAt: {
    type: Date,
    default: Date.now  // Automatically sets account creation timestamp
  }
});

// MIDDLEWARE: Automatically hashes password BEFORE saving to database
userSchema.pre('save', async function (next) {
  // Only hash if password field was modified (not during profile updates)
  if (!this.isModified('password')) return next();

  // Hash password with salt strength of 10 rounds
  this.password = await bcrypt.hash(this.password, 10);
  next();  // Continue with save operation
});

// CUSTOM METHOD: Compares login password with stored hashed password
userSchema.methods.comparePassword = async function (password) {
  // Returns true if passwords match, false otherwise
  return await bcrypt.compare(password, this.password);
};

// Creates and exports the User model for database operations
export default mongoose.model('User', userSchema);