import jwt from 'jsonwebtoken';

export function verifyJWT(token) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT secret is missing in environment');
  }

  try {
    const decoded = jwt.verify(token, secret); // throws if invalid/expired
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}
