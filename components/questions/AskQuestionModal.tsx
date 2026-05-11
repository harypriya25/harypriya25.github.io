"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AskQuestionModal() {
  const router = useRouter();
  const [open, setOpen]       = useState(false);
  const [title, setTitle]     = useState("");
  const [body, setBody]       = useState("");
  const [category, setCategory] = useState("food_science");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("questions").insert({
      author_id: user.id,
      title: title.trim(),
      body: body.trim(),
      category,
    });

    if (error) {
      setError(error.message);
    } else {
      setOpen(false);
      setTitle("");
      setBody("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary text-sm">
        + Ask a question
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-surface-900">Ask a question</h2>
              <button onClick={() => setOpen(false)} className="text-surface-400 hover:text-surface-700 text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                  <option value="food_science">Food Science & Dairy</option>
                  <option value="engineering">Engineering</option>
                  <option value="career">Career Guidance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Question title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  placeholder="e.g. How do I calculate pasteurisation time for milk?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Details</label>
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="input resize-none"
                  placeholder="Provide context and background for your question…"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary text-sm">
                  {loading ? "Posting…" : "Post question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
