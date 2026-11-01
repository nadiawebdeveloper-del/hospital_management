import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConsultationForm from "./ConsultationForm";
import "../../../dash.css";

export default async function Page({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!me || me.role !== "doctor") redirect("/login");
  if (!me.is_verified) redirect("/doctor/dashboard");

  const { data: appt } = await supabase
    .from("appointments")
    .select("*, patient:profiles!appointments_patient_id_fkey(full_name, phone, age)")
    .eq("id", id)
    .eq("doctor_id", user.id)
    .single();
  if (!appt) notFound();
  if (!["accepted", "completed"].includes(appt.status)) redirect("/doctor/dashboard?view=appointments");

  const patient = appt.patient || { full_name: appt.guest_name, phone: appt.guest_phone, age: null, guest: true };

  const { data: consult } = await supabase
    .from("consultations").select("*").eq("appointment_id", id).maybeSingle();

  let meds = [];
  if (consult) {
    const { data } = await supabase
      .from("prescription_items").select("*").eq("consultation_id", consult.id).order("position");
    meds = data || [];
  }

  return <ConsultationForm appt={appt} patient={patient} consult={consult} savedMeds={meds} />;
}