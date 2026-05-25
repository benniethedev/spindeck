import config from "@/config";

// Default SEO keywords for DJ pool / record pool industry
const defaultKeywords = [
  config.appName,
  "DJ pool",
  "record pool",
  "music promotion",
  "DJ music download",
  "exclusive tracks",
  "DJ promo",
  "music promotion platform",
  "record pool subscription",
  "DJ remix pool",
  "hip hop record pool",
  "electronic music pool",
  "music industry platform",
  "artist promotion",
  "DJ download service",
];

// These are all the SEO tags you can add to your pages.
// It prefills data with default title/description/OG, etc.. and you can customize it for each page.
// It's already added in the root layout.js so you don't have to add it to every pages
// But I recommend to set the canonical URL for each page (export const metadata = getSEOTags({canonicalUrlRelative: "/"});)
export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
} = {}) => {
  return {
    // up to 50 characters (what does your app do for the user?) > your main should be here
    title: title || config.appName,
    // up to 160 characters (how does your app help the user?)
    description: description || config.appDescription,
    // comprehensive keywords for DJ pool industry
    keywords: keywords || defaultKeywords,
    applicationName: config.appName,
    // set a base URL prefix for other fields that require a fully qualified URL
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3003/"
        : `https://${config.domainName}/`
    ),

    openGraph: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: config.appName,
      locale: "en_US",
      type: "website",
    },

    twitter: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      card: "summary_large_image",
    },

    // If a canonical URL is given, we add it. The metadataBase will turn the relative URL into a fully qualified URL
    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),

    // If you want to add extra tags, you can pass them here
    ...extraTags,
  };
};

// Structured Data for Rich Results on Google
// Learn more: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
// Test your data: https://search.google.com/test/rich-results
export const renderSchemaTags = () => {
  // Main Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.appName,
    description: config.appDescription,
    url: `https://${config.domainName}/`,
    logo: `https://${config.domainName}/icon.png`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@spinrec.com",
      contactType: "customer service",
    },
  };

  // WebSite schema for site search
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.appName,
    url: `https://${config.domainName}/`,
    description: config.appDescription,
  };

  // SoftwareApplication schema for the platform
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.appName,
    description: "Professional DJ pool and music promotion platform for artists, DJs, and labels. Access exclusive tracks, promote your music, and grow your audience.",
    image: `https://${config.domainName}/icon.png`,
    url: `https://${config.domainName}/`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "29.99",
      highPrice: "2000",
      priceCurrency: "USD",
      offerCount: "4",
    },
  };

  // Service schema for the DJ pool service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "SpinRec DJ Pool & Music Promotion",
    provider: {
      "@type": "Organization",
      name: config.appName,
    },
    description: "Premier multi-genre record pool and music promotion platform connecting artists with DJs, labels, and media worldwide.",
    serviceType: "Music Promotion",
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "SpinRec Plans",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Basic Plan",
            description: "2 tracks per month, 1 email blast, basic analytics",
          },
          price: "29.99",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Silver Plan",
            description: "10 tracks per month, 5 email blasts, advanced analytics",
          },
          price: "200",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Gold Plan",
            description: "50 tracks per month, 20 email blasts, premium features",
          },
          price: "800",
          priceCurrency: "USD",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
};
