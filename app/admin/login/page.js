"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { phaseOneAuth } from "@/lib/client/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [state, setState] = useState({ loading: false, error: "", message: "", previewUrl: null });
  const [sessionMessage, setSessionMessage] = useState("");

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("reason");
    const message =
      reason === "signed-out"
        ? ""
        : reason === "session"
        ? "Your session is missing or expired. Sign in again."
        : "";
    const frame = window.requestAnimationFrame(() => setSessionMessage(message));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    setState({ loading: true, error: "", message: "", previewUrl: null });

    try {
      if (mode === "reset") {
        const result = await phaseOneAuth.requestPasswordReset(email);
        setState({
          loading: false,
          error: "",
          message: result.message || "Password reset instructions sent!",
          previewUrl: result.previewUrl || null,
        });
      } else {
        await phaseOneAuth.signIn({ email, password });
        router.replace("/admin/dashboard");
      }
    } catch (error) {
      setState({ loading: false, error: error.message || "Sign in failed.", message: "", previewUrl: null });
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <img
          src="/assets/logo.jpg"
          alt="Anugraha Logo"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            margin: "0 auto 1rem",
            objectFit: "cover",
            border: "2px solid var(--lilac)",
            boxShadow: "0 0 16px rgba(199, 125, 255, 0.5)",
            display: "block",
          }}
        />
        <p className="eyebrow">Content Studio Studio</p>
        <h1 id="login-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          {mode === "signin" ? "Admin Login" : "Reset Admin Password"}
        </h1>

        {sessionMessage && (
          <p className="form-message form-message--success" role="status">
            {sessionMessage}
          </p>
        )}

        <form onSubmit={submit}>
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="admin@domain.com" required />

          {mode === "signin" && (
            <>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                placeholder="••••••••"
                required
              />
            </>
          )}

          {state.error && (
            <p className="form-message form-message--error" role="alert">
              {state.error}
            </p>
          )}

          {state.message && (
            <div className="form-message form-message--success" role="status">
              <p style={{ margin: 0 }}>{state.message}</p>
              {state.previewUrl && (
                <p style={{ marginTop: ".5rem", fontSize: ".8rem" }}>
                  <a href={state.previewUrl} target="_blank" rel="noreferrer" style={{ color: "var(--cyan-glow)", textDecoration: "underline" }}>
                    ✉ View Test Reset Email Preview →
                  </a>
                </p>
              )}
            </div>
          )}

          <Button type="submit" disabled={state.loading}>
            {state.loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Send reset instructions"}
          </Button>
        </form>

        <button
          className="text-button"
          type="button"
          style={{ marginTop: "1rem" }}
          onClick={() => {
            setMode(mode === "signin" ? "reset" : "signin");
            setState({ loading: false, error: "", message: "", previewUrl: null });
          }}
        >
          {mode === "signin" ? "Forgot password?" : "Return to sign in"}
        </button>
      </section>
    </main>
  );
}
