"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/pressbase/client";
import toast from "react-hot-toast";

export default function EmailBlastManager() {
  const [emailBlasts, setEmailBlasts] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [recipientCounts, setRecipientCounts] = useState(null);
  const [formData, setFormData] = useState({
    track_id: "",
    subject: "",
    body: "",
    scheduled_for: "",
    recipient_type: "all", // all, djs, artists, labels
  });
  const [testEmail, setTestEmail] = useState("");

  const pb = createClient();

  useEffect(() => {
    fetchData();
    fetchRecipientCounts();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch email blasts
      const { data: blasts, error: blastsError } = await pb
        .from("email_blasts")
        .select(`
          *,
          tracks (
            title,
            artist_name,
            artwork_url
          )
        `)
        .order("created_at", { ascending: false });

      if (blastsError) throw blastsError;

      // Fetch approved tracks for the dropdown
      const { data: approvedTracks, error: tracksError } = await pb
        .from("tracks")
        .select("id, title, artist_name, artwork_url")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (tracksError) throw tracksError;

      setEmailBlasts(blasts || []);
      setTracks(approvedTracks || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipientCounts = async () => {
    try {
      const response = await fetch("/api/email-blast/recipients");
      if (response.ok) {
        const data = await response.json();
        setRecipientCounts(data.counts);
      }
    } catch (error) {
      console.error("Error fetching recipient counts:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createEmailBlast = async (e) => {
    e.preventDefault();
    
    if (!formData.track_id || !formData.subject || !formData.body) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data: user } = await pb.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const scheduledDate = formData.scheduled_for 
        ? new Date(formData.scheduled_for).toISOString()
        : null;

      const { data, error } = await pb
        .from("email_blasts")
        .insert({
          track_id: formData.track_id,
          sent_by: user.user.id,
          subject: formData.subject,
          body: formData.body,
          recipient_type: formData.recipient_type,
          scheduled_for: scheduledDate,
          status: scheduledDate ? "scheduled" : "draft",
        })
        .select(`
          *,
          tracks (
            title,
            artist_name,
            artwork_url
          )
        `)
        .single();

      if (error) throw error;

      setEmailBlasts([data, ...emailBlasts]);
      setFormData({
        track_id: "",
        subject: "",
        body: "",
        scheduled_for: "",
        recipient_type: "all",
      });
      setShowCreateForm(false);
      toast.success("Email blast created successfully");
    } catch (error) {
      console.error("Error creating email blast:", error);
      toast.error("Failed to create email blast");
    }
  };

  const sendTestEmail = async (blastId) => {
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/email-blast/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blastId, testEmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Test email sent to ${testEmail}`);
        setTestEmail("");
      } else {
        throw new Error(data.error || "Failed to send test email");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  const sendEmailBlast = async (blastId) => {
    const blast = emailBlasts.find(b => b.id === blastId);
    const recipientCount = getRecipientCount(blast?.recipient_type);
    
    if (!confirm(`Are you sure you want to send this email blast to ${recipientCount} recipients? This action cannot be undone.`)) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/email-blast/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blastId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update local state
        setEmailBlasts(emailBlasts.map(b => 
          b.id === blastId 
            ? { 
                ...b, 
                status: "sent", 
                date_sent: new Date().toISOString(), 
                sent_to: data.stats?.success || 0,
                recipient_count: recipientCount
              }
            : b
        ));
        
        toast.success(`Email blast sent to ${data.stats?.success || 0} recipients!`);
      } else {
        throw new Error(data.error || "Failed to send email blast");
      }
    } catch (error) {
      console.error("Error sending email blast:", error);
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  const deleteEmailBlast = async (blastId) => {
    if (!confirm("Are you sure you want to delete this email blast?")) {
      return;
    }

    try {
      const { error } = await pb
        .from("email_blasts")
        .delete()
        .eq("id", blastId);

      if (error) throw error;

      setEmailBlasts(emailBlasts.filter(blast => blast.id !== blastId));
      toast.success("Email blast deleted");
    } catch (error) {
      console.error("Error deleting email blast:", error);
      toast.error("Failed to delete email blast");
    }
  };

  const getRecipientCount = (type) => {
    if (!recipientCounts) return "...";
    return recipientCounts[type] || recipientCounts.all || 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "scheduled":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "sending":
        return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "failed":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "draft":
      default:
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return "✅";
      case "scheduled":
        return "⏰";
      case "sending":
        return "🚀";
      case "failed":
        return "❌";
      case "draft":
      default:
        return "📝";
    }
  };

  const getAudienceLabel = (type) => {
    switch (type) {
      case "djs":
        return "DJs Only";
      case "artists":
        return "Artists Only";
      case "labels":
        return "Labels Only";
      default:
        return "All Users";
    }
  };

  const selectedTrack = tracks.find(t => t.id === formData.track_id);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Email Blast Manager</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-600 rounded w-1/4"></div>
          <div className="h-32 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Email Blast Manager</h2>
          <p className="text-spindeck-gray text-sm mt-1">
            Send promotional emails to DJs, labels, and industry contacts via Resend
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create Email Blast"}
        </button>
      </div>

      {/* Recipient Stats */}
      {recipientCounts && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
            <p className="text-sm text-spindeck-gray">All Users</p>
            <p className="text-2xl font-bold">{recipientCounts.all}</p>
          </div>
          <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
            <p className="text-sm text-spindeck-gray">DJs</p>
            <p className="text-2xl font-bold text-green-400">{recipientCounts.djs}</p>
          </div>
          <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
            <p className="text-sm text-spindeck-gray">Artists</p>
            <p className="text-2xl font-bold text-blue-400">{recipientCounts.artists}</p>
          </div>
          <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
            <p className="text-sm text-spindeck-gray">Labels</p>
            <p className="text-2xl font-bold text-purple-400">{recipientCounts.labels}</p>
          </div>
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 mb-8">
          <h3 className="text-lg font-semibold mb-4">Create New Email Blast</h3>
          <form onSubmit={createEmailBlast} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Track Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Track <span className="text-red-500">*</span>
                </label>
                <select
                  name="track_id"
                  value={formData.track_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                  required
                >
                  <option value="">Select a track</option>
                  {tracks.map(track => (
                    <option key={track.id} value={track.id}>
                      {track.title} - {track.artist_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Audience <span className="text-red-500">*</span>
                </label>
                <select
                  name="recipient_type"
                  value={formData.recipient_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                >
                  <option value="all">All Users ({getRecipientCount("all")})</option>
                  <option value="djs">DJs Only ({getRecipientCount("djs")})</option>
                  <option value="artists">Artists Only ({getRecipientCount("artists")})</option>
                  <option value="labels">Labels Only ({getRecipientCount("labels")})</option>
                </select>
              </div>
            </div>

            {/* Selected Track Preview */}
            {selectedTrack && (
              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                {selectedTrack.artwork_url && (
                  <img
                    src={selectedTrack.artwork_url}
                    alt={selectedTrack.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{selectedTrack.title}</p>
                  <p className="text-sm text-spindeck-gray">by {selectedTrack.artist_name}</p>
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                placeholder="🔥 New Heat: [Track Name] by [Artist]"
                required
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                placeholder="Hey there! 

Check out this fire new track that's perfect for your sets. Download it now and be the first to spin it in your city!

- The SpinRec Team"
                required
              />
              <p className="text-xs text-spindeck-gray mt-1">
                The track artwork and download button will be added automatically.
              </p>
            </div>

            {/* Schedule Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Schedule For <span className="text-spindeck-gray">(Optional - leave empty to save as draft)</span>
              </label>
              <input
                type="datetime-local"
                name="scheduled_for"
                value={formData.scheduled_for}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Create Blast
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Email Blasts List */}
      {emailBlasts.length === 0 ? (
        <div className="bg-spindeck-dark rounded-lg p-12 text-center border border-gray-800">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-xl font-semibold mb-2">No email blasts yet</h3>
          <p className="text-spindeck-gray">Create your first email blast to promote tracks to DJs and industry contacts</p>
        </div>
      ) : (
        <div className="space-y-4">
          {emailBlasts.map((blast) => (
            <div key={blast.id} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-3 mb-2">
                    <h3 className="text-lg font-semibold truncate">{blast.subject}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(blast.status)}`}>
                      {getStatusIcon(blast.status)} {blast.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 flex-shrink-0">
                      📣 {getAudienceLabel(blast.recipient_type)}
                    </span>
                  </div>
                  
                  {blast.tracks && (
                    <div className="flex items-center space-x-3 mb-3">
                      {blast.tracks.artwork_url && (
                        <img
                          src={blast.tracks.artwork_url}
                          alt={blast.tracks.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate">{blast.tracks.title}</p>
                        <p className="text-sm text-spindeck-gray truncate">by {blast.tracks.artist_name}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-spindeck-gray text-sm mb-3 line-clamp-2">{blast.body}</p>
                  
                  <div className="flex items-center flex-wrap gap-4 text-sm text-spindeck-gray">
                    <span>Created: {new Date(blast.created_at).toLocaleDateString()}</span>
                    {blast.date_sent && (
                      <span>Sent: {new Date(blast.date_sent).toLocaleDateString()}</span>
                    )}
                    {blast.scheduled_for && blast.status === "scheduled" && (
                      <span className="text-blue-400">
                        📅 Scheduled: {new Date(blast.scheduled_for).toLocaleString()}
                      </span>
                    )}
                    {blast.sent_to > 0 && (
                      <span className="text-spindeck-red font-medium">
                        📨 {blast.sent_to.toLocaleString()} sent
                      </span>
                    )}
                  </div>

                  {/* Stats for sent blasts */}
                  {blast.status === "sent" && (
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📬</span>
                        <div>
                          <p className="text-xs text-spindeck-gray">Delivered</p>
                          <p className="font-bold">{blast.sent_to || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👁️</span>
                        <div>
                          <p className="text-xs text-spindeck-gray">Opens</p>
                          <p className="font-bold text-blue-400">{blast.opened_count || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🖱️</span>
                        <div>
                          <p className="text-xs text-spindeck-gray">Clicks</p>
                          <p className="font-bold text-green-400">{blast.clicked_count || 0}</p>
                        </div>
                      </div>
                      {blast.sent_to > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">📈</span>
                            <div>
                              <p className="text-xs text-spindeck-gray">Open Rate</p>
                              <p className="font-bold text-purple-400">
                                {((blast.opened_count || 0) / blast.sent_to * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🎯</span>
                            <div>
                              <p className="text-xs text-spindeck-gray">Click Rate</p>
                              <p className="font-bold text-yellow-400">
                                {((blast.clicked_count || 0) / blast.sent_to * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {blast.status === "draft" && (
                    <>
                      {/* Test Email Section */}
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="test@email.com"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          className="px-2 py-1.5 bg-gray-800 border border-gray-600 rounded text-sm w-36 focus:outline-none focus:border-spindeck-red"
                        />
                        <button
                          onClick={() => sendTestEmail(blast.id)}
                          disabled={sending || !testEmail}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          Test
                        </button>
                      </div>
                      <button
                        onClick={() => sendEmailBlast(blast.id)}
                        disabled={sending}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            🚀 Send Now
                          </>
                        )}
                      </button>
                    </>
                  )}
                  {blast.status === "scheduled" && (
                    <button
                      onClick={() => sendEmailBlast(blast.id)}
                      disabled={sending}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Send Now
                    </button>
                  )}
                  <button
                    onClick={() => deleteEmailBlast(blast.id)}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-600/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
