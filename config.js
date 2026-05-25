import themes from "daisyui/src/theming/themes";

const config = {
  // REQUIRED
  appName: "SpinRec",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Where Music Meets the Industry - The premier record pool and music promotion platform for artists, DJs, and labels across all genres.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "spinrec.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    // ⚠️ IMPORTANT: Production price IDs must be created in Stripe Dashboard (live mode) and added below
    // See: https://dashboard.stripe.com/products (switch to Live mode)
    plans: [
      {
        // Test: price_1Sv5P52RSmrbs0ADrAupJ0zy
        // TODO: Replace production priceId with real Stripe price ID from live dashboard
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Sv5P52RSmrbs0ADrAupJ0zy"
            : "price_spindeck_basic_prod", // TODO: Replace with live price ID
        name: "Basic",
        description: "For artists starting out",
        price: 29.99,
        priceAnchor: null,
        isMonthly: true,
        uploadLimit: 2, // tracks per month
        features: [
          { name: "2 tracks per month" },
          { name: "1 email blast per month" },
          { name: "Basic analytics" },
          { name: "DJ pool access" },
        ],
      },
      {
        // Test: price_1Sv5P62RSmrbs0ADMQ6IUwdw
        // TODO: Replace production priceId with real Stripe price ID (Silver plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Sv5P62RSmrbs0ADMQ6IUwdw"
            : "price_spindeck_silver_prod", // TODO: Replace with live price ID
        name: "Silver",
        description: "Lifetime access - Save vs 7 months of Basic!",
        price: 200,
        priceAnchor: 209.93, // 7 months of Basic
        isOneTime: true,
        uploadLimit: 10, // tracks per month
        features: [
          { name: "LIFETIME ACCESS", highlight: true },
          { name: "10 tracks per month" },
          { name: "5 email blasts per month" },
          { name: "Advanced analytics" },
          { name: "Priority DJ pool placement" },
          { name: "Download tracking" },
        ],
      },
      {
        isFeatured: true,
        // Test: price_1Sv5P72RSmrbs0ADqHH8GjVh
        // TODO: Replace production priceId with real Stripe price ID (Gold plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Sv5P72RSmrbs0ADqHH8GjVh"
            : "price_spindeck_gold_prod", // TODO: Replace with live price ID
        name: "Gold",
        description: "Lifetime access - Save vs 27 months of Basic!",
        price: 800,
        priceAnchor: 809.73, // 27 months of Basic
        isOneTime: true,
        uploadLimit: 50, // tracks per month
        features: [
          { name: "LIFETIME ACCESS", highlight: true },
          { name: "50 tracks per month" },
          { name: "20 email blasts per month" },
          { name: "Premium analytics dashboard" },
          { name: "Featured placement" },
          { name: "Priority support" },
          { name: "Custom branding" },
        ],
      },
      {
        // Test: price_1Sv5P72RSmrbs0ADHS2x4OsE
        // TODO: Replace production priceId with real Stripe price ID (Platinum plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Sv5P72RSmrbs0ADHS2x4OsE"
            : "price_spindeck_platinum_prod", // TODO: Replace with live price ID
        name: "Platinum",
        description: "Lifetime access - Best value for labels",
        price: 2000,
        priceAnchor: null,
        isOneTime: true,
        uploadLimit: -1, // unlimited
        features: [
          { name: "LIFETIME ACCESS", highlight: true },
          { name: "Unlimited tracks" },
          { name: "Unlimited email blasts" },
          { name: "White-label dashboard" },
          { name: "Dedicated account manager" },
          { name: "API access" },
          { name: "Custom integrations" },
        ],
      },
      {
        // Test: price_1Sv5P82RSmrbs0ADwPkrTBTs
        // TODO: Replace production priceId with real Stripe price ID (Mixtape one-time)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Sv5P82RSmrbs0ADwPkrTBTs"
            : "price_spindeck_mixtape_prod", // TODO: Replace with live price ID
        name: "Mixtape",
        description: "Single mixtape promotion",
        price: 200,
        priceAnchor: null,
        isOneTime: true,
        isAddon: true, // Not a main subscription plan
        features: [
          { name: "Single mixtape upload" },
          { name: "5 targeted email blasts" },
          { name: "30-day analytics" },
          { name: "DJ pool feature" },
        ],
      },
      {
        // Test: price_1Sv5P92RSmrbs0AD9AFS3WPL
        // TODO: Replace production priceId with real Stripe price ID (Newsletter one-time)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Sv5P92RSmrbs0AD9AFS3WPL"
            : "price_spindeck_newsletter_prod", // TODO: Replace with live price ID
        name: "Newsletter",
        description: "Mass email promotion",
        price: 200,
        priceAnchor: null,
        isOneTime: true,
        isAddon: true, // Not a main subscription plan
        features: [
          { name: "10,000 recipient blast" },
          { name: "Custom email template" },
          { name: "Open rate tracking" },
          { name: "Click analytics" },
        ],
      },
    ],
  },
  // Upload limits by plan name (tracks per month, -1 = unlimited)
  uploadLimits: {
    free: 0,
    basic: 2,
    silver: 10,
    gold: 50,
    platinum: -1, // unlimited
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `SpinRec <noreply@spinrec.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `SpinRec Team <team@spinrec.com>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "support@spinrec.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "spindeck",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: "#FF3C3C",
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
};

export default config;
