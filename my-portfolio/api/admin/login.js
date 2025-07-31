import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  // Ensure this is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { password } = req.body;
  const { ADMIN_PASSWORD, JWT_SECRET } = process.env;

  // Basic validation
  if (!password || !ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  // Check if the password is correct
  if (password === ADMIN_PASSWORD) {
    // Passwords match, create a JWT
    const token = jwt.sign(
      { user: 'admin' }, // Payload
      JWT_SECRET,
      { expiresIn: '8h' } // Token expires in 8 hours
    );
    return res.status(200).json({ token });
  } else {
    // Passwords do not match
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
}