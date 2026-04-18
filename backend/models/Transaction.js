import mongoose from 'mongoose';

// Defines the structure for financial transactions in the database
const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,  // References the User collection via unique identifier
    ref: 'User',      // Establishes relationship with User model for population queries
    required: true    // Every transaction must belong to a registered user
  },
  type: {
    type: String,
    enum: ['income', 'expense'],  // Restricts values to only these two options
    required: true                // Transaction must be classified as either money in or money out
  },
  category: {
    type: String,
    required: true    // Classifies transaction (e.g., 'Food', 'Rent', 'Salary', 'Shopping')
  },
  amount: {
    type: Number,
    required: true,   // Monetary value of the transaction
    min: 0           // Prevents negative amounts (use type 'expense' for money going out)
  },
  description: {
    type: String,
    trim: true        // Automatically removes whitespace from beginning and end of text
  },
  date: {
    type: Date,
    default: Date.now  // Automatically sets to current date/time if not provided
  },
  createdAt: {
    type: Date,
    default: Date.now  // Timestamp for when the record was created (audit trail)
  }
});

// Creates and exports the Transaction model based on the defined schema
export default mongoose.model('Transaction', transactionSchema);