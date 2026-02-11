/**
 * Setup PressBase schemas for blog system
 * Run with: node scripts/setup-blog-schema.js
 */

const API_BASE = "https://backend.benbond.dev/wp-json/app/v1";
const SERVICE_KEY = "pb_sk_spinrec_b2b503fc2ccaa5c12d9bcbc17df9920b6d5b003fb0ddacd7";

async function createCollection(name, fields) {
  console.log(`\nCreating collection: ${name}...`);
  
  try {
    const response = await fetch(`${API_BASE}/schema`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "X-Service-Key": SERVICE_KEY,
      },
      body: JSON.stringify({ name, fields }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.message?.includes("already exists")) {
        console.log(`  ⚠️  Collection "${name}" already exists, attempting migration...`);
        return await migrateCollection(name, fields);
      }
      throw new Error(data.message || `Failed to create collection: ${response.status}`);
    }

    console.log(`  ✅ Collection "${name}" created successfully`);
    return data;
  } catch (error) {
    console.error(`  ❌ Error creating "${name}":`, error.message);
    return null;
  }
}

async function migrateCollection(name, fields) {
  try {
    const response = await fetch(`${API_BASE}/schema/${name}/migrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "X-Service-Key": SERVICE_KEY,
      },
      body: JSON.stringify({ fields }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`  ℹ️  Migration note:`, data.message || "Fields may already exist");
    } else {
      console.log(`  ✅ Collection "${name}" migrated successfully`);
    }

    return data;
  } catch (error) {
    console.error(`  ❌ Error migrating "${name}":`, error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Setting up blog system schemas...\n");
  console.log("API:", API_BASE);

  // Blog Posts Collection
  await createCollection("blog_posts", {
    title: "VARCHAR(255)",
    slug: "VARCHAR(255)",
    content: "LONGTEXT",
    excerpt: "TEXT",
    featured_image: "TEXT",
    author_id: "VARCHAR(50)",
    category: "VARCHAR(100)",
    status: "VARCHAR(20)",
    published_at: "DATETIME",
    created_at: "DATETIME",
    updated_at: "DATETIME",
    send_email_on_publish: "BOOLEAN",
  });

  // Email Subscribers Collection
  await createCollection("email_subscribers", {
    email: "VARCHAR(255)",
    name: "VARCHAR(255)",
    subscribed_at: "DATETIME",
    status: "VARCHAR(20)",
    source: "VARCHAR(100)",
  });

  console.log("\n✅ Schema setup complete!");
  console.log("\nNext steps:");
  console.log("  1. Visit /admin/blog to create blog posts");
  console.log("  2. Visit /admin/email to manage subscribers");
  console.log("  3. Visit /blog to see published posts");
}

main().catch(console.error);
