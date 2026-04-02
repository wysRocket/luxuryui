import { useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, LogIn } from "lucide-react";
import { useAppSession } from "../contexts/AppSessionContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    authStatus,
    backendMode,
    isAuthenticated,
    signIn,
    signInWithGoogle,
    isBusy,
    warnings,
  } = useAppSession();
  const redirectTo = useMemo(
    () => new URLSearchParams(location.search).get("redirect") || "/account",
    [location.search],
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (authStatus === "loading") {
    return (
      <div className="p-4 md:p-8 max-w-[680px] mx-auto w-full">
        <section className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 md:p-10 text-sm font-bold text-gray-500 dark:text-gray-400">
          Checking your account session...
        </section>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await signIn({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Could not sign you in.",
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");

    try {
      await signInWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Could not sign you in with Google.";
      const withGuidance =
        message.includes("popup") || message.includes("cancelled")
          ? `${message} If this repeats, enable popups for this site and try again.`
          : message;
      setError(withGuidance);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[680px] mx-auto w-full">
      <section className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-4">
          Account
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
          Log in to your workspace
        </h1>
        <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 mb-8">
          {backendMode === "firebase"
            ? "Sign in with your Firebase-backed account to access your workspace, wallet balance, and unlocked kits across devices. Payment processing remains mock/local for now."
            : "Sign in to top up credits, unlock kits, and access your delivery library."}
        </p>

        {warnings.length > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            {warnings[0]}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {backendMode === "firebase" && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isBusy}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-6 py-4 text-sm font-black text-gray-900 dark:text-white disabled:opacity-60"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.6 0 6.8 1.2 9.3 3.6l7-7C36.3 2.3 30.6 0 24 0 14.6 0 6.5 5.4 2.6 13.2l8.2 6.4C12.8 13.5 17.9 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24.5c0-1.7-.2-3.3-.5-4.9H24v9.3h12.6c-.5 3-2.2 5.5-4.7 7.2l7.4 5.8c4.3-4 7.2-9.9 7.2-17.4z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.8 28.4a14.7 14.7 0 0 1 0-8.8l-8.2-6.4A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l8.2-6.4z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.5 0 12-2.2 16-5.9l-7.4-5.8c-2.1 1.4-4.8 2.2-8.6 2.2-6.1 0-11.2-4-13.1-9.5l-8.2 6.4C6.5 42.6 14.6 48 24 48z"
                  />
                </svg>
                {isBusy ? "Continuing..." : "Continue with Google"}
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                First time with Google on this app? We will create your account
                automatically.
              </p>
            </div>
          )}

          {backendMode === "firebase" && (
            <div className="relative py-1">
              <span className="absolute inset-x-0 top-1/2 h-px bg-gray-200 dark:bg-gray-800" />
              <p className="relative mx-auto w-fit bg-white px-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-400 dark:bg-gray-900 dark:text-gray-500">
                Or use email
              </p>
            </div>
          )}

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            disabled={isBusy}
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-4 text-sm outline-none focus:border-black dark:focus:border-white"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            disabled={isBusy}
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-4 text-sm outline-none focus:border-black dark:focus:border-white"
            required
          />

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-4 text-sm font-black text-white dark:text-black disabled:opacity-60"
          >
            <LogIn size={16} />
            {isBusy ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Need an account?{" "}
          <Link
            to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
            className="font-black text-gray-900 dark:text-white"
          >
            Create one
          </Link>
        </p>
      </section>
    </div>
  );
};

export default LoginPage;
