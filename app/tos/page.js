import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms of Service | ${config.appName}`,
  description: "Read SpinDeck's terms of service. Learn about our platform rules, user responsibilities, and legal agreements.",
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
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
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: December 22, 2024

Welcome to SpinDeck!

These Terms of Service ("Terms") govern your use of the SpinDeck website at https://spindeck.com ("Website") and the services provided by SpinDeck, a subsidiary of NetSwagger LLC. By using our Website and services, you agree to these Terms.

1. Description of SpinDeck

SpinDeck is a multi-genre record pool and music promotion platform that connects artists, DJs, and labels worldwide. We provide services including music distribution, promotional campaigns, DJ pool access, and analytics.

2. User Accounts and Roles

SpinDeck offers three types of user accounts:
- Artists: Upload and promote music tracks
- DJs: Access and download music from our record pool
- Admins: Manage platform operations and content approval

Each user type has specific rights and responsibilities as outlined in their respective dashboard areas.

3. Content and Intellectual Property

- Artists retain ownership of their original music content
- By uploading content, artists grant SpinDeck a non-exclusive license to distribute and promote their music
- Users may not upload content that infringes on third-party intellectual property rights
- SpinDeck reserves the right to remove content that violates our guidelines

4. Subscription and Payment Terms

- Subscription plans are billed monthly or as one-time payments as specified
- All payments are processed securely through Stripe
- Refunds are handled according to our refund policy (7 days for subscription plans)
- Subscription renewals are automatic unless cancelled

5. DJ Pool and Downloads

- DJs must maintain active accounts to access downloads
- Downloaded content is for professional DJ use only
- Redistribution or resale of downloaded content is prohibited
- Download limits may apply based on subscription tier

6. User Data and Privacy

We collect user data including name, email, payment information, and usage analytics to provide our services. For complete details on data handling, please refer to our Privacy Policy at https://spindeck.com/privacy-policy.

7. Content Moderation and Approval

- All uploaded tracks are subject to review and approval
- SpinDeck reserves the right to reject content that doesn't meet our quality standards
- Users will be notified of approval decisions via email

8. Prohibited Activities

Users may not:
- Upload illegal, offensive, or copyrighted content without permission
- Circumvent our security measures or access restrictions
- Create multiple accounts to bypass usage limits
- Use the platform for spam or unsolicited communications

9. Platform Availability

While we strive for 99.9% uptime, SpinDeck does not guarantee uninterrupted service availability. Maintenance windows and technical issues may temporarily affect access.

10. Termination

SpinDeck may terminate accounts for violations of these Terms. Users may cancel their accounts at any time through their account settings.

11. Limitation of Liability

SpinDeck's liability is limited to the amount paid for services in the preceding 12 months. We are not liable for indirect, incidental, or consequential damages.

12. Governing Law

These Terms are governed by the laws of the United States. Any disputes will be resolved in courts within the United States.

13. Updates to Terms

We may update these Terms periodically. Users will be notified of material changes via email and through platform notifications.

14. Contact Information

For questions regarding these Terms of Service, please contact us at:
- Email: support@spindeck.com
- Website: https://spindeck.com/contact

SpinDeck is operated by NetSwagger LLC. Visit https://netswagger.com for more information about our parent company.

Thank you for using SpinDeck!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
