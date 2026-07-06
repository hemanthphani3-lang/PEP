export interface User {
  uid: string;
  name: string;
  role: "citizen" | "mp";
  language: string;
}

export interface Submission {
  submissionId: string;
  userId: string;
  userName: string;
  text: string;
  translatedText: string;
  summary: string;
  category: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  clusterId?: string;
  villageName: string;
  language: string;
  audioUrl?: string;
  phoneNumber?: string;
}

export interface Cluster {
  clusterId: string;
  title: string;
  category: string;
  citizenCount: number;
  villagesAffected: string[];
  priorityScore: number;
  explanation: string;
  images: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  status: "Pending" | "Approved" | "In Progress" | "Completed";
  publicEvidenceLink?: string;
}

export interface PublicData {
  regionId: string; // matches villageName
  villageName: string;
  population: number;
  schools: number;
  healthCenters: number;
  roads: string; // e.g. "Unmetalled", "Heavily damaged highway", "Good"
  waterFacilities: string; // e.g. "Borewell only", "Silt-clogged well", "Scarcity"
  distanceToNearestHospitalKm: number;
  distanceToNearestSchoolKm: number;
  enrollmentGrowthRate: number; // percentage
  waterPurityIndex: number; // percentage
}

export interface Report {
  reportId: string;
  clusterId: string;
  clusterTitle: string;
  pdfUrl?: string;
  generatedAt: string;
  summaryText: string;
}

// Preset Public Data for the actual assembly segments under the Visakhapatnam Lok Sabha constituency
export const PRESET_PUBLIC_DATA: PublicData[] = [
  {
    regionId: "bhimili",
    villageName: "Bhimili",
    population: 265000,
    schools: 28,
    healthCenters: 4,
    roads: "Suburban link roads, heavy water-logging during monsoon surges",
    waterFacilities: "Municipal tap supply with periodic salinity intrusion",
    distanceToNearestHospitalKm: 12.5,
    distanceToNearestSchoolKm: 3.5,
    enrollmentGrowthRate: 15,
    waterPurityIndex: 78,
  },
  {
    regionId: "gajuwaka",
    villageName: "Gajuwaka",
    population: 320000,
    schools: 42,
    healthCenters: 6,
    roads: "Heavy industrial transit corridors, cracked asphalt from cargo trucks",
    waterFacilities: "Groundwater wells with high industrial run-off concerns",
    distanceToNearestHospitalKm: 4.8,
    distanceToNearestSchoolKm: 2.1,
    enrollmentGrowthRate: 19,
    waterPurityIndex: 65,
  },
  {
    regionId: "srungavarapukota",
    villageName: "Srungavarapukota",
    population: 180000,
    schools: 15,
    healthCenters: 1,
    roads: "Unmetalled hill paths, prone to severe landslides",
    waterFacilities: "Open mountain streams and borewells",
    distanceToNearestHospitalKm: 22.0,
    distanceToNearestSchoolKm: 9.8,
    enrollmentGrowthRate: 12,
    waterPurityIndex: 55,
  },
  {
    regionId: "visakhapatnameast",
    villageName: "Visakhapatnam East",
    population: 290000,
    schools: 35,
    healthCenters: 3,
    roads: "Coastal ring roads, sandy soil erosion on access lines",
    waterFacilities: "Desalination filter feeds and municipal reservoirs",
    distanceToNearestHospitalKm: 3.0,
    distanceToNearestSchoolKm: 1.2,
    enrollmentGrowthRate: 21,
    waterPurityIndex: 85,
  }
];

// Seeded Submissions (Initial Visakhapatnam Data)
export const PRESET_SUBMISSIONS: Submission[] = [
  {
    submissionId: "sub_1",
    userId: "citizen_1",
    userName: "N. Srinivas",
    text: "The main access road in Srungavarapukota (S.Kota) is completely washed out near the hill tracts. Ambulances cannot reach in emergencies.",
    translatedText: "The main access road in Srungavarapukota (S.Kota) is completely washed out near the hill tracts. Ambulances cannot reach in emergencies.",
    summary: "S.Kota access road is washed out, making school travel and medical transport impossible.",
    category: "Roads",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop&q=60",
    latitude: 17.9280,
    longitude: 83.1440,
    createdAt: "2026-06-12T10:15:30Z",
    clusterId: "cluster_roads_skota",
    villageName: "Srungavarapukota",
    language: "English"
  },
  {
    submissionId: "sub_2",
    userId: "citizen_2",
    userName: "M. Appa Rao",
    text: "ఎస్.కోట ఘాట్ రోడ్డు కొండచరియలు విరిగిపడటం వల్ల పూర్తిగా మూసుకుపోయింది. రవాణా నిలిచిపోయింది.",
    translatedText: "The S.Kota ghat road is completely blocked due to landslides. Transportation is halted.",
    summary: "S.Kota ghat road blocked by landslides, cutting off hilly settlements.",
    category: "Roads",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60",
    latitude: 17.9290,
    longitude: 83.1450,
    createdAt: "2026-06-15T08:22:11Z",
    clusterId: "cluster_roads_skota",
    villageName: "Srungavarapukota",
    language: "Telugu"
  },
  {
    submissionId: "sub_3",
    userId: "citizen_3",
    userName: "G. Satish",
    text: "Drinking water quality in Gajuwaka industrial zone is very poor. Chemical smell is coming from borewells, kids are falling sick.",
    translatedText: "Drinking water quality in Gajuwaka industrial zone is very poor. Chemical smell is coming from borewells, kids are falling sick.",
    summary: "Gajuwaka borewells suspected of industrial chemical contamination, causing pediatric illness.",
    category: "Water",
    imageUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop&q=60",
    latitude: 17.6890,
    longitude: 83.2080,
    createdAt: "2026-06-20T14:30:15Z",
    clusterId: "cluster_water_gajuwaka",
    villageName: "Gajuwaka",
    language: "English"
  },
  {
    submissionId: "sub_4",
    userId: "citizen_4",
    userName: "P. Lakshmi",
    text: "గాజువాక పారిశ్రామిక ప్రాంతంలో నీటి పైపు పగిలిపోయి మురుగునీరు కలుస్తోంది. తాగునీరు కలుషితం అవుతోంది.",
    translatedText: "In Gajuwaka industrial area, a water pipe burst is causing drainage water to mix, contaminating drinking supply.",
    summary: "Sewage seepage into burst drinking water pipeline in Gajuwaka.",
    category: "Water",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60",
    latitude: 17.6900,
    longitude: 83.2090,
    createdAt: "2026-06-22T09:05:40Z",
    clusterId: "cluster_water_gajuwaka",
    villageName: "Gajuwaka",
    language: "Telugu"
  },
  {
    submissionId: "sub_5",
    userId: "citizen_5",
    userName: "R. Naidu",
    text: "In Bhimili coastal settlements, there is no high school. Students walk over 12km to nearest school which is very hard during rainy season.",
    translatedText: "In Bhimili coastal settlements, there is no high school. Students walk over 12km to nearest school which is very hard during rainy season.",
    summary: "Absence of high school in Bhimili coastal wards forces long student daily commutes.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60",
    latitude: 17.8860,
    longitude: 83.4470,
    createdAt: "2026-06-25T07:40:00Z",
    clusterId: "cluster_edu_bhimili",
    villageName: "Bhimili",
    language: "English"
  },
  {
    submissionId: "sub_6",
    userId: "citizen_6",
    userName: "K. Prasad",
    text: "భీమిలి సముద్రతీర గ్రామాల్లో ఉన్నత పాఠశాల లేకపోవడంతో అమ్మాయిలు చదువు ఆపేస్తున్నారు. దయచేసి ఇక్కడ బడి కట్టించండి.",
    translatedText: "Due to lack of high schools in Bhimili coastal villages, girls are dropping out. Please build a school.",
    summary: "Female student dropout rates rising in Bhimili due to lack of local high school facility.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60",
    latitude: 17.8870,
    longitude: 83.4480,
    createdAt: "2026-06-26T16:15:22Z",
    clusterId: "cluster_edu_bhimili",
    villageName: "Bhimili",
    language: "Telugu"
  },
  {
    submissionId: "sub_7",
    userId: "citizen_7",
    userName: "V. Rama Devi",
    text: "S.Kota hill villages do not have even a basic health sub-center. For delivery, we have to carry pregnant women on stretchers for 20 kilometers.",
    translatedText: "S.Kota hill villages do not have even a basic health sub-center. For delivery, we have to carry pregnant women on stretchers for 20 kilometers.",
    summary: "Critical health gap: S.Kota hill villages require stretcher transport over 20km for childbirth.",
    category: "Healthcare",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60",
    latitude: 17.9275,
    longitude: 83.1435,
    createdAt: "2026-06-28T12:00:10Z",
    clusterId: "cluster_health_skota",
    villageName: "Srungavarapukota",
    language: "English"
  }
];

// Seeded Clusters
export const PRESET_CLUSTERS: Cluster[] = [
  {
    clusterId: "cluster_roads_skota",
    title: "All-Weather Ghat Road Construction in Srungavarapukota",
    category: "Roads",
    citizenCount: 16,
    villagesAffected: ["Srungavarapukota"],
    priorityScore: 94,
    explanation: "This project ranks extremely high because S.Kota has a population of 180,000 with multiple isolated hill tracts. Landslide damage blocks roads during monsoon seasons. Proximity to hospitals is very poor (22km), and alternative connectivity is non-existent.",
    images: [
      "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60"
    ],
    location: { latitude: 17.9280, longitude: 83.1440 },
    status: "Pending",
    publicEvidenceLink: "srungavarapukota"
  },
  {
    clusterId: "cluster_health_skota",
    title: "Establishment of a Hill-Area Primary Health Clinic in S.Kota",
    category: "Healthcare",
    citizenCount: 12,
    villagesAffected: ["Srungavarapukota"],
    priorityScore: 92,
    explanation: "Highest priority healthcare need. Remote hill wards lack clinical resources. Emergency transport over 20km mountain stretches leads to high hazard rates during medical delivery.",
    images: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60"
    ],
    location: { latitude: 17.9275, longitude: 83.1435 },
    status: "Pending",
    publicEvidenceLink: "srungavarapukota"
  },
  {
    clusterId: "cluster_water_gajuwaka",
    title: "Industrial Ground Water Filtration & Bursted Pipe Restoration in Gajuwaka",
    category: "Water",
    citizenCount: 22,
    villagesAffected: ["Gajuwaka"],
    priorityScore: 84,
    explanation: "Addresses major contamination issues in Gajuwaka (pop 320,000). Active leakages near the industrial corridor have caused chemical mixing. Public logs validate low groundwater purity indexes (65%).",
    images: [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60"
    ],
    location: { latitude: 17.6890, longitude: 83.2080 },
    status: "In Progress",
    publicEvidenceLink: "gajuwaka"
  },
  {
    clusterId: "cluster_edu_bhimili",
    title: "New High School Facility Construction in Bhimili Coastal Ward",
    category: "Education",
    citizenCount: 18,
    villagesAffected: ["Bhimili"],
    priorityScore: 81,
    explanation: "Addresses a critical drop-out issue in Bhimili coastal settlements. Students must trek 12.5km to reach a secondary school, making it highly difficult during monsoons.",
    images: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60"
    ],
    location: { latitude: 17.8860, longitude: 83.4470 },
    status: "Pending",
    publicEvidenceLink: "bhimili"
  }
];

// Helper to determine the nearest segment based on Visakhapatnam coordinates
export function getNearestVillage(lat: number, lng: number): string {
  let nearestName = "Bhimili";
  let minDistance = Infinity;

  const segments = [
    { name: "Bhimili", lat: 17.8860, lng: 83.4470 },
    { name: "Gajuwaka", lat: 17.6890, lng: 83.2080 },
    { name: "Srungavarapukota", lat: 17.9280, lng: 83.1440 },
    { name: "Visakhapatnam East", lat: 17.7280, lng: 83.3320 }
  ];

  segments.forEach(v => {
    const dist = Math.pow(v.lat - lat, 2) + Math.pow(v.lng - lng, 2);
    if (dist < minDistance) {
      minDistance = dist;
      nearestName = v.name;
    }
  });

  return nearestName;
}

// Logic for calculating the priority score of a cluster
export function calculatePriorityScore(
  citizenCount: number,
  villageName: string,
  category: string
): { score: number; explanation: string } {
  const normalizedVillage = villageName.toLowerCase().replace(/[^a-z]/g, "");
  const pData = PRESET_PUBLIC_DATA.find(d => 
    d.regionId === normalizedVillage || 
    d.villageName.toLowerCase().includes(normalizedVillage) ||
    normalizedVillage.includes(d.regionId)
  ) || PRESET_PUBLIC_DATA[0];

  const demandWeight = 0.35;
  const demandScore = Math.min((citizenCount / 30) * 100, 100);

  const gapWeight = 0.25;
  let gapScore = 50; 
  if (category === "Healthcare" && pData.healthCenters <= 1) gapScore = 100;
  else if (category === "Education" && pData.schools <= 20) gapScore = 95;
  else if (category === "Roads" && pData.roads.includes("Unmetalled")) gapScore = 95;
  else if (category === "Water" && pData.waterFacilities.includes("run-off")) gapScore = 90;
  else if (category === "Water" && pData.waterFacilities.includes("contamination")) gapScore = 95;
  else if (pData.distanceToNearestHospitalKm > 10) gapScore = 85;

  const equityWeight = 0.20;
  const distanceFactor = Math.min((pData.distanceToNearestHospitalKm / 25) * 100, 100);
  const infrastructureDeficit = (100 - pData.waterPurityIndex);
  const equityScore = (distanceFactor + infrastructureDeficit) / 2;

  const validationWeight = 0.15;
  let validationScore = 60;
  if (category === "Education") {
    validationScore = Math.min(pData.enrollmentGrowthRate * 4, 100);
  } else if (category === "Healthcare") {
    validationScore = Math.min((pData.distanceToNearestHospitalKm / 20) * 100, 100);
  } else if (category === "Water") {
    validationScore = 100 - pData.waterPurityIndex;
  } else {
    validationScore = 75;
  }

  const alignmentWeight = 0.05;
  let alignmentScore = 80;
  if (category === "Water" || category === "Sanitation") alignmentScore = 95; 
  else if (category === "Healthcare" || category === "Education") alignmentScore = 90;
  else if (category === "Roads") alignmentScore = 85; 

  const totalScore = Math.round(
    (demandScore * demandWeight) +
    (gapScore * gapWeight) +
    (equityScore * equityWeight) +
    (validationScore * validationWeight) +
    (alignmentScore * alignmentWeight)
  );

  const explanation = `This project scores a ${totalScore}/100 priority based on standard metrics:
1. Citizen Demand: ${citizenCount} active requests represent an index of ${Math.round(demandScore)}/100 (35% weight).
2. Service Gap: Addressing a deficiency in ${category} for ${villageName} where current infrastructure is '${category === "Healthcare" ? (pData.healthCenters <= 1 ? "Inadequate sub-center" : "Standard") : pData.waterFacilities}' (Index: ${Math.round(gapScore)}/100, 25% weight).
3. Equity Index: Regional gap index (Hospital distance is ${pData.distanceToNearestHospitalKm}km, Water purity is ${pData.waterPurityIndex}%) yields an Equity score of ${Math.round(equityScore)}/100 (20% weight).
4. Public Data: Validated data points show an enrollment/needs growth indicator of ${Math.round(validationScore)}/100 (15% weight).
5. National Alignment: Strategic alignment to national infrastructure development programs scores ${Math.round(alignmentScore)}/100 (5% weight).`;

  return {
    score: totalScore,
    explanation
  };
}

// Timeout helper — 5s gives enough time for cold Supabase connections
function withTimeout<T>(promise: Promise<T>, ms: number = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Supabase timed out after ${ms}ms`));
    }, ms);
    promise
      .then((res) => { clearTimeout(timer); resolve(res); })
      .catch((err) => { clearTimeout(timer); reject(err); });
  });
}

// Helper — returns the Supabase client or null (browser-only)
async function getSupabase() {
  if (typeof window === "undefined") return null;
  try {
    const { supabase } = await import("./supabase");
    return supabase;
  } catch {
    return null;
  }
}

function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const item = localStorage.getItem(`civicpulse_${key}`);
  if (!item) {
    localStorage.setItem(`civicpulse_${key}`, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`civicpulse_${key}`, JSON.stringify(data));
}

// Mappers to translate PostgreSQL snake_case rows into Next.js camelCase interfaces
function mapSubmissionFromPG(s: any): Submission {
  return {
    submissionId: s.submission_id,
    userId: s.user_id,
    userName: s.user_name,
    text: s.text,
    translatedText: s.translated_text,
    summary: s.summary,
    category: s.category,
    imageUrl: s.image_url,
    latitude: Number(s.latitude),
    longitude: Number(s.longitude),
    createdAt: s.created_at,
    clusterId: s.cluster_id,
    villageName: s.village_name,
    language: s.language,
    audioUrl: s.audio_url,
    phoneNumber: s.phone_number
  };
}

function mapClusterFromPG(c: any): Cluster {
  return {
    clusterId: c.cluster_id,
    title: c.title,
    category: c.category,
    citizenCount: c.citizen_count,
    villagesAffected: c.villages_affected,
    priorityScore: c.priority_score,
    explanation: c.explanation,
    images: c.images || [],
    location: typeof c.location === "string" ? JSON.parse(c.location) : c.location,
    status: c.status as Cluster["status"],
    publicEvidenceLink: c.public_evidence_link
  };
}

function mapPublicDataFromPG(d: any): PublicData {
  return {
    regionId: d.region_id,
    villageName: d.village_name,
    population: Number(d.population),
    schools: Number(d.schools),
    healthCenters: Number(d.health_centers),
    roads: d.roads,
    waterFacilities: d.water_facilities,
    distanceToNearestHospitalKm: Number(d.distance_to_nearest_hospital_km),
    distanceToNearestSchoolKm: Number(d.distance_to_nearest_school_km),
    enrollmentGrowthRate: Number(d.enrollment_growth_rate),
    waterPurityIndex: Number(d.water_purity_index)
  };
}

function mapReportFromPG(r: any): Report {
  return {
    reportId: r.report_id,
    clusterId: r.cluster_id,
    clusterTitle: r.cluster_title,
    pdfUrl: r.pdf_url,
    generatedAt: r.generated_at,
    summaryText: r.summary_text
  };
}

// ─── Core Database Service ───────────────────────────────────────────────────
// Supabase is the PRIMARY store. localStorage is OFFLINE-ONLY fallback.
export const DBService = {

  // ── Seed preset data into Supabase on first load ──────────────────────────
  async seedData(force: boolean = false): Promise<void> {
    const sb = await getSupabase();

    // Always keep localStorage seeded as offline cache
    if (typeof window !== "undefined") {
      const isSeeded = localStorage.getItem("civicpulse_seeded");
      if (!isSeeded || force) {
        setLocalData("submissions", PRESET_SUBMISSIONS);
        setLocalData("clusters", PRESET_CLUSTERS);
        setLocalData("publicData", PRESET_PUBLIC_DATA);
        setLocalData("reports", []);
        localStorage.setItem("civicpulse_seeded", "true");
      }
    }

    if (!sb) return;

    try {
      // Only seed Supabase if table is empty or force
      const { data, error } = await withTimeout(
        sb.from("public_data").select("region_id").limit(1)
      );

      if (error || !data || data.length === 0 || force) {
        await withTimeout(sb.from("public_data").upsert(
          PRESET_PUBLIC_DATA.map(d => ({
            region_id: d.regionId,
            village_name: d.villageName,
            population: d.population,
            schools: d.schools,
            health_centers: d.healthCenters,
            roads: d.roads,
            water_facilities: d.waterFacilities,
            distance_to_nearest_hospital_km: d.distanceToNearestHospitalKm,
            distance_to_nearest_school_km: d.distanceToNearestSchoolKm,
            enrollment_growth_rate: d.enrollmentGrowthRate,
            water_purity_index: d.waterPurityIndex
          }))
        ));

        await withTimeout(sb.from("submissions").upsert(
          PRESET_SUBMISSIONS.map(s => ({
            submission_id: s.submissionId,
            user_id: s.userId,
            user_name: s.userName,
            text: s.text,
            translated_text: s.translatedText,
            summary: s.summary,
            category: s.category,
            image_url: s.imageUrl ?? null,
            latitude: s.latitude,
            longitude: s.longitude,
            created_at: s.createdAt,
            cluster_id: s.clusterId ?? null,
            village_name: s.villageName,
            language: s.language
          }))
        ));

        await withTimeout(sb.from("clusters").upsert(
          PRESET_CLUSTERS.map(c => ({
            cluster_id: c.clusterId,
            title: c.title,
            category: c.category,
            citizen_count: c.citizenCount,
            villages_affected: c.villagesAffected,
            priority_score: c.priorityScore,
            explanation: c.explanation,
            images: c.images,
            location: c.location,
            status: c.status,
            public_evidence_link: c.publicEvidenceLink ?? null
          }))
        ));

        console.log("%c✅ CivicPulse: Supabase seed complete", "color:green;font-weight:bold");
      }
    } catch (err) {
      console.warn("Supabase seed failed — using localStorage fallback.", err);
    }
  },

  // ── Get all submissions (Supabase primary, localStorage fallback) ──────────
  async getSubmissions(): Promise<Submission[]> {
    const sb = await getSupabase();
    if (sb) {
      try {
        const { data, error } = await withTimeout(
          sb.from("submissions").select("*").order("created_at", { ascending: false })
        );
        if (error) throw error;
        if (data && data.length > 0) {
          const list = data.map(mapSubmissionFromPG);
          setLocalData("submissions", list); // keep cache in sync
          return list;
        }
      } catch (e) {
        console.warn("Supabase getSubmissions failed → localStorage.", e);
      }
    }
    return getLocalData<Submission[]>("submissions", PRESET_SUBMISSIONS)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  // ── Add new submission (Supabase primary, localStorage backup) ────────────
  async addSubmission(sub: Omit<Submission, "submissionId" | "createdAt" | "villageName">): Promise<Submission> {
    const newSub: Submission = {
      ...sub,
      submissionId: "sub_" + Date.now(),
      createdAt: new Date().toISOString(),
      villageName: getNearestVillage(sub.latitude, sub.longitude)
    };

    // 1. Save to localStorage immediately (instant UI feedback)
    const cached = getLocalData<Submission[]>("submissions", PRESET_SUBMISSIONS);
    cached.unshift(newSub);
    setLocalData("submissions", cached);

    // 2. Clusterize (updates local + Supabase clusters)
    await this.clusterizeSubmission(newSub);

    // 3. Push to Supabase
    const sb = await getSupabase();
    if (sb) {
      try {
        const { error } = await withTimeout(
          sb.from("submissions").insert({
            submission_id: newSub.submissionId,
            user_id: newSub.userId,
            user_name: newSub.userName,
            text: newSub.text,
            translated_text: newSub.translatedText,
            summary: newSub.summary,
            category: newSub.category,
            image_url: newSub.imageUrl ?? null,
            latitude: newSub.latitude,
            longitude: newSub.longitude,
            created_at: newSub.createdAt,
            cluster_id: newSub.clusterId ?? null,
            village_name: newSub.villageName,
            language: newSub.language,
            audio_url: newSub.audioUrl ?? null,
            phone_number: newSub.phoneNumber ?? null
          })
        );
        if (error) throw error;
        console.log("%c✅ Submission saved to Supabase", "color:green");
      } catch (e) {
        console.error("Supabase addSubmission failed — saved locally only.", e);
      }
    }

    return newSub;
  },

  // ── Get clusters (Supabase primary, localStorage fallback) ─────────────────
  async getClusters(): Promise<Cluster[]> {
    const sb = await getSupabase();
    if (sb) {
      try {
        const { data, error } = await withTimeout(
          sb.from("clusters").select("*").order("priority_score", { ascending: false })
        );
        if (error) throw error;
        if (data && data.length > 0) {
          const list = data.map(mapClusterFromPG);
          setLocalData("clusters", list);
          return list;
        }
      } catch (e) {
        console.warn("Supabase getClusters failed → localStorage.", e);
      }
    }
    return getLocalData<Cluster[]>("clusters", PRESET_CLUSTERS)
      .sort((a, b) => b.priorityScore - a.priorityScore);
  },

  // ── Update cluster status (Supabase primary) ────────────────────────────────
  async updateCluster(cluster: Cluster): Promise<void> {
    // Update local cache first
    const current = getLocalData<Cluster[]>("clusters", PRESET_CLUSTERS);
    const index = current.findIndex(c => c.clusterId === cluster.clusterId);
    if (index !== -1) { current[index] = cluster; setLocalData("clusters", current); }

    const sb = await getSupabase();
    if (sb) {
      try {
        const { error } = await withTimeout(
          sb.from("clusters").upsert({
            cluster_id: cluster.clusterId,
            title: cluster.title,
            category: cluster.category,
            citizen_count: cluster.citizenCount,
            villages_affected: cluster.villagesAffected,
            priority_score: cluster.priorityScore,
            explanation: cluster.explanation,
            images: cluster.images,
            location: cluster.location,
            status: cluster.status,
            public_evidence_link: cluster.publicEvidenceLink ?? null
          })
        );
        if (error) throw error;
      } catch (e) {
        console.error("Supabase updateCluster failed.", e);
      }
    }
  },

  // ── Get public data ─────────────────────────────────────────────────────────
  async getPublicData(): Promise<PublicData[]> {
    const sb = await getSupabase();
    if (sb) {
      try {
        const { data, error } = await withTimeout(sb.from("public_data").select("*"));
        if (error) throw error;
        if (data && data.length > 0) {
          const list = data.map(mapPublicDataFromPG);
          setLocalData("publicData", list);
          return list;
        }
      } catch (e) {
        console.warn("Supabase getPublicData failed → localStorage.", e);
      }
    }
    return getLocalData<PublicData[]>("publicData", PRESET_PUBLIC_DATA);
  },

  // ── Get reports ─────────────────────────────────────────────────────────────
  async getReports(): Promise<Report[]> {
    const sb = await getSupabase();
    if (sb) {
      try {
        const { data, error } = await withTimeout(
          sb.from("reports").select("*").order("generated_at", { ascending: false })
        );
        if (error) throw error;
        if (data && data.length > 0) {
          const list = data.map(mapReportFromPG);
          setLocalData("reports", list);
          return list;
        }
      } catch (e) {
        console.warn("Supabase getReports failed → localStorage.", e);
      }
    }
    return getLocalData<Report[]>("reports", [])
      .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  },

  // ── Add report ──────────────────────────────────────────────────────────────
  async addReport(report: Omit<Report, "reportId" | "generatedAt">): Promise<Report> {
    const newReport: Report = {
      ...report,
      reportId: "rep_" + Date.now(),
      generatedAt: new Date().toISOString()
    };

    const current = getLocalData<Report[]>("reports", []);
    current.unshift(newReport);
    setLocalData("reports", current);

    const sb = await getSupabase();
    if (sb) {
      try {
        const { error } = await withTimeout(
          sb.from("reports").insert({
            report_id: newReport.reportId,
            cluster_id: newReport.clusterId,
            cluster_title: newReport.clusterTitle,
            pdf_url: newReport.pdfUrl ?? null,
            generated_at: newReport.generatedAt,
            summary_text: newReport.summaryText
          })
        );
        if (error) throw error;
      } catch (e) {
        console.error("Supabase addReport failed.", e);
      }
    }
    return newReport;
  },

  // ── Clusterize a new submission and sync cluster to Supabase ───────────────
  async clusterizeSubmission(sub: Submission): Promise<void> {
    const clusters = getLocalData<Cluster[]>("clusters", PRESET_CLUSTERS);

    let matchedCluster = clusters.find(c =>
      c.category.toLowerCase() === sub.category.toLowerCase() &&
      c.villagesAffected.includes(sub.villageName)
    );

    if (matchedCluster) {
      matchedCluster.citizenCount += 1;
      if (sub.imageUrl && !matchedCluster.images.includes(sub.imageUrl)) {
        matchedCluster.images.push(sub.imageUrl);
      }
      const { score, explanation } = calculatePriorityScore(
        matchedCluster.citizenCount, sub.villageName, matchedCluster.category
      );
      matchedCluster.priorityScore = score;
      matchedCluster.explanation = explanation;
      sub.clusterId = matchedCluster.clusterId;
    } else {
      const newClusterId = "cluster_" + sub.category.toLowerCase().replace(/\s/g, "_") + "_" + Date.now();
      const { score, explanation } = calculatePriorityScore(1, sub.villageName, sub.category);
      const newCluster: Cluster = {
        clusterId: newClusterId,
        title: `Community Request for ${sub.category} Infrastructure in ${sub.villageName}`,
        category: sub.category,
        citizenCount: 1,
        villagesAffected: [sub.villageName],
        priorityScore: score,
        explanation,
        images: sub.imageUrl ? [sub.imageUrl] : [],
        location: { latitude: sub.latitude, longitude: sub.longitude },
        status: "Pending",
        publicEvidenceLink: sub.villageName.toLowerCase().replace(/[^a-z]/g, "")
      };
      clusters.push(newCluster);
      matchedCluster = newCluster;
      sub.clusterId = newClusterId;
    }

    // Persist cluster locally
    setLocalData("clusters", clusters);

    // Update submission cluster reference in local cache
    const currentSubs = getLocalData<Submission[]>("submissions", PRESET_SUBMISSIONS);
    const subIdx = currentSubs.findIndex(s => s.submissionId === sub.submissionId);
    if (subIdx !== -1) { currentSubs[subIdx] = sub; setLocalData("submissions", currentSubs); }

    // Sync updated cluster to Supabase
    if (matchedCluster) {
      const sb = await getSupabase();
      if (sb) {
        try {
          await withTimeout(
            sb.from("clusters").upsert({
              cluster_id: matchedCluster.clusterId,
              title: matchedCluster.title,
              category: matchedCluster.category,
              citizen_count: matchedCluster.citizenCount,
              villages_affected: matchedCluster.villagesAffected,
              priority_score: matchedCluster.priorityScore,
              explanation: matchedCluster.explanation,
              images: matchedCluster.images,
              location: matchedCluster.location,
              status: matchedCluster.status,
              public_evidence_link: matchedCluster.publicEvidenceLink ?? null
            })
          );
        } catch (e) {
          console.error("Supabase cluster sync failed.", e);
        }
      }
    }
  }
};
