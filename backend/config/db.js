import mongoose from 'mongoose';

// Establishes connection to MongoDB using the connection string from environment variables
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);

    // This stops the application because without database connection
    process.exit(1);
  }
};

export default connectDB;