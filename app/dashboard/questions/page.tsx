import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS, CATEGORY_COLORS, timeAgo, initials } from "@/lib/utils";
import { Question } from "@/types";
import AskQuestionModal from "@/components/questions/AskQuestionModal";
import QuestionFilters from "@/components/questions/QuestionFilters";
import PostAnswer from "@/components/questions/PostAnswer";

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function QuestionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  let query = supabase
    .from("questions")
    .select(`
      *,
      author:profiles!questions_author_id_fkey(full_name, title, country, role),
      answers(
        id, body, is_accepted, upvote_count, created_at,
        author:profiles!answers_author_id_fkey(full_name, title, country, is_verified)
      )
    `)
    .order("created_at", { ascending: false });

  if (params.category) {
    query = query.eq("category", params.category);
  }
  if (params.q) {
    query = query.ilike("title", `%${params.q}%`);
  }

  const { data: questions } = await query;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900">Q&amp;A Feed</h1>
          <p className="text-surface-500 text-sm mt-0.5">Questions answered by verified professionals</p>
        </div>
        <AskQuestionModal />
      </div>

      <QuestionFilters />

      <div className="space-y-4 mt-4">
        {(!questions || questions.length === 0) && (
          <div className="card text-center py-12 text-surface-400">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-medium">No questions yet</p>
            <p className="text-sm mt-1">Be the first to ask!</p>
          </div>
        )}

        {(questions as Question[])?.map((q) => (
          <div key={q.id} className="card">
            {/* Question header */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-100 text-surface-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {q.author ? initials(q.author.full_name) : "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-surface-700">
                    {q.author?.full_name ?? "Anonymous"}
                  </span>
                  {q.author?.country && (
                    <span className="text-xs text-surface-400">{q.author.country}</span>
                  )}
                  <span className={`badge ${CATEGORY_COLORS[q.category]}`}>
                    {CATEGORY_LABELS[q.category]}
                  </span>
                  <span className="text-xs text-surface-400 ml-auto">{timeAgo(q.created_at)}</span>
                </div>
                <h2 className="font-semibold text-surface-900 mt-1">{q.title}</h2>
                <p className="text-sm text-surface-600 mt-1 leading-relaxed">{q.body}</p>
              </div>
            </div>

            {/* Answers */}
            {q.answers && q.answers.length > 0 && (
              <div className="mt-4 space-y-3 border-t border-surface-100 pt-4">
                {q.answers.map((a) => (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {a.author ? initials(a.author.full_name) : "?"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-surface-800">
                          {a.author?.full_name ?? "Expert"}
                        </span>
                        {a.author?.title && (
                          <span className="text-xs text-surface-400">{a.author.title}</span>
                        )}
                        {a.author?.is_verified && (
                          <span className="text-xs text-brand-600 font-medium">✓ Verified</span>
                        )}
                        {a.is_accepted && (
                          <span className="badge bg-green-100 text-green-800">✓ Accepted</span>
                        )}
                      </div>
                      <p className="text-sm text-surface-700 mt-1 leading-relaxed">{a.body}</p>
                      <p className="text-xs text-surface-400 mt-1">
                        {a.upvote_count} upvotes · {timeAgo(a.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Post answer (verified professionals only) */}
            {profile?.is_verified && profile.role !== "student" && (
              <div className="mt-4 border-t border-surface-100 pt-4">
                <PostAnswer questionId={q.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
