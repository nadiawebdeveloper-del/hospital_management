import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PatientBoard from "./PatientBoard";
import "../../dash.css";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!me) redirect("/login");
  if (me.role !== "patient") redirect("/doctor/dashboard");
  await supabase.rpc("claim_guest_appointments");
  return <PatientBoard me={me} />;
}