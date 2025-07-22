import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
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
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: December 22, 2024

Thank you for using SpinDeck ("we," "us," or "our"). This Privacy Policy explains how we collect, use, and protect your information when you use our website at https://spindeck.com and our music platform services. SpinDeck is operated by NetSwagger LLC.

By using SpinDeck, you agree to the collection and use of information in accordance with this Privacy Policy.

1. Information We Collect

1.1 Personal Information

We collect the following personal information:

- Name: For account personalization and communication
- Email Address: For account management, notifications, and support
- Payment Information: Processed securely through Stripe (we do not store payment details)
- Profile Information: Username, bio, profile pictures, and other optional details
- Music Content: For artists, this includes uploaded tracks, artwork, and metadata
- User Preferences: Genre preferences, subscription choices, and account settings

1.2 Automatically Collected Information

- Usage Analytics: Track plays, downloads, user interactions with music content
- Technical Information: IP address, browser type, device information, operating system
- Cookies and Tracking: To improve user experience and analyze platform usage
- Performance Data: Platform performance metrics and error reporting

1.3 Music and Content Data

- Audio Files: Uploaded by artists for distribution and promotion
- Metadata: Track information including genre, BPM, key, and other musical details
- User-Generated Content: Comments, reviews, and other community interactions

2. How We Use Your Information

We use collected information for:

- Platform Operations: Account management, authentication, and service delivery
- Music Distribution: Processing, hosting, and distributing uploaded music content
- Analytics and Insights: Providing performance metrics to artists and platform analytics
- Communication: Service updates, promotional campaigns, and customer support
- Payment Processing: Handling subscriptions and transaction processing
- Platform Improvement: Enhancing user experience and developing new features
- Legal Compliance: Meeting regulatory requirements and preventing abuse

3. Information Sharing and Disclosure

We share information in these circumstances:

- Service Providers: With trusted third-party services (Stripe for payments, Supabase for data storage)
- Music Promotion: Artists' music and metadata are shared with DJs and industry contacts through our platform
- Legal Requirements: When required by law, legal process, or government request
- Platform Features: Public profile information and approved music content visible to other users
- Business Transfers: In case of merger, acquisition, or sale of business assets

We do not sell personal information to third parties for marketing purposes.

4. Data Security

We implement appropriate security measures to protect your information:

- Encryption of data in transit and at rest
- Regular security assessments and updates
- Access controls and authentication measures
- Secure payment processing through PCI-compliant providers
- Regular data backups and recovery procedures

5. Your Rights and Choices

You have the following rights:

- Access: Request access to your personal information
- Correction: Update or correct inaccurate information
- Deletion: Request deletion of your account and associated data
- Data Portability: Request export of your data in a portable format
- Communication Preferences: Opt out of marketing communications
- Cookie Controls: Manage cookie preferences through browser settings

6. Data Retention

We retain your information:

- Account Information: While your account is active and for a reasonable period after closure
- Music Content: As long as it remains on the platform or as required by legal obligations
- Analytics Data: In aggregated, anonymized form for business intelligence purposes
- Payment Records: As required by financial regulations and tax law

7. Children's Privacy

SpinDeck is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.

8. International Data Transfers

Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.

9. Third-Party Services

SpinDeck integrates with third-party services:

- Supabase: Database and authentication services
- Stripe: Payment processing
- Email Services: For platform communications
- Analytics Tools: For platform performance monitoring

These services have their own privacy policies governing their data practices.

10. Cookies and Tracking Technologies

We use cookies and similar technologies to:

- Maintain user sessions and authentication
- Remember user preferences and settings
- Analyze platform usage and performance
- Provide personalized content recommendations

You can control cookie settings through your browser preferences.

11. Changes to This Privacy Policy

We may update this Privacy Policy periodically. We will notify users of material changes through:

- Email notifications to registered users
- Platform notifications and announcements
- Updates posted on our website

Continued use of SpinDeck after changes constitutes acceptance of the updated Privacy Policy.

12. Contact Information

For questions about this Privacy Policy or data practices, contact us:

Email: privacy@spindeck.com
Support: support@spindeck.com
Website: https://spindeck.com/contact

Mailing Address:
NetSwagger LLC
Music Division - Privacy Office
United States

Data Protection Officer: privacy@spindeck.com

By using SpinDeck, you acknowledge that you have read and understood this Privacy Policy and agree to our data practices as described herein.`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
