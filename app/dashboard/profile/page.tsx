import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-surface-900">My Profile</h1>
        <p className="text-surface-500 text-sm mt-0.5">Update your public information</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
