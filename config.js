import themes from "daisyui/src/theming/themes";

const config = {
  // REQUIRED
  appName: "SpinDeck",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Where Music Meets the Industry - The premier record pool and music promotion platform for artists, DJs, and labels across all genres.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "spindeck.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_spindeck_basic_dev"
            : "price_spindeck_basic_prod",
        name: "Basic",
        description: "Perfect for new artists starting out",
        price: 29.99,
        priceAnchor: null,
        features: [
          { name: "2 tracks per month" },
          { name: "1 email blast per month" },
          { name: "Basic analytics" },
          { name: "DJ pool access" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_spindeck_silver_dev"
            : "price_spindeck_silver_prod",
        name: "Silver",
        description: "Growing artists ready to expand",
        price: 200,
        priceAnchor: null,
        features: [
          { name: "10 tracks per month" },
          { name: "5 email blasts per month" },
          { name: "Advanced analytics" },
          { name: "Priority DJ pool placement" },
          { name: "Download tracking" },
        ],
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_spindeck_gold_dev"
            : "price_spindeck_gold_prod",
        name: "Gold",
        description: "Professional artists & labels",
        price: 800,
        priceAnchor: null,
        features: [
          { name: "50 tracks per month" },
          { name: "20 email blasts per month" },
          { name: "Premium analytics dashboard" },
          { name: "Featured placement" },
          { name: "Priority support" },
          { name: "Custom branding" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_spindeck_platinum_dev"
            : "price_spindeck_platinum_prod",
        name: "Platinum",
        description: "Elite labels & management",
        price: 2000,
        priceAnchor: null,
        features: [
          { name: "Unlimited tracks" },
          { name: "Unlimited email blasts" },
          { name: "White-label dashboard" },
          { name: "Dedicated account manager" },
          { name: "API access" },
          { name: "Custom integrations" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_spindeck_mixtape_dev"
            : "price_spindeck_mixtape_prod",
        name: "Mixtape",
        description: "One-time mixtape promotion",
        price: 200,
        priceAnchor: null,
        isOneTime: true,
        features: [
          { name: "Single mixtape upload" },
          { name: "5 targeted email blasts" },
          { name: "30-day analytics" },
          { name: "DJ pool feature" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_spindeck_newsletter_dev"
            : "price_spindeck_newsletter_prod",
        name: "Newsletter",
        description: "Mass email promotion",
        price: 200,
        priceAnchor: null,
        isOneTime: true,
        features: [
          { name: "10,000 recipient blast" },
          { name: "Custom email template" },
          { name: "Open rate tracking" },
          { name: "Click analytics" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `SpinDeck <noreply@spindeck.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `SpinDeck Team <team@spindeck.com>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "support@spindeck.com",
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
