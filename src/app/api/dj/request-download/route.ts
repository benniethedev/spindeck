import { NextResponse } from "next/server";
import { createRecord } from "@/lib/storeai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trackId, trackName, name, email } = body;

    if (!trackId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Store the demo request in StoreAI
    await createRecord(`demo-request:${Date.now()}`, {
      trackId,
      trackName,
      djName: name,
      djEmail: email,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // In production: trigger an email notification to the track's artist/label
    // and send a confirmation to the DJ

    return NextResponse.json({
      success: true,
      message: "Demo request submitted successfully",
    });
  } catch (error) {
    console.error("Demo request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
