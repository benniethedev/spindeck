import Link from "next/link";
import Image from "next/image";
import BadgeCategory from "./BadgeCategory";
import Avatar from "./Avatar";

// This is the article card that appears in the home page, in the category page, and in the author's page
const CardArticle = ({
  article,
  tag = "h2",
  showCategory = true,
  isImagePriority = false,
}) => {
  const TitleTag = tag;
  const hasImage = article.image?.src;
  const isExternalImage = typeof article.image?.src === "string";

  return (
    <article className="card bg-base-200 rounded-box overflow-hidden">
      {hasImage && (
        <Link
          href={`/blog/${article.slug}`}
          className="link link-hover hover:link-primary"
          title={article.title}
          rel="bookmark"
        >
          <figure>
            {isExternalImage ? (
              // External URL image
              <img
                src={article.image.src}
                alt={article.image.alt || article.title}
                className="aspect-video object-center object-cover hover:scale-[1.03] duration-200 ease-in-out w-full"
              />
            ) : (
              // Imported/local image with blur placeholder
              <Image
                src={article.image.src}
                alt={article.image.alt || article.title}
                width={600}
                height={338}
                priority={isImagePriority}
                placeholder="blur"
                className="aspect-video object-center object-cover hover:scale-[1.03] duration-200 ease-in-out"
              />
            )}
          </figure>
        </Link>
      )}
      <div className="card-body">
        {/* CATEGORIES */}
        {showCategory && article.categories && (
          <div className="flex flex-wrap gap-2">
            {article.categories.map((category) => (
              <BadgeCategory category={category} key={category.slug} />
            ))}
          </div>
        )}

        {/* TITLE WITH RIGHT TAG */}
        <TitleTag className="mb-1 text-xl md:text-2xl font-bold">
          <Link
            href={`/blog/${article.slug}`}
            className="link link-hover hover:link-primary"
            title={article.title}
            rel="bookmark"
          >
            {article.title}
          </Link>
        </TitleTag>

        <div className="text-base-content/80 space-y-4">
          {/* DESCRIPTION */}
          <p className="">{article.description}</p>

          {/* AUTHOR & DATE */}
          <div className="flex items-center gap-4 text-sm">
            {article.author ? (
              <Avatar article={article} />
            ) : (
              <span className="font-medium">SpinRec Team</span>
            )}

            <span itemProp="datePublished">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardArticle;
