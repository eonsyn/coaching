// utils/createToken.js
import jwt from 'jsonwebtoken';

export function generateJWT() {
  const payload = { purpose: 'one-time-access' };
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET; // same secret as backend
  const token = jwt.sign(payload, secret, { expiresIn: '20s' }); // ✅ 20 seconds
  return token;
}
