"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";

export default function EmailBlastManager() {
  const [emailBlasts, setEmailBlasts] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    track_id: "",
    subject: "",
    body: "",
    scheduled_for: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch email blasts
      const { data: blasts, error: blastsError } = await supabase
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
      const { data: approvedTracks, error: tracksError } = await supabase
        .from("tracks")
        .select("id, title, artist_name")
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
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const scheduledDate = formData.scheduled_for 
        ? new Date(formData.scheduled_for).toISOString()
        : null;

      const { data, error } = await supabase
        .from("email_blasts")
        .insert({
          track_id: formData.track_id,
          sent_by: user.user.id,
          subject: formData.subject,
          body: formData.body,
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
      });
      setShowCreateForm(false);
      toast.success("Email blast created successfully");
    } catch (error) {
      console.error("Error creating email blast:", error);
      toast.error("Failed to create email blast");
    }
  };

  const sendEmailBlast = async (blastId) => {
    if (!confirm("Are you sure you want to send this email blast? This action cannot be undone.")) {
      return;
    }

    try {
      // In a real implementation, you'd integrate with an email service like SendGrid, Mailchimp, etc.
      // For now, we'll simulate sending by updating the status
      
      const { error } = await supabase
        .from("email_blasts")
        .update({
          status: "sent",
          date_sent: new Date().toISOString(),
          sent_to: 1000, // Mock recipient count - in reality, this would come from your email service
          recipient_count: 1000,
        })
        .eq("id", blastId);

      if (error) throw error;

      // Update local state
      setEmailBlasts(emailBlasts.map(blast => 
        blast.id === blastId 
          ? { ...blast, status: "sent", date_sent: new Date().toISOString(), sent_to: 1000 }
          : blast
      ));

      toast.success("Email blast sent successfully!");
    } catch (error) {
      console.error("Error sending email blast:", error);
      toast.error("Failed to send email blast");
    }
  };

  const deleteEmailBlast = async (blastId) => {
    if (!confirm("Are you sure you want to delete this email blast?")) {
      return;
    }

    try {
      const { error } = await supabase
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

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "scheduled":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
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
      case "failed":
        return "❌";
      case "draft":
      default:
        return "📝";
    }
  };

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
        <h2 className="text-2xl font-semibold">Email Blast Manager</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create Email Blast"}
        </button>
      </div>

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

              {/* Schedule Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Schedule For (Optional)</label>
                <input
                  type="datetime-local"
                  name="scheduled_for"
                  value={formData.scheduled_for}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                />
              </div>
            </div>

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
                placeholder="Enter email subject"
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
                placeholder="Enter email message"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
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
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{blast.subject}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(blast.status)}`}>
                      {getStatusIcon(blast.status)} {blast.status}
                    </span>
                  </div>
                  
                  {blast.tracks && (
                    <div className="flex items-center space-x-3 mb-3">
                      {blast.tracks.artwork_url && (
                        <img
                          src={blast.tracks.artwork_url}
                          alt={blast.tracks.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{blast.tracks.title}</p>
                        <p className="text-sm text-spindeck-gray">by {blast.tracks.artist_name}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-spindeck-gray text-sm mb-3 line-clamp-2">{blast.body}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-spindeck-gray">
                    <span>Created: {new Date(blast.created_at).toLocaleDateString()}</span>
                    {blast.date_sent && (
                      <span>Sent: {new Date(blast.date_sent).toLocaleDateString()}</span>
                    )}
                    {blast.scheduled_for && (
                      <span>Scheduled: {new Date(blast.scheduled_for).toLocaleDateString()}</span>
                    )}
                    {blast.sent_to && (
                      <span className="text-spindeck-red font-medium">{blast.sent_to.toLocaleString()} recipients</span>
                    )}
                  </div>

                  {/* Stats */}
                  {blast.status === "sent" && (
                    <div className="flex items-center space-x-6 mt-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-blue-500">📧</span>
                        <span>{blast.opened_count || 0} opens</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-green-500">🔗</span>
                        <span>{blast.clicked_count || 0} clicks</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 ml-4">
                  {blast.status === "draft" && (
                    <button
                      onClick={() => sendEmailBlast(blast.id)}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Send Now
                    </button>
                  )}
                  <button
                    onClick={() => deleteEmailBlast(blast.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
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