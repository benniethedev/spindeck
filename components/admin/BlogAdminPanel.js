"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import BlogPostEditor from "./BlogPostEditor";

export default function BlogAdminPanel({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [filter, setFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPosts(data.posts || []);
    } catch (error) {
      toast.error("Failed to load posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Post deleted");
      setPosts(posts.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleSave = async (postData) => {
    try {
      const isEdit = !!postData.id;
      const res = await fetch("/api/blog", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success(isEdit ? "Post updated" : "Post created");
      setShowEditor(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      toast.error(error.message || "Failed to save post");
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      published: "bg-green-600 text-white",
      draft: "bg-yellow-600 text-white",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-600"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={() => {
              setShowEditor(false);
              setEditingPost(null);
            }}
            className="flex items-center gap-2 text-spindeck-gray hover:text-white mb-6"
          >
            ← Back to Posts
          </button>
          <BlogPostEditor
            post={editingPost}
            onSave={handleSave}
            onCancel={() => {
              setShowEditor(false);
              setEditingPost(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-spindeck-gray mt-1">Create and manage blog posts</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => setShowEditor(true)}
              className="px-4 py-2 bg-spindeck-red hover:bg-red-600 rounded-lg font-medium transition-colors"
            >
              + New Post
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "published", "draft"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-spindeck-red text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && (
                <span className="ml-2 text-xs opacity-70">
                  ({posts.filter((p) => (f === "all" ? true : p.status === f)).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-spindeck-dark rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-spindeck-dark rounded-lg p-12 text-center">
            <p className="text-spindeck-gray text-lg mb-4">No posts found</p>
            <button
              onClick={() => setShowEditor(true)}
              className="px-6 py-3 bg-spindeck-red hover:bg-red-600 rounded-lg font-medium transition-colors"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      {getStatusBadge(post.status)}
                    </div>
                    <p className="text-spindeck-gray text-sm mb-3">
                      {post.excerpt || "No excerpt"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Slug: /{post.slug}</span>
                      <span>Category: {post.category}</span>
                      {post.published_at && (
                        <span>
                          Published:{" "}
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        Updated: {new Date(post.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                      Preview
                    </Link>
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setShowEditor(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(post.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-spindeck-dark rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Delete Post?</h3>
              <p className="text-spindeck-gray mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
