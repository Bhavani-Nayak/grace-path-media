import {
  // signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  deleteUser as firebaseDeleteUser,
  // sendEmailVerification as firebaseSendEmailVerification,
  onAuthStateChanged,
  type User,
  // type ActionCodeSettings,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

/*
// Email/Password verification settings (commented out - Google auth only)
export function getActionCodeSettings(): ActionCodeSettings {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  return {
    url: `${origin}/login`,
    handleCodeInApp: true,
  };
}

export async function sendVerificationEmail(user?: User): Promise<void> {
  const targetUser = user || auth.currentUser;
  if (!targetUser) throw new Error("No user found to send verification email.");
  await firebaseSendEmailVerification(targetUser, getActionCodeSettings());
}

export async function signUp(
  email: string,
  password: string
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  try {
    await sendVerificationEmail(result.user);
  } catch (err) {
    console.warn("Error sending verification email upon signup:", err);
  }

  // Immediately sign out to prevent auto-login before email verification
  await firebaseSignOut(auth);

  return result.user;
}

export async function signIn(
  email: string,
  password: string
): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);

  // Enforce verification check on standard Email/Password logins
  if (!result.user.emailVerified) {
    await firebaseSignOut(auth);
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  return result.user;
}
*/

export async function reloadUser(): Promise<User | null> {
  const user = auth.currentUser;
  if (!user) return null;
  await user.reload();
  return auth.currentUser;
}

export async function signInWithGoogle(): Promise<User> {
  // Note: Google OAuth automatically verifies email addresses!
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function deleteAccount(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently signed in.");
  await firebaseDeleteUser(user);
}

export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}  