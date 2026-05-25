import { Resend } from "resend";
import config from "@/config";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using the provided parameters.
 *
 * @async
 * @param {Object} params - The parameters for sending the email.
 * @param {string | string[]} params.to - The recipient's email address or an array of email addresses.
 * @param {string} params.subject - The subject of the email.
 * @param {string} params.text - The plain text content of the email.
 * @param {string} params.html - The HTML content of the email.
 * @param {string} [params.replyTo] - The email address to set as the "Reply-To" address.
 * @returns {Promise<Object>} A Promise that resolves with the email sending result data.
 */
export const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  const { data, error } = await resend.emails.send({
    from: config.resend.fromAdmin,
    to,
    subject,
    text,
    html,
    ...(replyTo && { replyTo }),
  });

  if (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }

  return data;
};

/**
 * Sends a promotional email blast with tracking.
 *
 * @async
 * @param {Object} params - The parameters for sending the email blast.
 * @param {string} params.to - The recipient's email address.
 * @param {string} params.subject - The subject of the email.
 * @param {string} params.html - The HTML content of the email.
 * @param {Object[]} [params.tags] - Optional tags for categorization/tracking.
 * @returns {Promise<Object>} A Promise that resolves with the email sending result data.
 */
export const sendBlastEmail = async ({ to, subject, html, tags = [] }) => {
  const { data, error } = await resend.emails.send({
    from: config.resend.fromAdmin,
    to,
    subject,
    html,
    tags: [
      { name: "category", value: "promotional" },
      ...tags
    ]
  });

  if (error) {
    console.error("Error sending blast email:", error.message);
    throw error;
  }

  return data;
};

/**
 * Get the Resend client for advanced operations.
 * @returns {Resend} The Resend client instance.
 */
export const getResendClient = () => resend;
