"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/pressbase/client";
import toast from "react-hot-toast";

export default function PlanManagement() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    is_active: true,
    features: {
      tracks_per_month: "",
      email_blasts: "",
      analytics: false,
      priority_support: false,
      featured_placement: false,
      dedicated_manager: false,
    },
  });

  const pb = createClient();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await pb
        .from("plans")
        .select("*")
        .order("price", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      is_active: true,
      features: {
        tracks_per_month: "",
        email_blasts: "",
        analytics: false,
        priority_support: false,
        featured_placement: false,
        dedicated_manager: false,
      },
    });
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      is_active: plan.is_active,
      features: {
        tracks_per_month: plan.features?.tracks_per_month?.toString() || "",
        email_blasts: plan.features?.email_blasts?.toString() || "",
        analytics: plan.features?.analytics || false,
        priority_support: plan.features?.priority_support || false,
        featured_placement: plan.features?.featured_placement || false,
        dedicated_manager: plan.features?.dedicated_manager || false,
      },
    });
    setShowCreateModal(true);
  };

  const handleCreate = () => {
    resetForm();
    setEditingPlan(null);
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Plan name is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error("Valid price is required");
      return;
    }

    const planData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      is_active: formData.is_active,
      features: {
        tracks_per_month: formData.features.tracks_per_month === "unlimited" 
          ? "unlimited" 
          : parseInt(formData.features.tracks_per_month) || 0,
        email_blasts: formData.features.email_blasts === "unlimited"
          ? "unlimited"
          : parseInt(formData.features.email_blasts) || 0,
        analytics: formData.features.analytics,
        priority_support: formData.features.priority_support,
        featured_placement: formData.features.featured_placement,
        dedicated_manager: formData.features.dedicated_manager,
      },
    };

    try {
      if (editingPlan) {
        // Update existing plan
        const { error } = await pb
          .from("plans")
          .update(planData)
          .eq("id", editingPlan.id);

        if (error) throw error;
        
        setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...planData } : p));
        toast.success("Plan updated successfully");
      } else {
        // Create new plan
        const { data, error } = await pb
          .from("plans")
          .insert(planData)
          .select()
          .single();

        if (error) throw error;
        
        setPlans([...plans, data].sort((a, b) => a.price - b.price));
        toast.success("Plan created successfully");
      }

      setShowCreateModal(false);
      resetForm();
      setEditingPlan(null);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error(editingPlan ? "Failed to update plan" : "Failed to create plan");
    }
  };

  const togglePlanActive = async (plan) => {
    try {
      const { error } = await pb
        .from("plans")
        .update({ is_active: !plan.is_active })
        .eq("id", plan.id);

      if (error) throw error;

      setPlans(plans.map(p => 
        p.id === plan.id ? { ...p, is_active: !p.is_active } : p
      ));

      toast.success(`Plan ${!plan.is_active ? "activated" : "deactivated"}`);
    } catch (error) {
      console.error("Error toggling plan status:", error);
      toast.error("Failed to update plan status");
    }
  };

  const deletePlan = async (plan) => {
    if (!confirm(`Are you sure you want to delete the "${plan.name}" plan? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await pb
        .from("plans")
        .delete()
        .eq("id", plan.id);

      if (error) throw error;

      setPlans(plans.filter(p => p.id !== plan.id));
      toast.success("Plan deleted successfully");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. It may be in use by subscribers.");
    }
  };

  const getPlanIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("platinum")) return "💎";
    if (lowerName.includes("gold")) return "🥇";
    if (lowerName.includes("silver")) return "🥈";
    if (lowerName.includes("basic")) return "🎵";
    if (lowerName.includes("mixtape")) return "📀";
    if (lowerName.includes("newsletter")) return "📧";
    return "📋";
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Plan Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 animate-pulse">
              <div className="h-6 bg-gray-600 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-600 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Plan Management</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
        >
          ➕ Create Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Total Plans</p>
          <p className="text-2xl font-bold">{plans.length}</p>
        </div>
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Active Plans</p>
          <p className="text-2xl font-bold text-green-500">
            {plans.filter(p => p.is_active).length}
          </p>
        </div>
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Inactive Plans</p>
          <p className="text-2xl font-bold text-red-500">
            {plans.filter(p => !p.is_active).length}
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <div className="bg-spindeck-dark rounded-lg p-12 text-center border border-gray-800">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No plans created</h3>
          <p className="text-spindeck-gray mb-4">Create your first pricing plan to get started</p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Create Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-spindeck-dark rounded-lg p-6 border transition-all ${
                plan.is_active
                  ? "border-gray-800 hover:border-spindeck-red"
                  : "border-gray-800 opacity-60"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl">{getPlanIcon(plan.name)}</span>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-spindeck-red">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span className="text-spindeck-gray text-sm">
                      {plan.features?.duration === "one_time" ? "one-time" : "/month"}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.is_active
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
                >
                  {plan.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {plan.features?.tracks_per_month !== undefined && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      {plan.features.tracks_per_month === "unlimited"
                        ? "Unlimited tracks"
                        : `${plan.features.tracks_per_month} tracks/month`}
                    </span>
                  </div>
                )}
                {plan.features?.email_blasts !== undefined && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      {plan.features.email_blasts === "unlimited"
                        ? "Unlimited email blasts"
                        : `${plan.features.email_blasts} email blasts`}
                    </span>
                  </div>
                )}
                {plan.features?.analytics && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Analytics access</span>
                  </div>
                )}
                {plan.features?.priority_support && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Priority support</span>
                  </div>
                )}
                {plan.features?.featured_placement && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Featured placement</span>
                  </div>
                )}
                {plan.features?.dedicated_manager && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Dedicated manager</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => togglePlanActive(plan)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    plan.is_active
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {plan.is_active ? "⏸️ Deactivate" : "▶️ Activate"}
                </button>
                <button
                  onClick={() => deletePlan(plan)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  🗑️
                </button>
              </div>

              {/* Created date */}
              <p className="text-xs text-spindeck-gray mt-4">
                Created {new Date(plan.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-spindeck-dark rounded-lg border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingPlan ? "Edit Plan" : "Create New Plan"}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                    setEditingPlan(null);
                  }}
                  className="text-spindeck-gray hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Plan Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Plan Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-spindeck-gray focus:outline-none focus:border-spindeck-red"
                    placeholder="e.g., Gold, Silver, Basic"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-spindeck-gray focus:outline-none focus:border-spindeck-red"
                    placeholder="29.99"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-spindeck-red focus:ring-spindeck-red"
                  />
                  <label htmlFor="is_active" className="text-sm">Active (visible to users)</label>
                </div>

                <hr className="border-gray-700" />

                <h4 className="font-medium">Features</h4>

                {/* Tracks per month */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tracks per Month</label>
                  <input
                    type="text"
                    value={formData.features.tracks_per_month}
                    onChange={(e) => setFormData({
                      ...formData,
                      features: { ...formData.features, tracks_per_month: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-spindeck-gray focus:outline-none focus:border-spindeck-red"
                    placeholder="10 or 'unlimited'"
                  />
                </div>

                {/* Email blasts */}
                <div>
                  <label className="block text-sm font-medium mb-1">Email Blasts</label>
                  <input
                    type="text"
                    value={formData.features.email_blasts}
                    onChange={(e) => setFormData({
                      ...formData,
                      features: { ...formData.features, email_blasts: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-spindeck-gray focus:outline-none focus:border-spindeck-red"
                    placeholder="5 or 'unlimited'"
                  />
                </div>

                {/* Boolean features */}
                <div className="space-y-3">
                  {[
                    { key: "analytics", label: "Analytics Access" },
                    { key: "priority_support", label: "Priority Support" },
                    { key: "featured_placement", label: "Featured Placement" },
                    { key: "dedicated_manager", label: "Dedicated Manager" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={key}
                        checked={formData.features[key]}
                        onChange={(e) => setFormData({
                          ...formData,
                          features: { ...formData.features, [key]: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-spindeck-red focus:ring-spindeck-red"
                      />
                      <label htmlFor={key} className="text-sm">{label}</label>
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                      setEditingPlan(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    {editingPlan ? "Update Plan" : "Create Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
