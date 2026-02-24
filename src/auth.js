import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Register + create user document in Firestore
export async function registerUser({ email, password, profile }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    email: cred.user.email,
    name: profile?.name || "",
    address: profile?.address || "",
    createdAt: serverTimestamp(),
  });

  return cred.user;
}

// Login
export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Logout
export async function logoutUser() {
  await signOut(auth);
}