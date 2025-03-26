export default function handler(req, res) {
    res.status(200).json({ 
      MONGO_URI: process.env.MONGO_URI ? 'exists' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV 
    });
  }