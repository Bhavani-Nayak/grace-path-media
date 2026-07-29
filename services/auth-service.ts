/* FIREBASE AUTH DISABLED FOR STATIC SITE MODE
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  deleteUser as firebaseDeleteUser,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
*/

export type User = any;

export async function reloadUser(): Promise<User | null> {
  return null;
}

export async function signInWithGoogle(): Promise<User> {
  console.warn("Authentication is disabled in static site mode.");
  return null;
}

export async function signOut(): Promise<void> {
  // No-op in static mode
}

export async function deleteAccount(): Promise<void> {
  // No-op in static mode
}

export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  callback(null);
  return () => {};
}

export function getCurrentUser(): User | null {
  return null;
}
  