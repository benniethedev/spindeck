import { NextRequest, NextResponse } from "next/server";
import { listRecords, getRecordById, updateRecord } from "@/lib/storeai";

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

    if (action === "stats") {
      const result = await listRecords({ prefix: "submission:" });
      const subs = (result.records as Array<{ data: Record<string, unknown> }>) || [];
      const stats = { pending: 0, approved: 0, rejected: 0, in_campaign: 0, total: subs.length };
      for (const rec of subs) {
        const s = (rec.data as Record<string, unknown>).status as string;
        if (s === "pending") stats.pending++;
        else if (s === "approved") stats.approved++;
        else if (s === "rejected") stats.rejected++;
        else if (s === "in_campaign") stats.in_campaign++;
      }
      return NextResponse.json({ success: true, stats });
    }

    // Fetch submissions with optional status filter
    let result = await listRecords({ prefix: "submission:" });
    let records = result.records as Array<{ id: string; key: string; data: unknown }>;

    // Filter by status if provided
    if (status && status !== "all") {
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

    return NextResponse.json({ success: true, submissions: records });
  } catch (err) {
    console.error("Submissions API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = verifyAuth(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { action, submissionId, status, note, metadata } = body as {
      action?: string;
      submissionId?: string;
      status?: string;
      note?: string;
      metadata?: Record<string, unknown>;
    };

    switch (action) {
      case "update_status": {
        if (!submissionId) {
          return NextResponse.json({ error: "Missing submissionId" }, { status: 400 });
        }
        const existing = await getRecordById(submissionId);
        if (!existing) {
          return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        const validStatuses = ["pending", "approved", "rejected", "in_campaign"];
        if (!validStatuses.includes(status as string)) {
          return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const existingData = existing.data as Record<string, unknown>;
        const statusHistory = (existingData.statusHistory || []) as Array<{
          status: string;
          timestamp: string;
          note?: string;
        }>;

        const updatedData = {
          ...existingData,
          status,
          statusHistory: [
            ...statusHistory,
            { status, timestamp: new Date().toISOString(), note: note || `Status changed to ${status}` },
          ],
          updatedAt: new Date().toISOString(),
        };

        const updated = await updateRecord(existing.id, updatedData);
        return NextResponse.json({ success: true, submission: updated.data });
      }

      case "update_metadata": {
        if (!submissionId) {
          return NextResponse.json({ error: "Missing submissionId" }, { status: 400 });
        }
        const existing = await getRecordById(submissionId);
        if (!existing) {
          return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        const existingData = existing.data as Record<string, unknown>;
        const updatedData = {
          ...existingData,
          ...(metadata || {}),
          updatedAt: new Date().toISOString(),
        };

        const updated = await updateRecord(existing.id, updatedData);
        return NextResponse.json({ success: true, submission: updated.data });
      }

      case "bulk_approve": {
        const ids = (body.ids as string[]) || [];
        const results = [];
        for (const id of ids) {
          try {
            const existing = await getRecordById(id);
            if (existing) {
              const existingData = existing.data as Record<string, unknown>;
              const statusHistory = (existingData.statusHistory || []) as Array<{
                status: string;
                timestamp: string;
                note?: string;
              }>;
              const updatedData = {
                ...existingData,
                status: "approved",
                statusHistory: [
                  ...statusHistory,
                  { status: "approved", timestamp: new Date().toISOString(), note: note || "Bulk approved" },
                ],
                updatedAt: new Date().toISOString(),
              };
              await updateRecord(existing.id, updatedData);
              results.push({ id, success: true });
            }
          } catch (e) {
            results.push({ id, success: false, error: String(e) });
          }
        }
        return NextResponse.json({ success: true, results });
      }

      case "bulk_reject": {
        const ids = (body.ids as string[]) || [];
        const results = [];
        for (const id of ids) {
          try {
            const existing = await getRecordById(id);
            if (existing) {
              const existingData = existing.data as Record<string, unknown>;
              const statusHistory = (existingData.statusHistory || []) as Array<{
                status: string;
                timestamp: string;
                note?: string;
              }>;
              const updatedData = {
                ...existingData,
                status: "rejected",
                statusHistory: [
                  ...statusHistory,
                  { status: "rejected", timestamp: new Date().toISOString(), note: note || "Bulk rejected" },
                ],
                updatedAt: new Date().toISOString(),
              };
              await updateRecord(existing.id, updatedData);
              results.push({ id, success: true });
            }
          } catch (e) {
            results.push({ id, success: false, error: String(e) });
          }
        }
        return NextResponse.json({ success: true, results });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    console.error("Submissions POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
