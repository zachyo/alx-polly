'use server';

import { createClient } from '@/lib/supabase/server';
import { LoginFormData, RegisterFormData } from '../types';

/**
 * Handles user login by signing in with an email and password.
 * @param {LoginFormData} data - The login form data containing email and password.
 * @returns {Promise<{ error: string | null }>} An object with an error message if login fails, otherwise null.
 */
export async function login(data: LoginFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Success: no error
  return { error: null };
}

/**
 * Creates a new user account.
 * @param {RegisterFormData} data - The registration form data containing name, email, and password.
 * @returns {Promise<{ error: string | null }>} An object with an error message if registration fails, otherwise null.
 */
export async function register(data: RegisterFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Success: no error
  return { error: null };
}

/**
 * Signs the current user out.
 * @returns {Promise<{ error: string | null }>} An object with an error message if logout fails, otherwise null.
 */
export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Retrieves the currently authenticated user's data.
 * @returns {Promise<User | null>} The user object if authenticated, otherwise null.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Fetches the current user session.
 * @returns {Promise<Session | null>} The session object if a session exists, otherwise null.
 */
export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}
