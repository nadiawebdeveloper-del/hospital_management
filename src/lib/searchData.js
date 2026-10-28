export const DEPT_KEYWORDS = {
  Cardiology: ["heart", "chest pain", "blood pressure", "bp", "palpitation", "cardiac", "cholesterol", "ecg", "hypertension"],
  Neurology: ["headache", "migraine", "brain", "stroke", "seizure", "epilepsy", "numbness", "dizziness", "nerve", "memory"],
  Pediatrics: ["child", "kid", "baby", "infant", "vaccination", "newborn", "pediatric"],
  Orthopedics: ["bone", "fracture", "joint", "knee", "back pain", "spine", "shoulder", "arthritis", "sports injury", "orthopedic surgery"],
  Gynecology: ["pregnancy", "female", "women", "period", "menstrual", "pcos", "delivery", "gynae", "maternity"],
  Psychiatry: ["depression", "anxiety", "stress", "sleep", "mental", "mood", "panic"],
  "General Medicine": ["fever", "cold", "flu", "cough", "covid", "covid 19", "fatigue", "infection", "diabetes", "sugar", "stomach", "medicine", "checkup", "vomiting", "typhoid", "general"],
  Dermatology: ["skin", "rash", "acne", "hair", "allergy", "eczema"],
};

export function matchDepartments(raw) {
  const q = (raw || "").trim().toLowerCase();
  if (q.length < 2) return [];
  const out = [];
  for (const [dept, words] of Object.entries(DEPT_KEYWORDS)) {
    const d = dept.toLowerCase();
    if (d.includes(q) || q.includes(d)) { out.push({ dept, via: "name" }); continue; }
    const hit = words.find((w) => w.includes(q) || q.includes(w));
    if (hit) out.push({ dept, via: "symptom", term: hit });
  }
  return out;
}