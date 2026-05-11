import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/utils";
import { initials } from "@/lib/utils";
import { Profile } from "@/types";
import MentorRequestButton from "@/components/mentors/MentorRequestButton";

export default async function MentorsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: mentors } = await supabase
    .from("profiles")
    .select("id, full_name, title, country, bio, specialist_area, is_verified, role")
    .eq("is_verified", true)
    .in("role", ["professional", "admin"])
    .order("full_name");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-surface-900">Find a Mentor</h1>
        <p className="text-surface-500 text-sm mt-0.5">
          Connect with verified professionals in food science and engineering
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {(!mentors || mentors.length === 0) && (
          <div className="col-span-2 card text-center py-12 text-surface-400">
            <p className="text-4xl mb-3">🧑‍🏫</p>
            <p className="font-medium">No mentors available yet</p>
            <p className="text-sm mt-1">Check back soon as professionals join the platform.</p>
          </div>
        )}

        {(mentors as Profile[])?.map((mentor) => (
          <div key={mentor.id} className="card flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {initials(mentor.full_name)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-surface-900">{mentor.full_name}</p>
                  <span className="text-brand-600 text-xs font-medium">✓</span>
                </div>
                {mentor.title && (
                  <p className="text-sm text-surface-500">{mentor.title}</p>
                )}
                {mentor.country && (
                  <p className="text-xs text-surface-400 mt-0.5">📍 {mentor.country}</p>
                )}
                {mentor.specialist_area && (
                  <span className="inline-block mt-1 text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[mentor.specialist_area]}
                  </span>
                )}
              </div>
            </div>

            {mentor.bio && (
              <p className="text-sm text-surface-600 leading-relaxed">{mentor.bio}</p>
            )}

            {user?.id !== mentor.id && (
              <MentorRequestButton mentorId={mentor.id} mentorName={mentor.full_name} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
