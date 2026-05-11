"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PostAnswer({ questionId }: { questionId: string }) {
  const router   = useRouter();
  const [body, setBody]       = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
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

    const { error } = await supabase.from("answers").insert({
      question_id: questionId,
      author_id: user.id,
      body: body.trim(),
    });

    if (error) {
      setError(error.message);
    } else {
      setBody("");
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-brand-600 font-medium hover:text-brand-800"
      >
        + Write an answer
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>
      )}
      <textarea
        required
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="input resize-none text-sm"
        placeholder="Write your expert answer here…"
      />
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary text-sm py-1.5">
          {loading ? "Posting…" : "Post answer"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm py-1.5">
          Cancel
        </button>
      </div>
    </form>
  );
}
