// lib/auth.js 

import { cookies } from 'next/headers';
import Session from '@/models/Session';
import Student from '@/models/Student';
import dbConnect from './mongodb';
/**
 * Sign and set a secure session cookie
 * @param {string} token - The session token (usually from MongoDB)
 * @param {Object} options - Optional cookie settings
 */
 
/**
 * Clear the session cookie (for logout)
 */
export async function clearCookies() {
  const cookieStore = await cookies();
  cookieStore.set('session_token', '', {
    path: '/',
    maxAge: 0,
  });
}

export async function getLoggedInUser() {
  await dbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token');

  if (!token) {
    return null;
  }

  const session = await Session.findOne({ token: token.value });
  if (!session) {
    return null;
  }

  const user = await Student.findById(session.userId).select('-password').lean();

  if (!user) {
    return null;
  } 
  return user;


}