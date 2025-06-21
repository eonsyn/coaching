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
// export async function signCookies(token, options = {}) {
//   const cookieStore = await  cookies();
//   const existing = await cookieStore.get('session_token');
//   if (existing) {
//     cookieStore.set('session_token', '', {
//       path: '/',
//       maxAge: 0, // Remove existing cookie
//     });
//   }
   

//    await cookieStore.set('session_token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     path: '/',
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     ...options,
//   });
 
// }

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

  const user = await Student.findById(session.userId);
  if (!user) {
    return null;
  }

  return user;


}