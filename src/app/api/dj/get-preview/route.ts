import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get("trackId");

  if (!trackId) {
    return NextResponse.json(
      { error: "Missing trackId parameter" },
      { status: 400 }
    );
  }

  try {
    const { getRecord, getFileUrl } = await import("@/lib/storeai");

    // Try to find the track's download URL in StoreAI
    // Track records are stored with key format: "submission:{id}"
    const submissionKey = `submission:${trackId}`;
    const record = await getRecord(submissionKey);

    if (record && (record.data as Record<string, unknown>).previewUrl) {
      const previewUrl = (record.data as Record<string, unknown>).previewUrl as string;
      return NextResponse.json({ url: previewUrl });
    }

    // Also try getFileUrl in case there's a file-based preview
    if (record) {
      const fileUrl = await getFileUrl(`preview-${trackId}.mp3`);
      if (fileUrl && fileUrl.url) {
        return NextResponse.json({ url: fileUrl.url });
      }
    }

    // Fallback: return empty response — TrackCard will generate audio client-side
    return NextResponse.json({ url: null, fallback: true });
  } catch (error) {
    console.error("Preview URL error:", error);
    // Return fallback on error — client generates audio
    return NextResponse.json({ url: null, fallback: true });
  }
}
