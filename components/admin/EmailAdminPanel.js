"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EmailAdminPanel({ user }) {
  const [subscribers, setSubscribers] = useState([]);
  const [counts, setCounts] = useState({ active: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusFilter, setStatusFilter] = useState("active");
  const [posts, setPosts] = useState([]);
  const [showComposer, setShowComposer] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
    linkedPostId: "",
  });

  useEffect(() => {
    fetchSubscribers();
    fetchPosts();
  }, [statusFilter]);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`/api/email/blast?status=${statusFilter}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSubscribers(data.subscribers || []);
      setCounts(data.counts || { active: 0, unsubscribed: 0 });
    } catch (error) {
      toast.error("Failed to load subscribers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog?status=published");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleSendBlast = async () => {
    if (!emailData.subject.trim()) {
      toast.error("Subject is required");
      return;
    }

    if (!emailData.content.trim() && !emailData.linkedPostId) {
      toast.error("Content or linked post is required");
      return;
    }

    setSending(true);
    try {
      const payload = {
        subject: emailData.subject,
        ...(emailData.linkedPostId
          ? { type: "blog_post", post_id: emailData.linkedPostId }
          : { html_content: generateEmailHtml(emailData.content) }),
      };

      const res = await fetch("/api/email/blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      toast.success(
        `Sent to ${data.sent} subscribers${data.failed > 0 ? ` (${data.failed} failed)` : ""}`
      );
      setShowComposer(false);
      setEmailData({ subject: "", content: "", linkedPostId: "" });
    } catch (error) {
      toast.error(error.message || "Failed to send email blast");
    } finally {
      setSending(false);
    }
  };

  const generateEmailHtml = (content) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF3C3C; margin: 0; font-size: 28px;">SpinRec</h1>
    </div>
    <div style="background-color: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid #333;">
      <div style="color: #d1d5db; font-size: 16px; line-height: 1.6;">
        ${content.replace(/\n/g, "<br>")}
      </div>
    </div>
    <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">You're receiving this because you subscribed to SpinRec updates.</p>
      <p style="margin: 0;"><a href="{{unsubscribe_link}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Email Management</h1>
            <p className="text-spindeck-gray mt-1">
              Manage subscribers and send email blasts
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => setShowComposer(true)}
              className="px-4 py-2 bg-spindeck-red hover:bg-red-600 rounded-lg font-medium transition-colors"
            >
              ✉️ Compose Email
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
            <h3 className="text-sm font-medium text-spindeck-gray mb-2">
              Active Subscribers
            </h3>
            <p className="text-3xl font-bold text-green-500">{counts.active}</p>
          </div>
          <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
            <h3 className="text-sm font-medium text-spindeck-gray mb-2">
              Unsubscribed
            </h3>
            <p className="text-3xl font-bold text-gray-500">
              {counts.unsubscribed}
            </p>
          </div>
          <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
            <h3 className="text-sm font-medium text-spindeck-gray mb-2">
              Total Ever
            </h3>
            <p className="text-3xl font-bold text-white">
              {counts.active + counts.unsubscribed}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["active", "unsubscribed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-spindeck-red text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Subscribers List */}
        {loading ? (
          <div className="bg-spindeck-dark rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="bg-spindeck-dark rounded-lg p-12 text-center">
            <p className="text-spindeck-gray text-lg">
              No {statusFilter} subscribers found
            </p>
          </div>
        ) : (
          <div className="bg-spindeck-dark rounded-lg border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-sm font-medium text-spindeck-gray">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-spindeck-gray">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-spindeck-gray">
                    Source
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-spindeck-gray">
                    Subscribed
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4">{sub.email}</td>
                    <td className="px-6 py-4 text-spindeck-gray">
                      {sub.name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-gray-700 rounded">
                        {sub.source || "unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-spindeck-gray text-sm">
                      {sub.subscribed_at
                        ? new Date(sub.subscribed_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Email Composer Modal */}
        {showComposer && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-spindeck-dark rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Compose Email Blast</h2>
                  <button
                    onClick={() => setShowComposer(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Recipient Info */}
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-blue-200">
                      This email will be sent to{" "}
                      <strong>{counts.active} active subscribers</strong>
                    </p>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={emailData.subject}
                      onChange={(e) =>
                        setEmailData((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-spindeck-red"
                      placeholder="Email subject line"
                    />
                  </div>

                  {/* Link to Blog Post */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Link to Blog Post{" "}
                      <span className="text-gray-500 font-normal">
                        (optional - auto-generates content)
                      </span>
                    </label>
                    <select
                      value={emailData.linkedPostId}
                      onChange={(e) =>
                        setEmailData((prev) => ({
                          ...prev,
                          linkedPostId: e.target.value,
                          content: e.target.value ? "" : prev.content,
                        }))
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-spindeck-red"
                    >
                      <option value="">No linked post</option>
                      {posts.map((post) => (
                        <option key={post.id} value={post.id}>
                          {post.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Content */}
                  {!emailData.linkedPostId && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Content *
                      </label>
                      <textarea
                        value={emailData.content}
                        onChange={(e) =>
                          setEmailData((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        rows={8}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-spindeck-red resize-none"
                        placeholder="Write your email content here..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use {"{{name}}"} to personalize with subscriber name
                      </p>
                    </div>
                  )}

                  {/* Preview linked post */}
                  {emailData.linkedPostId && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-spindeck-gray mb-2">
                        Preview:
                      </p>
                      <p className="text-sm">
                        Email will include the blog post title, excerpt, and a
                        link to read the full article.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-800">
                  <button
                    onClick={() => setShowComposer(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendBlast}
                    disabled={sending}
                    className="px-6 py-2 bg-spindeck-red hover:bg-red-600 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {sending ? "Sending..." : `Send to ${counts.active} Subscribers`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
