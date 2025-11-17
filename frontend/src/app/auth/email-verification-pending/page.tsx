"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function EmailVerificationPending() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resendVerification } = useAuth();

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await resendVerification(email);
      setMessage("Verification email sent successfully!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-4xl"></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a verification link to <span className="font-medium text-indigo-600">{email}</span>
          </p>
        </div>

        <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
          {message && <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">{message}</div>}

          {error && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-600">Click the link in the email to verify your account.</p>

            <div className="space-y-3">
              <button
                onClick={handleResend}
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? "Sending..." : "Resend verification email"}
              </button>

              <Link
                href="/auth/login"
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
