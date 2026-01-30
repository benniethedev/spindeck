module.exports = {
  siteUrl: process.env.SITE_URL || "https://spinrec.com",
  generateRobotsTxt: true,
  // Exclude internal routes from sitemap
  exclude: [
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
    "/dashboard*",
    "/admin*",
    "/api/*",
    "/checkout*",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/api", "/checkout"],
      },
    ],
  },
};
