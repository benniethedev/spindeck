"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "news", label: "News" },
  { value: "tutorials", label: "Tutorials" },
  { value: "features", label: "Features" },
  { value: "industry", label: "Industry" },
  { value: "tips", label: "Tips & Tricks" },
];

export default function BlogPostEditor({ post, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    category: "general",
    status: "draft",
    send_email_on_publish: false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (post) {
      setFormData({
        id: post.id,
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        featured_image: post.featured_image || "",
        category: post.category || "general",
        status: post.status || "draft",
        send_email_on_publish: post.send_email_on_publish || false,
      });
      setSlugManuallyEdited(true);
    }
  }, [post]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slugManuallyEdited ? prev.slug : generateSlug(title),
    }));
  };

  const handleSlugChange = (slug) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: generateSlug(slug) }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setFormData((prev) => ({ ...prev, featured_image: data.url }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {post ? "Edit Post" : "Create New Post"}
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-spindeck-red hover:bg-red-600 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-spindeck-dark border border-gray-700 rounded-lg focus:outline-none focus:border-spindeck-red"
              placeholder="Enter post title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Slug *{" "}
              <span className="text-gray-500 font-normal">
                (URL: /blog/{formData.slug || "..."})
              </span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full px-4 py-3 bg-spindeck-dark border border-gray-700 rounded-lg focus:outline-none focus:border-spindeck-red"
              placeholder="post-url-slug"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <div className="bg-white rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
                modules={quillModules}
                className="h-96"
                placeholder="Write your post content here..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supports rich text formatting, images, and code blocks
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Excerpt{" "}
              <span className="text-gray-500 font-normal">
                (Optional - used in previews)
              </span>
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-3 bg-spindeck-dark border border-gray-700 rounded-lg focus:outline-none focus:border-spindeck-red resize-none"
              placeholder="Brief description of the post..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
            <label className="block text-sm font-medium mb-3">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-spindeck-red"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            {/* Email checkbox */}
            {formData.status === "published" && (
              <label className="flex items-center gap-3 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.send_email_on_publish}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      send_email_on_publish: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-gray-600 text-spindeck-red focus:ring-spindeck-red focus:ring-offset-0"
                />
                <span className="text-sm">Send email blast on publish</span>
              </label>
            )}
          </div>

          {/* Category */}
          <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
            <label className="block text-sm font-medium mb-3">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-spindeck-red"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
            <label className="block text-sm font-medium mb-3">
              Featured Image
            </label>

            {formData.featured_image ? (
              <div className="relative">
                <img
                  src={formData.featured_image}
                  alt="Featured"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, featured_image: "" }))
                  }
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-8 border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-600 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="text-spindeck-gray">Uploading...</span>
                  ) : (
                    <span className="text-spindeck-gray">
                      Click to upload image
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Or paste URL */}
            <div className="mt-3">
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured_image: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-spindeck-red"
                placeholder="Or paste image URL"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quill Editor Styles */}
      <style jsx global>{`
        .ql-container {
          font-size: 16px;
          min-height: 300px;
        }
        .ql-editor {
          min-height: 300px;
        }
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </form>
  );
}
