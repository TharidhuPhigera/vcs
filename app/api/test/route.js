export async function GET(request) {
  return Response.json({ 
    MONGO_URI: process.env.MONGO_URI ? 'exists' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV 
  });
}