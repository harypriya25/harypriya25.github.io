import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-surface-100 px-6 py-4 flex items-center justify-between">
        <span className="font-display text-2xl font-bold text-brand-700">
          Food<span className="text-surface-800">Logic</span>
          <span className="ml-1 text-brand-500">🧪</span>
        </span>
        <div className="flex gap-3">
          <Link href="/auth/login" className="btn-secondary text-sm">
            Sign in
          </Link>
          <Link href="/auth/register" className="btn-primary text-sm">
            Join free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-brand-100">
          🌾 Built for food science & dairy professionals
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-surface-900 leading-tight mb-6">
          Get answers from{" "}
          <span className="text-brand-600">verified experts</span> in your field
        </h1>
        <p className="text-lg text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          FoodLogic connects students and early-career professionals with verified
          food scientists, dairy technologists, and chemical engineers. No generic
          AI — real expertise, real guidance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="btn-primary px-8 py-3 text-base">
            Get started — it&apos;s free
          </Link>
          <Link href="/auth/login" className="btn-secondary px-8 py-3 text-base">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-surface-100 bg-surface-50 py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🔬",
              title: "Food Science & Dairy",
              desc: "Ask about HACCP, dairy processing, fermentation, food safety, shelf-life, and more.",
            },
            {
              icon: "⚙️",
              title: "Engineering Troubleshooting",
              desc: "Chemical process issues, equipment selection, scale-up challenges — answered by practitioners.",
            },
            {
              icon: "🧭",
              title: "Career Guidance",
              desc: "Resume reviews, interview prep, industry navigation for students from all backgrounds.",
            },
          ].map((f) => (
            <div key={f.title} className="card">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-display font-semibold text-xl text-surface-900 mb-2">
                {f.title}
              </h3>
              <p className="text-surface-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 px-6 text-center">
        <p className="text-surface-400 text-sm font-medium mb-8 uppercase tracking-wider">
          What makes FoodLogic different
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-surface-600">
          {[
            "✅ Verified professionals only",
            "🔒 Privacy-first profiles",
            "🌍 Global mentor network",
            "🆓 Free for students",
          ].map((item) => (
            <span key={item} className="text-sm font-medium">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-100 py-8 px-6 text-center text-surface-400 text-sm">
        <p>
          Built with ❤️ to help students from rural backgrounds discover careers
          in food science and engineering.
        </p>
      </footer>
    </main>
  );
}
