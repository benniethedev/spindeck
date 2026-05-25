"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import config from "@/config";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState("pending"); // pending, loading, success, error
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus("error");
      setMessage("No email address provided");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(`/api/email/subscribe?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setStatus("success");
      setMessage("You have been successfully unsubscribed.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Failed to unsubscribe. Please try again.");
    }
  };

  useEffect(() => {
    if (!email) {
      setStatus("error");
      setMessage("No email address provided in the link.");
    }
  }, [email]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-spindeck-dark rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          {status === "success" ? "Unsubscribed" : "Unsubscribe"}
        </h1>

        {status === "pending" && email && (
          <>
            <p className="text-gray-400 mb-6">
              Are you sure you want to unsubscribe{" "}
              <span className="text-white font-medium">{email}</span> from{" "}
              {config.appName} emails?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleUnsubscribe}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
              >
                Yes, Unsubscribe Me
              </button>
              <Link
                href="/"
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </Link>
            </div>
          </>
        )}

        {status === "loading" && (
          <div className="py-8">
            <div className="animate-spin w-8 h-8 border-2 border-spindeck-red border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400 mt-4">Processing...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-400 mb-6">{message}</p>
            <p className="text-gray-500 text-sm mb-6">
              You will no longer receive emails from {config.appName}.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Return to Homepage
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Return to Homepage
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-spindeck-red border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
