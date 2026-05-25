import { createServiceClient } from "@/libs/pressbase/server";
import CardArticle from "./_assets/components/CardArticle";
import NewsletterForm from "@/components/NewsletterForm";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const dynamic = "force-dynamic";

export const metadata = getSEOTags({
  title: `${config.appName} Blog | Music Industry News & Tips`,
  description:
    "Stay updated with the latest music industry news, DJ tips, and artist promotion strategies from SpinRec.",
  canonicalUrlRelative: "/blog",
});

async function getPosts() {
  try {
    const pb = createServiceClient();
    const { data: posts, error } = await pb
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return posts || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function Blog() {
  const posts = await getPosts();
  
  // Transform posts to match the card component format
  const articlesToDisplay = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.excerpt || post.content?.substring(0, 200).replace(/<[^>]*>/g, "") + "...",
    publishedAt: post.published_at,
    image: post.featured_image
      ? {
          src: post.featured_image,
          urlRelative: post.featured_image,
          alt: post.title,
        }
      : null,
    categories: [
      {
        slug: post.category || "general",
        title: (post.category || "General").charAt(0).toUpperCase() + (post.category || "general").slice(1),
        titleShort: (post.category || "General").charAt(0).toUpperCase() + (post.category || "general").slice(1),
      },
    ],
    author: {
      name: "SpinRec Team",
      slug: "spinrec",
    },
  }));

  return (
    <>
      <section className="text-center max-w-xl mx-auto mt-12 mb-24 md:mb-32">
        <h1 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-6">
          The {config.appName} Blog
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Stay updated with the latest music industry news, DJ tips, and artist
          promotion strategies.
        </p>
      </section>

      {articlesToDisplay.length === 0 ? (
        <section className="text-center py-12">
          <p className="text-base-content/60 text-lg">
            No posts yet. Check back soon!
          </p>
        </section>
      ) : (
        <section className="grid lg:grid-cols-2 mb-24 md:mb-32 gap-8">
          {articlesToDisplay.map((article, i) => (
            <CardArticle
              article={article}
              key={article.slug}
              isImagePriority={i <= 2}
            />
          ))}
        </section>
      )}

      {/* Newsletter Signup */}
      <section id="newsletter" className="bg-base-200 rounded-box p-8 md:p-12 text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-base-content/70 mb-6 max-w-md mx-auto">
          Get the latest posts, tips, and industry news delivered straight to
          your inbox.
        </p>
        <NewsletterForm source="blog" />
      </section>
    </>
  );
}
