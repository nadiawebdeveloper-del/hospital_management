import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DoctorBoard from "./DoctorBoard";
import "../../dash.css";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!me) redirect("/login");
  if (me.role !== "doctor") redirect("/patient/dashboard");
  return <DoctorBoard me={me} />;
}
