import { NextResponse } from "next/server";
import { createRecord } from "@/lib/storeai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      djName,
      email,
      instagram,
      genre,
      venueType,
      yearsDJing,
      bio,
    } = body;

    // Validation
    if (!djName || !email) {
      return NextResponse.json(
        { error: "DJ name and email are required" },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if DJ already registered
    const { listRecords } = await import("@/lib/storeai");
    const { records } = await listRecords({ key_prefix: "dj:" });
    if (records?.some((r: { key: string }) => r.key === `dj:${email}`)) {
      return NextResponse.json(
        { error: "A DJ account with this email already exists" },
        { status: 409 }
      );
    }

    const djId = `dj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Create DJ record in StoreAI
    await createRecord(`dj:${email}`, {
      id: djId,
      email,
      djName,
      instagram: instagram || null,
      genre,
      venueType,
      yearsDJing,
      bio: bio || "",
      status: "pending",
      role: "dj",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "DJ registration submitted successfully",
      djId,
    });
  } catch (error) {
    console.error("DJ registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
