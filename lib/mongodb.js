import mongoose from 'mongoose';

let isConnected = false; // Track the connection status

const connectToDatabase = async () => {
  try {
    if (isConnected) {
      console.log('MongoDB is already connected');
      return mongoose.connection.db; // Return the existing connection
    }

    // Use environment variable for MongoDB URI
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true; // Set the connection status to true
    console.log('MongoDB connected successfully');
    return connection.connection.db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectToDatabase;
