import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/libs/pressbase/server";
import BadgeCategory from "../_assets/components/BadgeCategory";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const dynamic = "force-dynamic";

async function getPost(slug) {
  try {
    const pb = createServiceClient();
    const { data: post, error } = await pb
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !post) return null;
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getRelatedPosts(category, excludeSlug) {
  try {
    const pb = createServiceClient();
    const { data: posts } = await pb
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .eq("category", category)
      .neq("slug", excludeSlug)
      .order("published_at", { ascending: false })
      .limit(3);

    return posts || [];
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { articleId } = await params;
  const post = await getPost(articleId);

  if (!post) {
    return getSEOTags({
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    });
  }

  return getSEOTags({
    title: post.title,
    description: post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, ""),
    canonicalUrlRelative: `/blog/${post.slug}`,
    extraTags: {
      openGraph: {
        title: post.title,
        description: post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, ""),
        url: `/blog/${post.slug}`,
        images: post.featured_image
          ? [
              {
                url: post.featured_image,
                width: 1200,
                height: 660,
              },
            ]
          : [],
        locale: "en_US",
        type: "article",
      },
    },
  });
}

export default async function Article({ params }) {
  const { articleId } = await params;
  const post = await getPost(articleId);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug);

  const category = {
    slug: post.category || "general",
    title: (post.category || "General").charAt(0).toUpperCase() + (post.category || "general").slice(1),
    titleShort: (post.category || "General").charAt(0).toUpperCase() + (post.category || "general").slice(1),
  };

  return (
    <>
      {/* SCHEMA JSON-LD MARKUP FOR GOOGLE */}
      <Script
        type="application/ld+json"
        id={`json-ld-article-${post.slug}`}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://${config.domainName}/blog/${post.slug}`,
            },
            name: post.title,
            headline: post.title,
            description: post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, ""),
            image: post.featured_image,
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
            author: {
              "@type": "Organization",
              name: config.appName,
            },
          }),
        }}
      />

      {/* GO BACK LINK */}
      <div>
        <Link
          href="/blog"
          className="link !no-underline text-base-content/80 hover:text-base-content inline-flex items-center gap-1"
          title="Back to Blog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back to Blog
        </Link>
      </div>

      <article>
        {/* HEADER WITH CATEGORIES AND DATE AND TITLE */}
        <section className="my-12 md:my-20 max-w-[800px]">
          <div className="flex items-center gap-4 mb-6">
            <BadgeCategory category={category} extraStyle="!badge-lg" />
            <span className="text-base-content/80" itemProp="datePublished">
              {new Date(post.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 md:mb-8">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base-content/80 md:text-lg max-w-[700px]">
              {post.excerpt}
            </p>
          )}
        </section>

        <div className="flex flex-col md:flex-row">
          {/* SIDEBAR WITH RELATED ARTICLES */}
          <section className="max-md:pb-4 md:pl-12 max-md:border-b md:border-l md:order-last md:w-72 shrink-0 border-base-content/10">
            <p className="text-base-content/80 text-sm mb-2 md:mb-3">
              Posted by
            </p>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                S
              </div>
              <div>
                <p className="font-medium">{config.appName} Team</p>
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <div className="hidden md:block mt-12">
                <p className="text-base-content/80 text-sm mb-2 md:mb-3">
                  Related reading
                </p>
                <div className="space-y-2 md:space-y-5">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.slug}>
                      <p className="mb-0.5">
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="link link-hover hover:link-primary font-medium"
                          title={relatedPost.title}
                          rel="bookmark"
                        >
                          {relatedPost.title}
                        </Link>
                      </p>
                      <p className="text-base-content/80 max-w-full text-sm">
                        {relatedPost.excerpt ||
                          relatedPost.content?.substring(0, 100).replace(/<[^>]*>/g, "") + "..."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ARTICLE CONTENT */}
          <section className="w-full max-md:pt-4 md:pr-20 space-y-6">
            {/* Featured Image */}
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-box mb-8"
              />
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-base-content 
                prose-p:text-base-content/90 
                prose-a:text-primary 
                prose-strong:text-base-content
                prose-ul:text-base-content/90
                prose-ol:text-base-content/90
                prose-blockquote:text-base-content/80
                prose-code:text-base-content
                prose-pre:bg-base-200"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </section>
        </div>
      </article>

      {/* Newsletter CTA */}
      <section className="mt-16 bg-base-200 rounded-box p-8 text-center">
        <h3 className="text-xl font-bold mb-2">Enjoyed this article?</h3>
        <p className="text-base-content/70 mb-4">
          Subscribe to get more posts like this delivered to your inbox.
        </p>
        <Link
          href="/blog#newsletter"
          className="btn btn-primary"
        >
          Subscribe to Newsletter
        </Link>
      </section>
    </>
  );
}
