import { createServiceClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";

// POST - Subscribe to email list
export async function POST(request) {
  try {
    const servicePb = createServiceClient();
    const body = await request.json();
    const { email, name, source } = body;
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    // Check if already subscribed
    const { data: existing } = await servicePb
      .from("email_subscribers")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();
    
    if (existing) {
      if (existing.status === "unsubscribed") {
        // Re-subscribe
        const { data: updated, error } = await servicePb
          .from("email_subscribers")
          .update({ status: "active", subscribed_at: new Date().toISOString() })
          .eq("id", existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return NextResponse.json({ subscriber: updated, resubscribed: true });
      }
      
      return NextResponse.json({ message: "Already subscribed", subscriber: existing });
    }
    
    // Create new subscriber
    const { data: subscriber, error } = await servicePb
      .from("email_subscribers")
      .insert({
        email: email.toLowerCase(),
        name: name || "",
        source: source || "website",
        status: "active",
        subscribed_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      { error: error.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}

// GET - Get subscriber count (admin) or check subscription status
export async function GET(request) {
  try {
    const servicePb = createServiceClient();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (email) {
      // Check if specific email is subscribed
      const { data: subscriber } = await servicePb
        .from("email_subscribers")
        .select("*")
        .eq("email", email.toLowerCase())
        .eq("status", "active")
        .single();
      
      return NextResponse.json({ subscribed: !!subscriber });
    }
    
    // Get total subscriber count
    const { data: subscribers } = await servicePb
      .from("email_subscribers")
      .select("id")
      .eq("status", "active");
    
    return NextResponse.json({ count: subscribers?.length || 0 });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check subscription" },
      { status: 500 }
    );
  }
}

// DELETE - Unsubscribe
export async function DELETE(request) {
  try {
    const servicePb = createServiceClient();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const { error } = await servicePb
      .from("email_subscribers")
      .update({ status: "unsubscribed" })
      .eq("email", email.toLowerCase());
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
