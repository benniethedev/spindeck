/**
 * JSON-LD structured data for SEO
 */

export function generateOrganizationJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SpinRec",
    "url": "https://spinrec.com",
    "logo": "https://spinrec.com/logo.png",
    "description": "SpinRec connects independent artists with 5,000+ professional DJs worldwide. Submit your tracks, get featured, and grow your audience.",
    "sameAs": [
      "https://twitter.com/spinrec",
      "https://instagram.com/spinrec",
      "https://soundcloud.com/spinrec",
      "https://open.spotify.com/user/spinrec"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "hello@spinrec.com"
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Starter Plan",
        "description": "Perfect for artists just getting started with DJ promotion.",
        "price": "29",
        "priceCurrency": "USD",
        "unitCode": "MON",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Professional Plan",
        "description": "For serious artists who want maximum visibility and impact.",
        "price": "79",
        "priceCurrency": "USD",
        "unitCode": "MON",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Enterprise Plan",
        "description": "Full-service promotion for labels and established artists.",
        "price": "199",
        "priceCurrency": "USD",
        "unitCode": "MON",
        "availability": "https://schema.org/InStock"
      }
    ]
  };
  return JSON.stringify(data);
}

export function generateWebSiteJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SpinRec",
    "alternateName": ["SpinRec Music", "SpinRec Artist Promotion"],
    "url": "https://spinrec.com",
    "description": "Submit your music to thousands of curated DJs worldwide.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://spinrec.com/dj?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  return JSON.stringify(data);
}

export function generateSoftwareApplicationJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SpinRec",
    "applicationCategory": "MusicApplication",
    "operatingSystem": "Web",
    "description": "Artist promotion and DJ pool platform for independent musicians.",
    "url": "https://spinrec.com",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "29",
      "highPrice": "199",
      "offerCount": "3"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
  return JSON.stringify(data);
}

export function generateBreadcrumbJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://spinrec.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Features",
        "item": "https://spinrec.com/#features"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Pricing",
        "item": "https://spinrec.com/#pricing"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "How It Works",
        "item": "https://spinrec.com/#how-it-works"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Testimonials",
        "item": "https://spinrec.com/#testimonials"
      }
    ]
  };
  return JSON.stringify(data);
}
