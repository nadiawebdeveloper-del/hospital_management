// Poore services ka data — listing page aur internal page dono isay use karte hain

const servicesData = [
  {
    slug: "opd-services",
     image: '/images/red-cross.png',
    title: "OPD Services",
    shortText: "Walk-in consultations with our general and specialist doctors.",
    banner: "/images/services/opd-services.jpg",
    about:
      "Our Outpatient Department (OPD) provides quick access to general and specialist consultations without an overnight stay. Patients are seen by qualified doctors who assess symptoms, prescribe treatment, and refer to specialists if needed.",
    features: [
      "Same-day appointments available",
      "General physicians and specialists under one roof",
      "Digital prescriptions and records",
      "Minimal waiting time",
    ],
    timing: "Mon - Sat, 8:00 AM - 8:00 PM",
    fee: "Starting from Rs. 1,500",
  },
  {
    slug: "emergency-care",
    image: '/images/siren.png',
    title: "Emergency Care",
    shortText: "24/7 emergency response for critical and urgent conditions.",
    banner: "/images/services/emergency-care.jpg",
    about:
      "Our Emergency Department is staffed around the clock with trauma specialists, emergency physicians, and critical care nurses. We're equipped to handle accidents, cardiac events, and other life-threatening situations immediately.",
    features: [
      "24/7 availability, every day of the year",
      "Dedicated trauma and critical care team",
      "On-site diagnostic imaging and lab",
      "Rapid triage system",
    ],
    timing: "Available 24/7",
    fee: "Based on treatment required",
  },
  {
    slug: "laboratory",
    image: '/images/microscope.png',
    title: "Laboratory",
    shortText: "Accurate diagnostic testing with fast turnaround times.",
    banner: "/images/services/laboratory.jpg",
    about:
      "Our in-house laboratory offers a full range of diagnostic tests, from routine blood work to specialized pathology. Results are processed quickly and shared digitally with your doctor.",
    features: [
      "Blood tests, urine analysis, and more",
      "Same-day results for most tests",
      "Modern, calibrated equipment",
      "Home sample collection available",
    ],
    timing: "Mon - Sat, 7:00 AM - 9:00 PM",
    fee: "Varies by test",
  },
  {
    slug: "pharmacy",
    image: '/images/pharmacy.png',
    title: "Pharmacy",
    shortText: "In-house pharmacy stocked with prescribed and OTC medicines.",
    banner: "/images/services/pharmacy.jpg",
    about:
      "Our pharmacy is conveniently located within the hospital, so you can fill your prescriptions right after your appointment. We stock a wide range of medicines and health products.",
    features: [
      "Wide range of prescription medicines",
      "Pharmacist on-site for guidance",
      "Home delivery for regular patients",
      "Competitive, transparent pricing",
    ],
    timing: "Open daily, 8:00 AM - 10:00 PM",
    fee: "As per medicine pricing",
  },
  {
    slug: "radiology",
    image: '/images/tomography.png',
    title: "Radiology",
    shortText: "X-ray, ultrasound, CT, and MRI imaging services.",
    banner: "/images/services/radiology.jpg",
    about:
      "Our Radiology department offers advanced imaging services including X-ray, ultrasound, CT scan, and MRI, helping doctors accurately diagnose a wide range of conditions.",
    features: [
      "Digital X-ray and ultrasound",
      "CT scan and MRI available",
      "Experienced radiologists",
      "Reports shared within 24 hours",
    ],
    timing: "Mon - Sat, 8:00 AM - 8:00 PM",
    fee: "Varies by scan type",
  },
  {
    slug: "ambulance",
    image: '/images/ambulance.png',
    title: "Ambulance",
    shortText: "Fast, well-equipped ambulance service for emergencies.",
    banner: "/images/services/ambulance.jpg",
    about:
      "Our ambulance service is available around the clock, equipped with basic life support tools and trained paramedics, ready to respond quickly to emergencies anywhere in the city.",
    features: [
      "24/7 emergency response",
      "Trained paramedic staff",
      "GPS-tracked, fast dispatch",
      "Equipped with basic life support tools",
    ],
    timing: "Available 24/7",
    fee: "Rs. 2,000 per dispatch (within city)",
  },
];

export default servicesData;