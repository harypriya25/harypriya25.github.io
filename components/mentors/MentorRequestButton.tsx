"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MentorRequestButton({
  mentorId,
  mentorName,
}: {
  mentorId: string;
  mentorName: string;
}) {
  const [open, setOpen]         = useState(false);
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState("");

  async function handleSend(e: React.FormEvent) {
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

    const { error } = await supabase.from("mentor_requests").insert({
      from_user_id: user.id,
      to_mentor_id: mentorId,
      message: message.trim(),
    });

    if (error) {
      if (error.code === "23505") {
        setError("You have already sent a request to this mentor.");
      } else {
        setError(error.message);
      }
    } else {
      setSent(true);
      setOpen(false);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <p className="text-sm text-brand-600 font-medium">✓ Request sent!</p>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary text-sm w-full">
        Request mentorship
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-surface-900">
                Message {mentorName}
              </h2>
              <button onClick={() => setOpen(false)} className="text-surface-400 hover:text-surface-700 text-xl">×</button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Your message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input resize-none"
                  placeholder="Introduce yourself and explain what kind of guidance you're looking for…"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary text-sm">
                  {loading ? "Sending…" : "Send request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
