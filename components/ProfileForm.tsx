"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name:       profile?.full_name ?? "",
    title:           profile?.title ?? "",
    country:         profile?.country ?? "",
    bio:             profile?.bio ?? "",
    specialist_area: profile?.specialist_area ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("profiles").update({
      full_name:       form.full_name.trim(),
      title:           form.title.trim() || null,
      country:         form.country.trim() || null,
      bio:             form.bio.trim() || null,
      specialist_area: form.specialist_area || null,
    }).eq("id", user!.id);

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="card">
      {profile && (
        <div className="mb-5 p-3 bg-surface-50 rounded-lg text-sm text-surface-600 border border-surface-200">
          <span className="font-medium">Role:</span> {profile.role}
          {profile.is_verified ? (
            <span className="ml-3 text-brand-600 font-medium">✓ Verified professional</span>
          ) : profile.role === "professional" ? (
            <span className="ml-3 text-amber-600">⏳ Awaiting verification</span>
          ) : null}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}
        {saved && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg">Profile saved!</div>
        )}

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Full name *</label>
          <input name="full_name" required value={form.full_name} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Job title</label>
          <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g. Dairy Process Engineer" />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Country</label>
          <input name="country" value={form.country} onChange={handleChange} className="input" placeholder="e.g. India" />
        </div>

        {(profile?.role === "professional" || profile?.role === "admin") && (
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Specialist area</label>
            <select name="specialist_area" value={form.specialist_area} onChange={handleChange} className="input">
              <option value="">Select…</option>
              <option value="food_science">Food Science & Dairy</option>
              <option value="engineering">Engineering</option>
              <option value="career">Career Guidance</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Bio</label>
          <textarea
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            className="input resize-none"
            placeholder="Brief professional background…"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
