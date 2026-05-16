import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';

// Helper to get user from cookie in API routes
export async function getAuthUser() {
  const user = await getUserFromCookies();
  return user;
}
