import { NextRequest, NextResponse } from "next/server";
import { listRecords, getRecordById, updateRecord, createRecord, deleteRecord } from "@/lib/storeai";

function verifyAuth(req: NextRequest): NextResponse | null {
  const auth = req.cookies.get("admin-auth");
  if (!auth?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authErr = verifyAuth(req);
  if (authErr) return authErr;

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const status = url.searchParams.get("status");

    if (action === "count") {
      const result = await listRecords({ prefix: "artist:" });
      return NextResponse.json({ success: true, count: (result.records as Array<{ id: string }>).length });
    }

    let result = await listRecords({ prefix: "artist:" });
    let records = result.records as Array<{ id: string; key: string; data: unknown }>;

    // Filter by status
    if (status) {
      records = records.filter((r) => {
        const s = (r.data as Record<string, unknown>).status as string;
        return s === status;
      });
    }

    // Sort by createdAt descending
    records.sort((a, b) => {
      const da = (a.data as Record<string, unknown>).createdAt as string;
      const db = (b.data as Record<string, unknown>).createdAt as string;
      return (db || "").localeCompare(da || "");
    });

    return NextResponse.json({ success: true, artists: records });
  } catch (err) {
    console.error("Artists API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = verifyAuth(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { action, artistId, data: payload } = body as {
      action?: string;
      artistId?: string;
      data?: Record<string, unknown>;
    };

    switch (action) {
      case "update_status": {
        if (!artistId) return NextResponse.json({ error: "Missing artistId" }, { status: 400 });
        const existing = await getRecordById(artistId);
        if (!existing) return NextResponse.json({ error: "Artist not found" }, { status: 404 });

        const existingData = existing.data as Record<string, unknown>;
        const updatedData = {
          ...existingData,
          status: payload?.status as string,
          isActive: payload?.isActive !== undefined ? payload.isActive : existingData.isActive,
          updatedAt: new Date().toISOString(),
        };

        const updated = await updateRecord(existing.id, updatedData);
        return NextResponse.json({ success: true, artist: updated.data });
      }

      case "update_metadata": {
        if (!artistId) return NextResponse.json({ error: "Missing artistId" }, { status: 400 });
        const existing = await getRecordById(artistId);
        if (!existing) return NextResponse.json({ error: "Artist not found" }, { status: 404 });

        const existingData = existing.data as Record<string, unknown>;
        const updatedData = {
          ...existingData,
          ...(payload || {}),
          updatedAt: new Date().toISOString(),
        };

        const updated = await updateRecord(existing.id, updatedData);
        return NextResponse.json({ success: true, artist: updated.data });
      }

      case "create": {
        const name = payload?.name as string;
        const email = payload?.email as string;
        if (!name || !email) {
          return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
        }

        const now = new Date().toISOString();
        const id = `art_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const key = `artist:${id}`;

        const artist = {
          id,
          key,
          name,
          email,
          plan: (payload?.plan as "starter" | "professional" | "enterprise") || "starter",
          status: "active",
          stripeCustomerId: "",
          stripeSubscriptionId: "",
          createdAt: now,
          updatedAt: now,
          submissionCount: 0,
          isActive: true,
        };

        const created = await createRecord(key, artist);
        return NextResponse.json({ success: true, artist: created.data });
      }

      case "delete": {
        if (!artistId) return NextResponse.json({ error: "Missing artistId" }, { status: 400 });
        await deleteRecord(artistId);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    console.error("Artists POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
