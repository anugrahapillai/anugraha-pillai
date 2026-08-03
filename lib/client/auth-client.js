import { auth } from "@/lib/client/firebase-client";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";

async function post(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "The request could not be completed.");
  return result;
}

export const firebaseAuthClient = {
  async signIn({ email, password }) {
    let idToken = null;
    let authError = null;

    // 1. Authenticate with Production Firebase Auth
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      idToken = await userCredential.user.getIdToken();
    } catch (fbError) {
      authError = fbError;
    }

    // If Firebase Auth sign-in fails, reject immediately with production security message
    if (authError && !idToken) {
      const code = authError.code || "";
      if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        throw new Error("Invalid admin email or password.");
      } else if (code === "auth/too-many-requests") {
        throw new Error("Access temporarily blocked due to repeated failed attempts. Please try again later.");
      }
    }

    // 2. Establish Secure Server Session Cookie
    return post("/api/auth/session", { email, password, idToken });
  },

  async requestPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: "Password reset instructions have been sent to your email." };
    } catch (fbError) {
      return post("/api/auth/reset", { email });
    }
  },

  async signOut() {
    try {
      await signOut(auth);
    } catch (fbError) {
      console.warn("Client Firebase Auth sign-out error:", fbError.message);
    }
    return post("/api/auth/logout");
  },
};

export const phaseOneAuth = firebaseAuthClient;
export const phaseOneAuthNotice = "";
