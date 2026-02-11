import { createClient, createServiceClient } from "@/libs/pressbase/server";
import { isAdminEmail } from "@/libs/admin";
import { NextResponse } from "next/server";

// GET - Get a single blog post by slug
export async function GET(request, { params }) {
  try {
    const pb = createClient();
    const servicePb = createServiceClient();
    
    const { slug } = await params;
    
    const { data: { user } } = await pb.auth.getUser();
    const isAdmin = user && isAdminEmail(user.email);
    
    let query = servicePb
      .from("blog_posts")
      .select("*")
      .eq("slug", slug);
    
    // Non-admins can only see published posts
    if (!isAdmin) {
      query = query.eq("status", "published");
    }
    
    const { data: post, error } = await query.single();
    
    if (error || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch post" },
      { status: 500 }
    );
  }
}
