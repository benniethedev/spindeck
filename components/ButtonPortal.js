"use client";

import { useState } from "react";
import apiClient from "@/libs/api";

// Button to open Stripe Customer Portal for subscription management
// Only shows for users with a customer_id (those who have made a purchase)
const ButtonPortal = ({ 
  customerId, 
  className = "",
  children = "Manage Subscription"
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Don't render if user has no Stripe customer ID
  if (!customerId) {
    return null;
  }

  const handleManageSubscription = async () => {
    setIsLoading(true);

    try {
      const { url } = await apiClient.post("/stripe/create-portal", {
        returnUrl: window.location.href,
      });

      window.location.href = url;
    } catch (e) {
      console.error("Error opening customer portal:", e);
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={handleManageSubscription}
      disabled={isLoading}
      className={`btn ${className}`}
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-xs"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonPortal;
