import { createClient, createServiceClient } from "@/libs/pressbase/server";
import { isAdminEmail } from "@/libs/admin";
import { NextResponse } from "next/server";

// GET - List all blog posts (public gets published only, admin gets all)
export async function GET(request) {
  try {
    const pb = createClient();
    const servicePb = createServiceClient();
    
    const { data: { user } } = await pb.auth.getUser();
    const isAdmin = user && isAdminEmail(user.email);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    
    let query = servicePb.from("blog_posts").select("*");
    
    // Non-admins only see published posts
    if (!isAdmin) {
      query = query.eq("status", "published");
    } else if (status) {
      query = query.eq("status", status);
    }
    
    const { data: posts, error } = await query
      .order("published_at", { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - Create a new blog post (admin only)
export async function POST(request) {
  try {
    const pb = createClient();
    const servicePb = createServiceClient();
    
    const { data: { user } } = await pb.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, slug, content, excerpt, featured_image, category, status, send_email_on_publish } = body;
    
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }
    
    // Check for duplicate slug
    const { data: existing } = await servicePb
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }
    
    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || "",
      featured_image: featured_image || "",
      author_id: user.id,
      category: category || "general",
      status: status || "draft",
      send_email_on_publish: send_email_on_publish || false,
      published_at: status === "published" ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data: post, error } = await servicePb
      .from("blog_posts")
      .insert(postData)
      .select()
      .single();
    
    if (error) throw error;
    
    // If publishing and send_email_on_publish is true, trigger email blast
    if (status === "published" && send_email_on_publish) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_URL || ""}/api/email/blast`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: `New Blog Post: ${title}`,
            post_id: post.id,
            type: "blog_post",
          }),
        });
      } catch (emailError) {
        console.error("Failed to send email blast:", emailError);
      }
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}

// PATCH - Update a blog post (admin only)
export async function PATCH(request) {
  try {
    const pb = createClient();
    const servicePb = createServiceClient();
    
    const { data: { user } } = await pb.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    
    // Get existing post
    const { data: existing } = await servicePb
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();
    
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    // Check if slug changed and is unique
    if (updates.slug && updates.slug !== existing.slug) {
      const { data: slugExists } = await servicePb
        .from("blog_posts")
        .select("id")
        .eq("slug", updates.slug)
        .single();
      
      if (slugExists) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }
    
    // Set published_at if publishing for first time
    if (updates.status === "published" && existing.status !== "published") {
      updates.published_at = new Date().toISOString();
      
      // Send email blast if requested
      if (updates.send_email_on_publish) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_URL || ""}/api/email/blast`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject: `New Blog Post: ${updates.title || existing.title}`,
              post_id: id,
              type: "blog_post",
            }),
          });
        } catch (emailError) {
          console.error("Failed to send email blast:", emailError);
        }
      }
    }
    
    updates.updated_at = new Date().toISOString();
    
    const { data: post, error } = await servicePb
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog post (admin only)
export async function DELETE(request) {
  try {
    const pb = createClient();
    const servicePb = createServiceClient();
    
    const { data: { user } } = await pb.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    
    const { error } = await servicePb
      .from("blog_posts")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}
