"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
    title: "",
    country: "",
    specialist_area: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role: form.role,
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Update profile with extra fields
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        title: form.title || null,
        country: form.country || null,
        specialist_area: form.specialist_area || null,
      }).eq("id", user.id);
    }

    router.push("/dashboard/questions");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-brand-700">
            Food<span className="text-surface-800">Logic</span>
            <span className="ml-1">🧪</span>
          </Link>
          <p className="mt-2 text-surface-500">Create your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Full name *</label>
              <input name="full_name" required value={form.full_name} onChange={handleChange} className="input" placeholder="Jane Smith" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Password *</label>
              <input name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} className="input" placeholder="Min 6 characters" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">I am a…</label>
              <select name="role" value={form.role} onChange={handleChange} className="input">
                <option value="student">Student / Early career</option>
                <option value="professional">Professional (seeking verification)</option>
              </select>
            </div>

            {form.role === "professional" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Job title</label>
                  <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g. Senior Dairy Technologist" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Specialist area</label>
                  <select name="specialist_area" value={form.specialist_area} onChange={handleChange} className="input">
                    <option value="">Select…</option>
                    <option value="food_science">Food Science & Dairy</option>
                    <option value="engineering">Engineering</option>
                    <option value="career">Career Guidance</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Country</label>
              <input name="country" value={form.country} onChange={handleChange} className="input" placeholder="e.g. India" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? "Creating account…" : "Create account"}
            </button>

            {form.role === "professional" && (
              <p className="text-xs text-surface-400 text-center">
                Professional accounts require admin verification before you can answer questions.
              </p>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
