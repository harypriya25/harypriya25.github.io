export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const CATEGORY_LABELS: Record<string, string> = {
  food_science: "Food Science & Dairy",
  engineering:  "Engineering",
  career:       "Career Guidance",
};

export const CATEGORY_COLORS: Record<string, string> = {
  food_science: "bg-green-100 text-green-800",
  engineering:  "bg-blue-100 text-blue-800",
  career:       "bg-amber-100 text-amber-800",
};
