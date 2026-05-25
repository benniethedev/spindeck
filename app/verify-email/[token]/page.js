"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import config from "@/config";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying"); // verifying, success, error, already
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.alreadyVerified) {
            setStatus("already");
            setMessage(data.message);
          } else {
            setStatus("success");
            setMessage(data.message);
          }
          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push("/signin?verified=true");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, router]);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-spindeck-dark rounded-xl p-8 border border-gray-800">
          {status === "verifying" && (
            <>
              <div className="animate-spin text-5xl mb-6">⏳</div>
              <h1 className="text-2xl font-bold text-white mb-2">Verifying your email...</h1>
              <p className="text-gray-400">Please wait while we verify your email address.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-5xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to sign in...</p>
            </>
          )}

          {status === "already" && (
            <>
              <div className="text-5xl mb-6">✓</div>
              <h1 className="text-2xl font-bold text-white mb-2">Already Verified</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to sign in...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-5xl mb-6">❌</div>
              <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/signin"
                  className="block w-full py-3 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Go to Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Create New Account
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to {config.appName}
          </Link>
        </div>
      </div>
    </main>
  );
}
