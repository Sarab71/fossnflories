import connectToDatabase from '../../../lib/mongodb';

export const GET = async () => {
  try {
    const db = await connectToDatabase();
    return new Response(JSON.stringify({ success: true, message: 'Database connected successfully!' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Database connection failed' }), {
      status: 500,
    });
  }
};
