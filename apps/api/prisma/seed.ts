import {
  AvailabilityBlockStatus,
  BookingStatus,
  BundleSearchStatus,
  CategoryStatus,
  DisputeStatus,
  ListingCondition,
  ListingStatus,
  NotificationChannel,
  NotificationType,
  PaymentStatus,
  PickupMethod,
  PricingRuleType,
  Prisma,
  PrismaClient,
  UserRole,
  UserStatus,
  VerificationLevel,
  VerificationStatus,
} from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

const seedYear = 2026;
const rng = createRng(20260423);
const bundleNow = new Date("2026-04-23T09:00:00.000Z");
const imageBaseUrl = "https://cdn.demo.rentmatch.local/listings";

type Archetype = "cheap" | "premium" | "local" | "inconsistent";
type QualityTier = "low" | "mid" | "high";
type AvailabilityProfile = "open" | "partial" | "fragmented" | "scarce";
type PriceBand = "cheap" | "mid" | "premium";
type ParentCategoryKey = "events" | "photography" | "audio" | "outdoor" | "power";
type CategoryKey =
  | "chairs"
  | "tables"
  | "projectors"
  | "stages"
  | "cameras"
  | "lenses"
  | "lighting"
  | "tripods"
  | "speakers"
  | "microphones"
  | "mixers"
  | "tents"
  | "heaters"
  | "generators";
type PreferencePreset = "balanced" | "cheapest" | "mostReliable" | "easiestPickup" | "bestDateFit";
type ScenarioCandidateType = "balanced" | "cheapest" | "sameLender" | "premium" | "fragile" | "weakLink";

interface Neighborhood {
  key: string;
  nameHe: string;
  nameEn: string;
  lat: number;
  lng: number;
  spreadLat: number;
  spreadLng: number;
}

interface CategoryTemplate {
  key: CategoryKey;
  parentKey: ParentCategoryKey;
  slug: string;
  nameHe: string;
  nameEn: string;
  titleHe: string[];
  titleEn: string[];
  brands: string[];
  models: string[];
  detailsHe: string[];
  detailsEn: string[];
  attributes: Array<{
    key: string;
    values: Array<string | boolean | number>;
  }>;
  inventoryRange: [number, number];
  depositMultiplier: [number, number];
  priceBands: Record<PriceBand, [number, number]>;
}

interface LenderBlueprint {
  displayName: string;
  displayNameHe: string;
  ownerName: string;
  archetype: Archetype;
  neighborhoodKey: string;
  listingTarget: number;
  primaryCategories: CategoryKey[];
  secondaryCategories: CategoryKey[];
  featured?: boolean;
}

interface GeneratedLender {
  id: string;
  displayName: string;
  displayNameHe: string;
  ownerName: string;
  archetype: Archetype;
  neighborhood: Neighborhood;
  listingTarget: number;
  primaryCategories: CategoryKey[];
  secondaryCategories: CategoryKey[];
  reliabilityScore: number;
  averageRating: number;
  cancellationRate: number;
  lateReturnRate: number;
  complaintRate: number;
  responseTimeScore: number;
  verificationLevel: VerificationLevel;
  completedTransactionsCount: number;
  isFeatured: boolean;
}

interface GeneratedListingMeta {
  id: string;
  lenderId: string;
  categoryKey: CategoryKey;
  lenderArchetype: Archetype;
  neighborhoodKey: string;
  listingStatus: ListingStatus;
  qualityTier: QualityTier;
  availabilityProfile: AvailabilityProfile;
  basePriceDaily: number;
  depositAmount: number;
  qualityScore: number;
  deliverySupported: boolean;
  inventoryCount: number;
  pickupLat: number;
  pickupLng: number;
  pickupAddressText: string;
  imageCount: number;
  titleHe: string;
  titleEn: string;
}

interface SearchScenarioTemplate {
  key: string;
  nameHe: string;
  nameEn: string;
  renterLocation: Neighborhood;
  preset: PreferencePreset;
  maxBudget?: number;
  maxPickupPoints?: number;
  sameLenderPreferred: boolean;
  deliveryPreferred: boolean;
  exactDatesOnly: boolean;
  dateOffsetDays: number;
  durationDays: number;
  slots: Array<{
    slotKey: string;
    categoryKey: CategoryKey;
    quantity: number;
    optional: boolean;
    constraints?: Record<string, unknown>;
  }>;
  strategies: ScenarioCandidateType[];
}

interface SearchCandidateDraft {
  id: string;
  searchRequestId: string;
  type: ScenarioCandidateType;
  label: string;
  labelHe: string;
  items: Array<{
    id: string;
    requestedSlotKey: string;
    listing: GeneratedListingMeta;
    quantity: number;
  }>;
  rawPrice: number;
  rawReliability: number;
  rawLogistics: number;
  rawAvailability: number;
  rawQuality: number;
  rawStability: number;
  totalDistanceKm: number;
  pickupPointsCount: number;
  lendersCount: number;
  exactAvailabilityFit: boolean;
}

const neighborhoods: Neighborhood[] = [
  {
    key: "florentin",
    nameHe: "פלורנטין",
    nameEn: "Florentin",
    lat: 32.0554,
    lng: 34.7703,
    spreadLat: 0.009,
    spreadLng: 0.010,
  },
  {
    key: "lev-hair",
    nameHe: "לב העיר",
    nameEn: "Lev HaIr",
    lat: 32.0716,
    lng: 34.7733,
    spreadLat: 0.008,
    spreadLng: 0.009,
  },
  {
    key: "ramat-gan",
    nameHe: "רמת גן",
    nameEn: "Ramat Gan",
    lat: 32.0836,
    lng: 34.8248,
    spreadLat: 0.011,
    spreadLng: 0.010,
  },
  {
    key: "givatayim",
    nameHe: "גבעתיים",
    nameEn: "Givatayim",
    lat: 32.0722,
    lng: 34.8117,
    spreadLat: 0.008,
    spreadLng: 0.008,
  },
  {
    key: "holon",
    nameHe: "חולון",
    nameEn: "Holon",
    lat: 32.0158,
    lng: 34.7874,
    spreadLat: 0.012,
    spreadLng: 0.011,
  },
  {
    key: "petah-tikva",
    nameHe: "פתח תקווה",
    nameEn: "Petah Tikva",
    lat: 32.0871,
    lng: 34.8878,
    spreadLat: 0.013,
    spreadLng: 0.014,
  },
];

const parentCategories = [
  { key: "events" as const, slug: "events", nameHe: "אירועים", nameEn: "Events" },
  { key: "photography" as const, slug: "photography", nameHe: "צילום", nameEn: "Photography" },
  { key: "audio" as const, slug: "audio", nameHe: "אודיו", nameEn: "Audio" },
  { key: "outdoor" as const, slug: "outdoor", nameHe: "חוץ", nameEn: "Outdoor" },
  { key: "power" as const, slug: "power", nameHe: "חשמל וכוח", nameEn: "Power" },
];

const categoryTemplates: CategoryTemplate[] = [
  {
    key: "chairs",
    parentKey: "events",
    slug: "chairs",
    nameHe: "כיסאות",
    nameEn: "Chairs",
    titleHe: ["כיסא מתקפל מרופד", "כיסא אירועים לבן", "כיסא בר גבוה", "כיסא כנסים שחור"],
    titleEn: ["Padded folding chair", "White event chair", "High bar stool", "Conference chair"],
    brands: ["EventLine", "Lifetime", "BanquetPro", "Keter"],
    models: ["Venue", "Classic", "StackMax", "ProFold"],
    detailsHe: ["מתאים לאירועים", "קל לשינוע", "נוח לישיבה ארוכה", "נראה ייצוגי באולם"],
    detailsEn: ["Suited for events", "Easy to transport", "Comfortable for long sessions", "Looks polished on stage"],
    attributes: [
      { key: "material", values: ["plastic", "metal", "wood"] },
      { key: "folding", values: [true, false] },
      { key: "stackable", values: [true, false] },
      { key: "color", values: ["white", "black", "beige", "silver"] },
    ],
    inventoryRange: [12, 80],
    depositMultiplier: [1.2, 2.5],
    priceBands: {
      cheap: [20, 38],
      mid: [38, 68],
      premium: [68, 120],
    },
  },
  {
    key: "tables",
    parentKey: "events",
    slug: "tables",
    nameHe: "שולחנות",
    nameEn: "Tables",
    titleHe: ["שולחן מתקפל עגול", "שולחן קייטרינג מלבני", "שולחן בר גבוה", "שולחן תצוגה"],
    titleEn: ["Round folding table", "Rectangular catering table", "High cocktail table", "Display table"],
    brands: ["BanquetPro", "Lifetime", "Venue Works", "EventLine"],
    models: ["RoundMax", "ServicePro", "Cocktail", "Expo"],
    detailsHe: ["עמיד לעומס", "קל לקיפול", "מתאים לכיסוי בד", "כולל רגליים יציבות"],
    detailsEn: ["Handles heavy loads", "Folds quickly", "Works with table covers", "Stable leg structure"],
    attributes: [
      { key: "shape", values: ["round", "rectangular", "high-top"] },
      { key: "material", values: ["plastic", "wood", "aluminum"] },
      { key: "folding", values: [true] },
      { key: "capacity", values: [4, 6, 8, 10] },
    ],
    inventoryRange: [4, 32],
    depositMultiplier: [1.4, 3.0],
    priceBands: {
      cheap: [35, 65],
      mid: [65, 120],
      premium: [120, 210],
    },
  },
  {
    key: "projectors",
    parentKey: "events",
    slug: "projectors",
    nameHe: "מקרנים",
    nameEn: "Projectors",
    titleHe: ["מקרן מצגות נייד", "מקרן לייזר לאולם", "מקרן Full HD", "מקרן קצר טווח"],
    titleEn: ["Portable presentation projector", "Laser hall projector", "Full HD projector", "Short-throw projector"],
    brands: ["Epson", "BenQ", "Optoma", "ViewSonic"],
    models: ["ProBeam", "VenueCast", "ShortFocus", "LaserGo"],
    detailsHe: ["בהירות גבוהה", "קל לחיבור HDMI", "מתאים להרצאות", "כולל שלט ותיק"],
    detailsEn: ["High brightness", "Easy HDMI setup", "Ideal for presentations", "Includes remote and case"],
    attributes: [
      { key: "brightness", values: [3200, 4000, 5000, 6500] },
      { key: "resolution", values: ["1080p", "4k", "WXGA"] },
      { key: "shortThrow", values: [true, false] },
      { key: "hdmi", values: [true] },
    ],
    inventoryRange: [1, 8],
    depositMultiplier: [2.0, 4.0],
    priceBands: {
      cheap: [120, 220],
      mid: [220, 420],
      premium: [420, 780],
    },
  },
  {
    key: "stages",
    parentKey: "events",
    slug: "stages",
    nameHe: "במות",
    nameEn: "Stages",
    titleHe: ["במת מודולרית קטנה", "במת הופעה 4x2", "במת כנסים נמוכה", "פודיום להרצאות"],
    titleEn: ["Small modular stage", "4x2 performance stage", "Low conference stage", "Lecture podium"],
    brands: ["StageCraft", "EventDeck", "VenueBuild", "ProStage"],
    models: ["ModuDeck", "Stage4", "LectureRise", "Compact Pod"],
    detailsHe: ["הרכבה מהירה", "מתאים לאירועי חוץ", "כולל חיפוי שחור", "מבנה יציב"],
    detailsEn: ["Fast to assemble", "Suitable for outdoor use", "Black skirt included", "Stable structure"],
    attributes: [
      { key: "surface", values: ["anti-slip", "wood", "composite"] },
      { key: "moduleCount", values: [2, 4, 6, 8] },
      { key: "indoorOutdoor", values: ["indoor", "outdoor", "both"] },
      { key: "stairsIncluded", values: [true, false] },
    ],
    inventoryRange: [1, 6],
    depositMultiplier: [2.2, 4.5],
    priceBands: {
      cheap: [220, 320],
      mid: [320, 520],
      premium: [520, 900],
    },
  },
  {
    key: "cameras",
    parentKey: "photography",
    slug: "cameras",
    nameHe: "מצלמות",
    nameEn: "Cameras",
    titleHe: ["מצלמת וידאו היברידית", "מצלמת סטילס מקצועית", "מצלמת קולנוע קומפקטית", "מצלמת מירורלס"],
    titleEn: ["Hybrid video camera", "Professional stills camera", "Compact cinema camera", "Mirrorless camera"],
    brands: ["Sony", "Canon", "Fujifilm", "Panasonic", "RED"],
    models: ["A7 IV", "EOS R6", "X-H2", "S5 II", "Komodo"],
    detailsHe: ["כולל סוללות וטעינה", "איכות תמונה גבוהה", "מתאים להפקות מקצועיות", "תיק נשיאה כלול"],
    detailsEn: ["Includes batteries and charger", "High image quality", "Suitable for production work", "Carry case included"],
    attributes: [
      { key: "sensor", values: ["full-frame", "aps-c", "super35"] },
      { key: "video", values: ["4k", "6k", "8k"] },
      { key: "stabilization", values: [true, false] },
      { key: "lensMount", values: ["E", "RF", "X", "L", "PL"] },
    ],
    inventoryRange: [1, 6],
    depositMultiplier: [3.5, 6.5],
    priceBands: {
      cheap: [180, 320],
      mid: [320, 560],
      premium: [560, 980],
    },
  },
  {
    key: "lenses",
    parentKey: "photography",
    slug: "lenses",
    nameHe: "עדשות",
    nameEn: "Lenses",
    titleHe: ["עדשת זום מהירה", "עדשת פריים פורטרט", "עדשת רחבה", "עדשת טלה קלה"],
    titleEn: ["Fast zoom lens", "Portrait prime lens", "Wide angle lens", "Light telephoto lens"],
    brands: ["Sony", "Sigma", "Canon", "Tamron", "Fujinon"],
    models: ["24-70", "35mm", "16-35", "70-200", "50mm"],
    detailsHe: ["חדות טובה", "מתאימה לצילום אירועים", "כולל מכסים", "מגיעה עם פילטר הגנה"],
    detailsEn: ["Sharp optics", "Works well for events", "Caps included", "Protective filter included"],
    attributes: [
      { key: "focalRange", values: ["24-70", "16-35", "35", "50", "70-200"] },
      { key: "aperture", values: ["1.4", "1.8", "2.8", "4.0"] },
      { key: "stabilized", values: [true, false] },
      { key: "mount", values: ["E", "RF", "X", "L"] },
    ],
    inventoryRange: [1, 8],
    depositMultiplier: [2.8, 5.0],
    priceBands: {
      cheap: [80, 150],
      mid: [150, 280],
      premium: [280, 520],
    },
  },
  {
    key: "lighting",
    parentKey: "photography",
    slug: "lighting",
    nameHe: "תאורה",
    nameEn: "Lighting",
    titleHe: ["ערכת LED כפולה", "פנס סטודיו נייד", "פאנל אור רך", "ערכת תאורה ראיון"],
    titleEn: ["Dual LED kit", "Portable studio light", "Soft light panel", "Interview lighting kit"],
    brands: ["Aputure", "Godox", "Nanlite", "Amaran"],
    models: ["120D", "60X", "Forza", "Panel Mix"],
    detailsHe: ["כולל סטנדים", "טמפרטורה מתכווננת", "מתאים לווידאו", "תיק קשיח זמין"],
    detailsEn: ["Includes stands", "Adjustable color temperature", "Ideal for video", "Hard case available"],
    attributes: [
      { key: "power", values: ["60w", "100w", "300w", "600w"] },
      { key: "biColor", values: [true, false] },
      { key: "batterySupport", values: [true, false] },
      { key: "softboxIncluded", values: [true, false] },
    ],
    inventoryRange: [1, 10],
    depositMultiplier: [2.2, 4.2],
    priceBands: {
      cheap: [70, 140],
      mid: [140, 260],
      premium: [260, 520],
    },
  },
  {
    key: "tripods",
    parentKey: "photography",
    slug: "tripods",
    nameHe: "חצובות",
    nameEn: "Tripods",
    titleHe: ["חצובת וידאו מקצועית", "חצובת קרבון קלה", "חצובת צילום בסיסית", "מונופוד אירועים"],
    titleEn: ["Professional video tripod", "Light carbon tripod", "Basic photo tripod", "Event monopod"],
    brands: ["Manfrotto", "Benro", "Sirui", "Sachtler"],
    models: ["Fluid Pro", "CarbonLite", "Event Pod", "Ace"],
    detailsHe: ["ראש fluid", "קיפול מהיר", "מתאים לצילום שטח", "כולל תיק נשיאה"],
    detailsEn: ["Fluid head", "Fast fold setup", "Suitable for field work", "Carry bag included"],
    attributes: [
      { key: "head", values: ["fluid", "ball", "photo"] },
      { key: "material", values: ["aluminum", "carbon"] },
      { key: "maxHeightCm", values: [150, 165, 180] },
      { key: "payloadKg", values: [4, 6, 8, 12] },
    ],
    inventoryRange: [1, 12],
    depositMultiplier: [1.8, 3.2],
    priceBands: {
      cheap: [25, 55],
      mid: [55, 115],
      premium: [115, 220],
    },
  },
  {
    key: "speakers",
    parentKey: "audio",
    slug: "speakers",
    nameHe: "רמקולים",
    nameEn: "Speakers",
    titleHe: ["רמקול PA מוגבר", "זוג רמקולים לאירוע", "סאב עם סט עליונים", "רמקול נייד על סוללה"],
    titleEn: ["Powered PA speaker", "Speaker pair for events", "Sub and tops set", "Battery powered speaker"],
    brands: ["JBL", "QSC", "Yamaha", "Mackie"],
    models: ["EON", "K12", "DBR", "Thump"],
    detailsHe: ["עוצמה גבוהה", "מתאים להרצאות", "כולל מעמדים", "עובד היטב בחלל פתוח"],
    detailsEn: ["High output", "Suitable for presentations", "Includes stands", "Works well outdoors"],
    attributes: [
      { key: "power", values: ["1000w", "1500w", "2000w"] },
      { key: "battery", values: [true, false] },
      { key: "pairIncluded", values: [true, false] },
      { key: "bluetooth", values: [true, false] },
    ],
    inventoryRange: [1, 10],
    depositMultiplier: [2.2, 4.0],
    priceBands: {
      cheap: [75, 150],
      mid: [150, 290],
      premium: [290, 520],
    },
  },
  {
    key: "microphones",
    parentKey: "audio",
    slug: "microphones",
    nameHe: "מיקרופונים",
    nameEn: "Microphones",
    titleHe: ["מיקרופון אלחוטי ידני", "סט דש כפול", "מיקרופון Shotgun", "מיקרופון במה דינמי"],
    titleEn: ["Wireless handheld microphone", "Dual lavalier set", "Shotgun microphone", "Dynamic stage microphone"],
    brands: ["Shure", "Sennheiser", "Rode", "Audio-Technica"],
    models: ["BLX", "EW-D", "NTG", "ATW"],
    detailsHe: ["קל לתפעול", "מתאים לראיונות", "סאונד יציב", "כולל מקלט וקייס"],
    detailsEn: ["Easy to use", "Great for interviews", "Stable sound", "Receiver and case included"],
    attributes: [
      { key: "type", values: ["wireless", "shotgun", "lavalier", "dynamic"] },
      { key: "batteryIncluded", values: [true, false] },
      { key: "channels", values: [1, 2, 4] },
      { key: "connector", values: ["XLR", "3.5mm", "USB-C"] },
    ],
    inventoryRange: [1, 18],
    depositMultiplier: [1.8, 3.6],
    priceBands: {
      cheap: [30, 65],
      mid: [65, 130],
      premium: [130, 260],
    },
  },
  {
    key: "mixers",
    parentKey: "audio",
    slug: "mixers",
    nameHe: "מיקסרים",
    nameEn: "Mixers",
    titleHe: ["מיקסר דיגיטלי קטן", "מיקסר 8 ערוצים", "מיקסר להופעה חיה", "מיקסר קומפקטי לאירועים"],
    titleEn: ["Small digital mixer", "8-channel mixer", "Live performance mixer", "Compact event mixer"],
    brands: ["Behringer", "Soundcraft", "Allen & Heath", "Yamaha"],
    models: ["X-Air", "Ui12", "CQ", "MG"],
    detailsHe: ["שליטה נוחה", "כולל אפקטים", "מתאים למוזיקה ודיבור", "חיבור מהיר למערכת"],
    detailsEn: ["Simple control", "Built-in effects", "Works for music and speech", "Fast system hookup"],
    attributes: [
      { key: "channels", values: [6, 8, 12, 16] },
      { key: "digital", values: [true, false] },
      { key: "wirelessControl", values: [true, false] },
      { key: "usbRecording", values: [true, false] },
    ],
    inventoryRange: [1, 6],
    depositMultiplier: [2.5, 4.2],
    priceBands: {
      cheap: [110, 180],
      mid: [180, 320],
      premium: [320, 580],
    },
  },
  {
    key: "tents",
    parentKey: "outdoor",
    slug: "tents",
    nameHe: "אוהלים",
    nameEn: "Tents",
    titleHe: ["אוהל הצללה 3x3", "אוהל אירועים 6x4", "אוהל פתיחה מהירה", "אוהל קבלת קהל"],
    titleEn: ["3x3 shade tent", "6x4 event tent", "Quick pop-up tent", "Reception tent"],
    brands: ["ShelterPro", "EasyShade", "Event Canopy", "OutdoorLine"],
    models: ["Quick3", "Venue6", "ShadeMax", "GuestCover"],
    detailsHe: ["הרכבה מהירה", "עמיד לרוח", "כולל תיק", "מתאים לקיץ הישראלי"],
    detailsEn: ["Fast setup", "Wind resistant", "Comes with bag", "Built for Israeli summer"],
    attributes: [
      { key: "size", values: ["3x3", "4x4", "6x4", "8x4"] },
      { key: "wallsIncluded", values: [true, false] },
      { key: "waterResistant", values: [true, false] },
      { key: "color", values: ["white", "black", "sand"] },
    ],
    inventoryRange: [1, 8],
    depositMultiplier: [2.4, 4.0],
    priceBands: {
      cheap: [180, 260],
      mid: [260, 420],
      premium: [420, 760],
    },
  },
  {
    key: "heaters",
    parentKey: "outdoor",
    slug: "heaters",
    nameHe: "פטריות חימום",
    nameEn: "Heaters",
    titleHe: ["פטריית חימום גז", "מחמם אינפרא נייד", "פטרייה לאירוע חוץ", "מחמם עמוד"],
    titleEn: ["Gas patio heater", "Portable infrared heater", "Outdoor event heater", "Column heater"],
    brands: ["HeatPro", "SunWarm", "Outdoor Heat", "WarmLine"],
    models: ["Patio XL", "InfraGo", "VenueHeat", "Tower"],
    detailsHe: ["מתאים לערב קריר", "הדלקה פשוטה", "יציב על משטח", "כולל בלון לפי צורך"],
    detailsEn: ["Good for cool evenings", "Simple ignition", "Stable on flat surfaces", "Gas bottle on request"],
    attributes: [
      { key: "fuel", values: ["gas", "electric"] },
      { key: "coverageSqM", values: [12, 18, 24] },
      { key: "outdoorOnly", values: [true] },
      { key: "wheelBase", values: [true, false] },
    ],
    inventoryRange: [2, 16],
    depositMultiplier: [1.8, 3.0],
    priceBands: {
      cheap: [60, 95],
      mid: [95, 160],
      premium: [160, 260],
    },
  },
  {
    key: "generators",
    parentKey: "power",
    slug: "generators",
    nameHe: "גנרטורים",
    nameEn: "Generators",
    titleHe: ["גנרטור שקט 3kW", "גנרטור אירועים 6kW", "גנרטור חירום", "גנרטור אינוורטר"],
    titleEn: ["Quiet 3kW generator", "6kW event generator", "Backup generator", "Inverter generator"],
    brands: ["Honda", "Hyundai", "Kohler", "PowerTech"],
    models: ["Silent3", "Event6", "Backup", "Inverter Pro"],
    detailsHe: ["מתאים לחשמל חוץ", "רעש מופחת", "כולל כבל בסיסי", "אמין לעבודה רציפה"],
    detailsEn: ["Suitable for outdoor power", "Lower noise output", "Includes base cable", "Reliable for continuous work"],
    attributes: [
      { key: "powerOutput", values: ["3kw", "5kw", "6kw", "8kw"] },
      { key: "silentMode", values: [true, false] },
      { key: "fuel", values: ["gasoline", "diesel"] },
      { key: "wheels", values: [true, false] },
    ],
    inventoryRange: [1, 6],
    depositMultiplier: [2.8, 5.5],
    priceBands: {
      cheap: [140, 220],
      mid: [220, 380],
      premium: [380, 760],
    },
  },
];

const blueprints: LenderBlueprint[] = [
  {
    displayName: "Budget Gear East",
    displayNameHe: "באג'ט גיר מזרח",
    ownerName: "Avi Cohen",
    archetype: "cheap",
    neighborhoodKey: "petah-tikva",
    listingTarget: 16,
    primaryCategories: ["cameras", "tripods", "lighting", "microphones"],
    secondaryCategories: ["speakers", "projectors"],
  },
  {
    displayName: "Quick Event Outlet",
    displayNameHe: "קוויק איוונט אאוטלט",
    ownerName: "Lior Levi",
    archetype: "cheap",
    neighborhoodKey: "holon",
    listingTarget: 16,
    primaryCategories: ["chairs", "tables", "projectors", "speakers"],
    secondaryCategories: ["heaters", "generators"],
  },
  {
    displayName: "Second Shot Rentals",
    displayNameHe: "סקנד שוט רנטלס",
    ownerName: "Dana Azulay",
    archetype: "cheap",
    neighborhoodKey: "petah-tikva",
    listingTarget: 16,
    primaryCategories: ["cameras", "lenses", "lighting", "tripods"],
    secondaryCategories: ["projectors", "speakers"],
  },
  {
    displayName: "Stage Saver",
    displayNameHe: "סטייג' סייבר",
    ownerName: "Eran Ben David",
    archetype: "cheap",
    neighborhoodKey: "holon",
    listingTarget: 16,
    primaryCategories: ["stages", "chairs", "tables", "speakers"],
    secondaryCategories: ["tents", "generators"],
  },
  {
    displayName: "Microphone Market",
    displayNameHe: "מיקרופון מרקט",
    ownerName: "Tali Gross",
    archetype: "cheap",
    neighborhoodKey: "petah-tikva",
    listingTarget: 16,
    primaryCategories: ["microphones", "mixers", "speakers", "projectors"],
    secondaryCategories: ["lighting", "tripods"],
  },
  {
    displayName: "Low Cost Venue Supply",
    displayNameHe: "לו קוסט וניו סופליי",
    ownerName: "Moti Harel",
    archetype: "cheap",
    neighborhoodKey: "holon",
    listingTarget: 16,
    primaryCategories: ["chairs", "tables", "tents", "heaters"],
    secondaryCategories: ["projectors", "speakers"],
  },
  {
    displayName: "Value Lens Depot",
    displayNameHe: "וליו לנס דיפו",
    ownerName: "Neta Ron",
    archetype: "cheap",
    neighborhoodKey: "petah-tikva",
    listingTarget: 16,
    primaryCategories: ["cameras", "lenses", "tripods", "lighting"],
    secondaryCategories: ["microphones", "projectors"],
  },
  {
    displayName: "East Side Power Rent",
    displayNameHe: "איסט סייד פאואר רנט",
    ownerName: "Gilad Mor",
    archetype: "cheap",
    neighborhoodKey: "petah-tikva",
    listingTarget: 16,
    primaryCategories: ["generators", "heaters", "tents", "stages"],
    secondaryCategories: ["tables", "chairs"],
  },
  {
    displayName: "Prime Frame House",
    displayNameHe: "פריים פריים האוס",
    ownerName: "Yael Berger",
    archetype: "premium",
    neighborhoodKey: "lev-hair",
    listingTarget: 14,
    primaryCategories: ["cameras", "lenses", "lighting", "tripods"],
    secondaryCategories: ["microphones"],
    featured: true,
  },
  {
    displayName: "Studio Black TLV",
    displayNameHe: "סטודיו בלאק תל אביב",
    ownerName: "Nadav Shalev",
    archetype: "premium",
    neighborhoodKey: "florentin",
    listingTarget: 14,
    primaryCategories: ["cameras", "lighting", "projectors"],
    secondaryCategories: ["tripods", "speakers"],
    featured: true,
  },
  {
    displayName: "Crown Event Systems",
    displayNameHe: "קראון איוונט סיסטמס",
    ownerName: "Keren Admoni",
    archetype: "premium",
    neighborhoodKey: "lev-hair",
    listingTarget: 14,
    primaryCategories: ["projectors", "speakers", "mixers", "microphones"],
    secondaryCategories: ["stages"],
    featured: true,
  },
  {
    displayName: "Aputure Boutique",
    displayNameHe: "אפוצ'ר בוטיק",
    ownerName: "Roy Keidar",
    archetype: "premium",
    neighborhoodKey: "lev-hair",
    listingTarget: 14,
    primaryCategories: ["lighting", "cameras", "lenses"],
    secondaryCategories: ["tripods", "microphones"],
    featured: true,
  },
  {
    displayName: "Prestige Outdoor",
    displayNameHe: "פרסטיג' אאוטדור",
    ownerName: "Shir Tal",
    archetype: "premium",
    neighborhoodKey: "ramat-gan",
    listingTarget: 14,
    primaryCategories: ["tents", "heaters", "generators", "stages"],
    secondaryCategories: ["speakers"],
  },
  {
    displayName: "North Sound Atelier",
    displayNameHe: "נורת' סאונד אטלייה",
    ownerName: "Idan Fuchs",
    archetype: "premium",
    neighborhoodKey: "ramat-gan",
    listingTarget: 14,
    primaryCategories: ["speakers", "mixers", "microphones"],
    secondaryCategories: ["projectors", "lighting"],
    featured: true,
  },
  {
    displayName: "Cinema Reserve",
    displayNameHe: "סינמה ריזרב",
    ownerName: "Maya Aharon",
    archetype: "premium",
    neighborhoodKey: "givatayim",
    listingTarget: 14,
    primaryCategories: ["cameras", "lenses", "tripods", "projectors"],
    secondaryCategories: ["lighting"],
    featured: true,
  },
  {
    displayName: "Bundle Hub Central",
    displayNameHe: "באנדל האב סנטרל",
    ownerName: "Amit Sela",
    archetype: "local",
    neighborhoodKey: "givatayim",
    listingTarget: 20,
    primaryCategories: ["cameras", "tripods", "lighting", "microphones", "speakers"],
    secondaryCategories: ["projectors", "tables"],
  },
  {
    displayName: "City Event Locker",
    displayNameHe: "סיטי איוונט לוקר",
    ownerName: "Rina Amit",
    archetype: "local",
    neighborhoodKey: "florentin",
    listingTarget: 20,
    primaryCategories: ["chairs", "tables", "projectors", "speakers"],
    secondaryCategories: ["microphones", "tents", "heaters"],
  },
  {
    displayName: "One Stop Production",
    displayNameHe: "וואן סטופ פרודקשן",
    ownerName: "Noam Dror",
    archetype: "local",
    neighborhoodKey: "lev-hair",
    listingTarget: 20,
    primaryCategories: ["cameras", "lighting", "tripods", "microphones", "projectors"],
    secondaryCategories: ["speakers"],
    featured: true,
  },
  {
    displayName: "Neighborhood Stage Store",
    displayNameHe: "נייברהוד סטייג' סטור",
    ownerName: "Talya Zinati",
    archetype: "local",
    neighborhoodKey: "ramat-gan",
    listingTarget: 20,
    primaryCategories: ["stages", "speakers", "mixers", "projectors"],
    secondaryCategories: ["chairs", "tables", "generators"],
  },
  {
    displayName: "Pickup Point South",
    displayNameHe: "פיקאפ פוינט דרום",
    ownerName: "Doron Itach",
    archetype: "local",
    neighborhoodKey: "florentin",
    listingTarget: 20,
    primaryCategories: ["tents", "heaters", "generators", "chairs", "tables"],
    secondaryCategories: ["speakers", "projectors"],
  },
  {
    displayName: "Compact AV Cluster",
    displayNameHe: "קומפקט אייוי קלאסטר",
    ownerName: "Adi Kramer",
    archetype: "local",
    neighborhoodKey: "givatayim",
    listingTarget: 20,
    primaryCategories: ["microphones", "speakers", "mixers", "projectors"],
    secondaryCategories: ["lighting", "tripods"],
  },
  {
    displayName: "Corner Bundle Depot",
    displayNameHe: "קורנר באנדל דיפו",
    ownerName: "Hila Dayan",
    archetype: "local",
    neighborhoodKey: "lev-hair",
    listingTarget: 20,
    primaryCategories: ["chairs", "tables", "projectors", "lighting"],
    secondaryCategories: ["cameras", "tripods", "microphones"],
  },
  {
    displayName: "Fast Lift Events",
    displayNameHe: "פאסט ליפט איוונטס",
    ownerName: "Barak Rubin",
    archetype: "local",
    neighborhoodKey: "ramat-gan",
    listingTarget: 20,
    primaryCategories: ["stages", "tents", "heaters", "generators"],
    secondaryCategories: ["chairs", "tables", "speakers"],
  },
  {
    displayName: "Mixed Shelf Rentals",
    displayNameHe: "מיקסד שלף רנטלס",
    ownerName: "Ofir Maman",
    archetype: "inconsistent",
    neighborhoodKey: "ramat-gan",
    listingTarget: 18,
    primaryCategories: ["cameras", "projectors", "speakers", "lighting"],
    secondaryCategories: ["tripods", "microphones"],
  },
  {
    displayName: "Patchwork Events",
    displayNameHe: "פאצ'וורק איוונטס",
    ownerName: "Limor Morad",
    archetype: "inconsistent",
    neighborhoodKey: "holon",
    listingTarget: 18,
    primaryCategories: ["chairs", "tables", "tents", "heaters"],
    secondaryCategories: ["projectors", "generators"],
  },
  {
    displayName: "Frame and Fail",
    displayNameHe: "פריים אנד פייל",
    ownerName: "Yotam Geva",
    archetype: "inconsistent",
    neighborhoodKey: "petah-tikva",
    listingTarget: 18,
    primaryCategories: ["cameras", "lenses", "tripods"],
    secondaryCategories: ["lighting", "projectors"],
  },
  {
    displayName: "Variable Audio Lab",
    displayNameHe: "ווריאבל אודיו לאב",
    ownerName: "Kobi Ravid",
    archetype: "inconsistent",
    neighborhoodKey: "givatayim",
    listingTarget: 18,
    primaryCategories: ["microphones", "speakers", "mixers"],
    secondaryCategories: ["projectors", "lighting"],
  },
  {
    displayName: "Odd Hour Supply",
    displayNameHe: "אוד האוור סופליי",
    ownerName: "Einav Alon",
    archetype: "inconsistent",
    neighborhoodKey: "holon",
    listingTarget: 18,
    primaryCategories: ["generators", "heaters", "stages"],
    secondaryCategories: ["tables", "chairs"],
  },
  {
    displayName: "Flip Side Rental",
    displayNameHe: "פליפ סייד רנטל",
    ownerName: "Shay Goren",
    archetype: "inconsistent",
    neighborhoodKey: "ramat-gan",
    listingTarget: 18,
    primaryCategories: ["projectors", "speakers", "chairs", "tables"],
    secondaryCategories: ["microphones", "mixers"],
  },
  {
    displayName: "Inventory Roulette",
    displayNameHe: "אינבנטורי רולטה",
    ownerName: "Ravit Paz",
    archetype: "inconsistent",
    neighborhoodKey: "petah-tikva",
    listingTarget: 18,
    primaryCategories: ["cameras", "lighting", "microphones"],
    secondaryCategories: ["tripods", "speakers", "projectors"],
  },
];

const renterNames = [
  "Maya Cohen",
  "Lior Dayan",
  "Noa Tzur",
  "Amit Bar",
  "Gal Harel",
  "Shira Ben Ami",
  "Aviad Rotem",
  "Yael Moyal",
  "Ronen Shafir",
  "Neta Biran",
  "Dolev Gafni",
  "Talya Mor",
  "Hadar Tennenbaum",
  "Ofek Ben Yaakov",
  "Keren Adler",
  "Ilanit Gold",
  "Tomer Avni",
  "Ayelet Peleg",
  "Niv Halperin",
  "Sapir Lahav",
];

async function main() {
  const passwordHash = await argon2.hash("Password123!");

  await clearDatabase();

  const adminId = makeId(1, 1);
  const parentCategoryIds = new Map<ParentCategoryKey, string>();
  const childCategoryIds = new Map<CategoryKey, string>();

  const parentCategoryRows: Prisma.CategoryCreateManyInput[] = parentCategories.map((parent, index) => {
    const id = makeId(2, index + 1);
    parentCategoryIds.set(parent.key, id);
    return {
      id,
      slug: parent.slug,
      nameHe: parent.nameHe,
      nameEn: parent.nameEn,
      status: CategoryStatus.ACTIVE,
    };
  });

  const childCategoryRows: Prisma.CategoryCreateManyInput[] = categoryTemplates.map((category, index) => {
    const id = makeId(3, index + 1);
    childCategoryIds.set(category.key, id);
    return {
      id,
      parentId: parentCategoryIds.get(category.parentKey)!,
      slug: category.slug,
      nameHe: category.nameHe,
      nameEn: category.nameEn,
      status: CategoryStatus.ACTIVE,
      attributesSchema: {
        fields: category.attributes.map((attribute) => ({
          key: attribute.key,
          type: typeof attribute.values[0] === "boolean" ? "boolean" : typeof attribute.values[0] === "number" ? "number" : "string",
          samples: attribute.values.slice(0, 3),
        })),
      } as Prisma.InputJsonValue,
    };
  });

  childCategoryIds.forEach((value, key) => {
    runtimeCategoryIds.set(key, value);
  });

  const adminUser: Prisma.UserCreateManyInput = {
    id: adminId,
    fullName: "Admin User",
    email: "admin@rentmatch.local",
    phone: "0500000000",
    passwordHash,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    locale: "he",
  };

  const renterUsers: Prisma.UserCreateManyInput[] = [];
  const renterProfiles: Prisma.RenterProfileCreateManyInput[] = [];
  const renterIds: string[] = [];

  renterNames.forEach((fullName, index) => {
    const renterId = makeId(10, index + 1);
    const neighborhood = neighborhoods[index % neighborhoods.length];
    const coords = createCoordinates(neighborhood, 0.55);
    renterIds.push(renterId);
    renterUsers.push({
      id: renterId,
      fullName,
      email: `renter${index + 1}@rentmatch.local`,
      phone: makePhone(501000000, index + 1),
      passwordHash,
      role: UserRole.RENTER,
      status: UserStatus.ACTIVE,
      locale: index % 5 === 0 ? "en" : "he",
    });
    renterProfiles.push({
      userId: renterId,
      defaultLocationLat: coords.lat,
      defaultLocationLng: coords.lng,
      defaultAddressText: `${randomStreetName()} ${12 + index}, ${neighborhood.nameHe}`,
      verificationStatus: index % 4 === 0 ? VerificationStatus.VERIFIED : VerificationStatus.PENDING,
      preferences: {
        preferredLanguage: index % 5 === 0 ? "en" : "he",
        preferenceProfile: pick<PreferencePreset>(["balanced", "cheapest", "mostReliable", "easiestPickup", "bestDateFit"]),
        savedRadiusKm: intBetween(4, 18),
        deliveryPreferred: index % 3 === 0,
      } as Prisma.InputJsonValue,
    });
  });

  const lenderUsers: Prisma.UserCreateManyInput[] = [];
  const lenderProfiles: Prisma.LenderProfileCreateManyInput[] = [];
  const deliveryWindows: Prisma.DeliveryWindowCreateManyInput[] = [];
  const lenders: GeneratedLender[] = [];

  blueprints.forEach((blueprint, index) => {
    const lenderId = makeId(20, index + 1);
    const neighborhood = neighborhoods.find((candidate) => candidate.key === blueprint.neighborhoodKey)!;
    const metrics = createLenderMetrics(blueprint.archetype, blueprint.featured ?? false);
    lenders.push({
      id: lenderId,
      displayName: blueprint.displayName,
      displayNameHe: blueprint.displayNameHe,
      ownerName: blueprint.ownerName,
      archetype: blueprint.archetype,
      neighborhood,
      listingTarget: blueprint.listingTarget,
      primaryCategories: blueprint.primaryCategories,
      secondaryCategories: blueprint.secondaryCategories,
      reliabilityScore: metrics.reliabilityScore,
      averageRating: metrics.averageRating,
      cancellationRate: metrics.cancellationRate,
      lateReturnRate: metrics.lateReturnRate,
      complaintRate: metrics.complaintRate,
      responseTimeScore: metrics.responseTimeScore,
      verificationLevel: metrics.verificationLevel,
      completedTransactionsCount: metrics.completedTransactionsCount,
      isFeatured: blueprint.featured ?? false,
    });

    lenderUsers.push({
      id: lenderId,
      fullName: blueprint.ownerName,
      email: `lender${index + 1}@rentmatch.local`,
      phone: makePhone(502000000, index + 1),
      passwordHash,
      role: UserRole.LENDER,
      status: UserStatus.ACTIVE,
      locale: "he",
    });

    lenderProfiles.push({
      userId: lenderId,
      displayName: blueprint.displayName,
      bio: createLenderBio(blueprint.displayNameHe, blueprint.archetype, neighborhood.nameHe),
      averageRating: metrics.averageRating,
      completedTransactionsCount: metrics.completedTransactionsCount,
      cancellationRate: metrics.cancellationRate,
      lateReturnRate: metrics.lateReturnRate,
      complaintRate: metrics.complaintRate,
      verificationLevel: metrics.verificationLevel,
      responseTimeScore: metrics.responseTimeScore,
      isFeatured: blueprint.featured ?? false,
      pickupAreaGeo: {
        neighborhood: neighborhood.nameHe,
        neighborhoodEn: neighborhood.nameEn,
        center: { lat: neighborhood.lat, lng: neighborhood.lng },
        serviceRadiusKm: blueprint.archetype === "cheap" ? 18 : blueprint.archetype === "local" ? 8 : 12,
      } as Prisma.InputJsonValue,
      reliabilityScoreCached: metrics.reliabilityScore,
    });

    const supportsDelivery = blueprint.archetype !== "cheap" || index % 2 === 0;
    if (supportsDelivery) {
      const baseId = 1000 + index * 10;
      deliveryWindows.push(
        {
          id: makeId(40, baseId + 1),
          lenderId,
          title: "Morning delivery",
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "12:00",
          zoneName: neighborhood.nameEn,
          feeBase: blueprint.archetype === "premium" ? 85 : 55,
          isActive: true,
        },
        {
          id: makeId(40, baseId + 2),
          lenderId,
          title: "Midweek pickup run",
          dayOfWeek: 3,
          startTime: "13:00",
          endTime: "17:00",
          zoneName: neighborhood.nameEn,
          feeBase: blueprint.archetype === "premium" ? 90 : 60,
          isActive: true,
        },
        {
          id: makeId(40, baseId + 3),
          lenderId,
          title: "Friday express",
          dayOfWeek: 5,
          startTime: "08:00",
          endTime: "11:00",
          zoneName: neighborhood.nameEn,
          feeBase: blueprint.archetype === "premium" ? 110 : 72,
          isActive: blueprint.archetype !== "cheap",
        },
      );
    }
  });

  const allUsers = [adminUser, ...renterUsers, ...lenderUsers];
  const listingRows: Prisma.ListingCreateManyInput[] = [];
  const listingMetas: GeneratedListingMeta[] = [];
  const mediaRows: Prisma.ListingMediaCreateManyInput[] = [];
  const attributeRows: Prisma.ListingAttributeValueCreateManyInput[] = [];
  const pricingRows: Prisma.PricingRuleCreateManyInput[] = [];
  const availabilityRows: Prisma.ListingAvailabilityBlockCreateManyInput[] = [];

  lenders.forEach((lender, lenderIndex) => {
    const ensuredCategories = [...lender.primaryCategories, ...lender.secondaryCategories];

    ensuredCategories.forEach((categoryKey, categoryIndex) => {
      createListingRecord({
        lender,
        categoryKey,
        ordinal: categoryIndex,
        listingRows,
        listingMetas,
        mediaRows,
        attributeRows,
        pricingRows,
        availabilityRows,
      });
    });

    for (let ordinal = ensuredCategories.length; ordinal < lender.listingTarget; ordinal += 1) {
      const categoryKey = pickWeightedCategory(lender);
      createListingRecord({
        lender,
        categoryKey,
        ordinal,
        listingRows,
        listingMetas,
        mediaRows,
        attributeRows,
        pricingRows,
        availabilityRows,
      });
    }

    if (lenderIndex % 3 === 0) {
      const guaranteedBundleSet: CategoryKey[] = lender.archetype === "local"
        ? ["cameras", "tripods", "lighting", "microphones"]
        : lender.archetype === "cheap"
          ? ["chairs", "tables", "projectors", "speakers"]
          : ["projectors", "speakers", "microphones", "mixers"];

      guaranteedBundleSet.forEach((categoryKey, extraIndex) => {
        createListingRecord({
          lender,
          categoryKey,
          ordinal: lender.listingTarget + extraIndex + 20,
          listingRows,
          listingMetas,
          mediaRows,
          attributeRows,
          pricingRows,
          availabilityRows,
        });
      });
    }
  });

  const searchScenarioTemplates = createSearchScenarioTemplates();
  const bundleSearchRows: Prisma.BundleSearchRequestCreateManyInput[] = [];
  const bundleCandidateRows: Prisma.BundleCandidateCreateManyInput[] = [];
  const bundleCandidateItemRows: Prisma.BundleCandidateItemCreateManyInput[] = [];
  const savedSearchRows: Prisma.SavedSearchCreateManyInput[] = [];

  const activeListings = listingMetas.filter((listing) => listing.listingStatus === ListingStatus.ACTIVE);
  const listingsByCategory = groupBy(activeListings, (listing) => listing.categoryKey);

  searchScenarioTemplates.forEach((scenario, scenarioIndex) => {
    const renterId = renterIds[scenarioIndex % renterIds.length];
    const searchId = makeId(90, scenarioIndex + 1);
    const startDate = offsetDate(bundleNow, scenario.dateOffsetDays, 9);
    const endDate = offsetDate(startDate, scenario.durationDays, 18);
    const requestedItems = scenario.slots.map((slot) => ({
      slotKey: slot.slotKey,
      categoryId: childCategoryIds.get(slot.categoryKey)!,
      quantity: slot.quantity,
      optional: slot.optional,
      constraints: slot.constraints ?? {},
    }));
    const weights = presetWeights(scenario.preset);

    const drafts = scenario.strategies.map((strategy, strategyIndex) =>
      buildCandidateDraft({
        scenario,
        strategy,
        searchRequestId: searchId,
        candidateIndex: strategyIndex + 1,
        listingsByCategory,
        lenders,
        renterLocation: scenario.renterLocation,
      }),
    );

    const rankedRows = rankCandidateDrafts(drafts, weights);

    bundleSearchRows.push({
      id: searchId,
      renterId,
      searchSessionId: `session-${scenario.key}`,
      dateRangeStart: startDate,
      dateRangeEnd: endDate,
      requestedItems: requestedItems as Prisma.InputJsonValue,
      renterLocationLat: scenario.renterLocation.lat,
      renterLocationLng: scenario.renterLocation.lng,
      renterAddressText: `${scenario.renterLocation.nameHe}, ${randomStreetName()} ${20 + scenarioIndex}`,
      weightPreferences: {
        preset: scenario.preset,
        weights,
      } as Prisma.InputJsonValue,
      resultsSnapshot: {
        topLabels: rankedRows.slice(0, 3).map((row) => row.label),
        candidateCount: rankedRows.length,
        scenario: scenario.nameEn,
      } as Prisma.InputJsonValue,
      debugSnapshot: {
        scenarioKey: scenario.key,
        strategies: scenario.strategies,
        expectedInterestingTradeoff: scenario.strategies.includes("balanced")
          ? "balanced-vs-cheapest"
          : "specialized-ranking",
      } as Prisma.InputJsonValue,
      maxBudget: scenario.maxBudget,
      maxPickupPoints: scenario.maxPickupPoints,
      sameLenderPreferred: scenario.sameLenderPreferred,
      deliveryPreferred: scenario.deliveryPreferred,
      exactDatesOnly: scenario.exactDatesOnly,
      status: BundleSearchStatus.READY,
    });

    rankedRows.forEach((row) => {
      bundleCandidateRows.push(row.bundleRow);
      bundleCandidateItemRows.push(...row.itemRows);
    });

    savedSearchRows.push({
      id: makeId(91, scenarioIndex + 1),
      renterId,
      name: scenario.nameHe,
      searchPayload: {
        preset: scenario.preset,
        requestedItems,
        deliveryPreferred: scenario.deliveryPreferred,
        sameLenderPreferred: scenario.sameLenderPreferred,
      } as Prisma.InputJsonValue,
    });
  });

  const favoriteRows = createFavoriteRows(renterIds, activeListings);
  const bookingContext = createBookings({
    renterIds,
    activeListings,
    listingsByCategory,
    lenders,
    bundleCandidateRows,
  });

  availabilityRows.push(...bookingContext.bookingAvailabilityBlocks);

  const notificationRows = createNotifications(adminId, renterIds);
  const reviewRows = createReviews(bookingContext.completedBookingsForReview, lenders);
  const disputeRows = createDisputes(bookingContext.disputeEligibleBookings, adminId);
  const paymentRows = createPaymentPlaceholders(bookingContext.paymentBookings);
  const featureFlags = createFeatureFlags();
  const rankingConfigs = createRankingConfigs(adminId);
  const auditRows = createAuditLogs(adminId, lenders);

  await prisma.category.createMany({ data: parentCategoryRows });
  await prisma.category.createMany({ data: childCategoryRows });
  await prisma.user.createMany({ data: allUsers });
  await prisma.renterProfile.createMany({ data: renterProfiles });
  await prisma.lenderProfile.createMany({ data: lenderProfiles });
  await createInChunks(deliveryWindows, 200, (chunk) => prisma.deliveryWindow.createMany({ data: chunk }));
  await createInChunks(listingRows, 300, (chunk) => prisma.listing.createMany({ data: chunk }));
  await createInChunks(mediaRows, 500, (chunk) => prisma.listingMedia.createMany({ data: chunk }));
  await createInChunks(attributeRows, 500, (chunk) => prisma.listingAttributeValue.createMany({ data: chunk }));
  await createInChunks(pricingRows, 500, (chunk) => prisma.pricingRule.createMany({ data: chunk }));
  await createInChunks(availabilityRows, 500, (chunk) => prisma.listingAvailabilityBlock.createMany({ data: chunk }));
  await prisma.featureFlag.createMany({ data: featureFlags });
  await prisma.rankingConfig.createMany({ data: rankingConfigs });
  await createInChunks(bundleSearchRows, 100, (chunk) => prisma.bundleSearchRequest.createMany({ data: chunk }));
  await createInChunks(bundleCandidateRows, 200, (chunk) => prisma.bundleCandidate.createMany({ data: chunk }));
  await createInChunks(bundleCandidateItemRows, 500, (chunk) => prisma.bundleCandidateItem.createMany({ data: chunk }));
  await createInChunks(savedSearchRows, 100, (chunk) => prisma.savedSearch.createMany({ data: chunk }));
  await createInChunks(favoriteRows, 200, (chunk) => prisma.favorite.createMany({ data: chunk }));
  await createInChunks(bookingContext.bookingRows, 200, (chunk) => prisma.booking.createMany({ data: chunk }));
  await createInChunks(bookingContext.bookingItemRows, 500, (chunk) => prisma.bookingItem.createMany({ data: chunk }));
  await createInChunks(reviewRows, 200, (chunk) => prisma.review.createMany({ data: chunk }));
  await createInChunks(disputeRows, 100, (chunk) => prisma.dispute.createMany({ data: chunk }));
  await createInChunks(notificationRows, 200, (chunk) => prisma.notification.createMany({ data: chunk }));
  await createInChunks(paymentRows, 200, (chunk) => prisma.paymentIntentPlaceholder.createMany({ data: chunk }));
  await createInChunks(auditRows, 200, (chunk) => prisma.auditLog.createMany({ data: chunk }));

  console.log("Seed summary");
  console.log(`Users: ${allUsers.length}`);
  console.log(`Lenders: ${lenders.length}`);
  console.log(`Listings: ${listingRows.length}`);
  console.log(`Bookings: ${bookingContext.bookingRows.length}`);
  console.log(`Bundle candidates: ${bundleCandidateRows.length}`);
}

function createSearchScenarioTemplates(): SearchScenarioTemplate[] {
  return [
    {
      key: "photo-balanced",
      nameHe: "חבילת צילום מאוזנת לאירוע",
      nameEn: "Balanced photo bundle for an event",
      renterLocation: neighborhoods[3],
      preset: "balanced",
      maxBudget: 1850,
      maxPickupPoints: 3,
      sameLenderPreferred: false,
      deliveryPreferred: true,
      exactDatesOnly: true,
      dateOffsetDays: 6,
      durationDays: 2,
      slots: [
        { slotKey: "camera", categoryKey: "cameras", quantity: 1, optional: false },
        { slotKey: "tripod", categoryKey: "tripods", quantity: 1, optional: false },
        { slotKey: "lighting", categoryKey: "lighting", quantity: 1, optional: false },
      ],
      strategies: ["balanced", "cheapest", "sameLender", "premium", "weakLink"],
    },
    {
      key: "interview-kit",
      nameHe: "ערכת ראיון קומפקטית",
      nameEn: "Compact interview kit",
      renterLocation: neighborhoods[1],
      preset: "easiestPickup",
      maxBudget: 2150,
      maxPickupPoints: 2,
      sameLenderPreferred: true,
      deliveryPreferred: true,
      exactDatesOnly: true,
      dateOffsetDays: 9,
      durationDays: 3,
      slots: [
        { slotKey: "camera", categoryKey: "cameras", quantity: 1, optional: false },
        { slotKey: "mic", categoryKey: "microphones", quantity: 2, optional: false },
        { slotKey: "light", categoryKey: "lighting", quantity: 1, optional: false },
        { slotKey: "tripod", categoryKey: "tripods", quantity: 1, optional: false },
      ],
      strategies: ["sameLender", "balanced", "premium", "cheapest", "fragile"],
    },
    {
      key: "seminar-av",
      nameHe: "חבילת סמינר הקרנה והגברה",
      nameEn: "Seminar AV bundle",
      renterLocation: neighborhoods[2],
      preset: "mostReliable",
      maxBudget: 2400,
      maxPickupPoints: 3,
      sameLenderPreferred: false,
      deliveryPreferred: true,
      exactDatesOnly: true,
      dateOffsetDays: 13,
      durationDays: 2,
      slots: [
        { slotKey: "projector", categoryKey: "projectors", quantity: 1, optional: false },
        { slotKey: "speakers", categoryKey: "speakers", quantity: 1, optional: false },
        { slotKey: "mics", categoryKey: "microphones", quantity: 2, optional: false },
      ],
      strategies: ["premium", "balanced", "sameLender", "cheapest", "weakLink"],
    },
    {
      key: "popup-classroom",
      nameHe: "כיתה זמנית לפופ-אפ",
      nameEn: "Pop-up classroom setup",
      renterLocation: neighborhoods[4],
      preset: "cheapest",
      maxBudget: 2600,
      maxPickupPoints: 4,
      sameLenderPreferred: false,
      deliveryPreferred: false,
      exactDatesOnly: true,
      dateOffsetDays: 15,
      durationDays: 4,
      slots: [
        { slotKey: "chairs", categoryKey: "chairs", quantity: 20, optional: false },
        { slotKey: "tables", categoryKey: "tables", quantity: 4, optional: false },
        { slotKey: "projector", categoryKey: "projectors", quantity: 1, optional: false },
      ],
      strategies: ["cheapest", "balanced", "sameLender", "premium", "fragile"],
    },
    {
      key: "launch-stage",
      nameHe: "במה והשקה עירונית",
      nameEn: "Urban launch stage setup",
      renterLocation: neighborhoods[0],
      preset: "balanced",
      maxBudget: 4300,
      maxPickupPoints: 3,
      sameLenderPreferred: true,
      deliveryPreferred: true,
      exactDatesOnly: false,
      dateOffsetDays: 18,
      durationDays: 2,
      slots: [
        { slotKey: "stage", categoryKey: "stages", quantity: 1, optional: false },
        { slotKey: "speakers", categoryKey: "speakers", quantity: 1, optional: false },
        { slotKey: "projector", categoryKey: "projectors", quantity: 1, optional: true },
        { slotKey: "mixer", categoryKey: "mixers", quantity: 1, optional: false },
      ],
      strategies: ["balanced", "sameLender", "premium", "cheapest", "weakLink"],
    },
    {
      key: "outdoor-evening",
      nameHe: "אירוע חוץ בערב",
      nameEn: "Outdoor evening event",
      renterLocation: neighborhoods[5],
      preset: "bestDateFit",
      maxBudget: 5200,
      maxPickupPoints: 3,
      sameLenderPreferred: true,
      deliveryPreferred: true,
      exactDatesOnly: true,
      dateOffsetDays: 21,
      durationDays: 3,
      slots: [
        { slotKey: "tent", categoryKey: "tents", quantity: 2, optional: false },
        { slotKey: "heaters", categoryKey: "heaters", quantity: 4, optional: false },
        { slotKey: "generator", categoryKey: "generators", quantity: 1, optional: false },
        { slotKey: "speakers", categoryKey: "speakers", quantity: 1, optional: true },
      ],
      strategies: ["sameLender", "balanced", "premium", "cheapest", "fragile"],
    },
    {
      key: "podcast-day",
      nameHe: "יום צילום פודקאסט",
      nameEn: "Podcast production day",
      renterLocation: neighborhoods[1],
      preset: "mostReliable",
      maxBudget: 2800,
      maxPickupPoints: 2,
      sameLenderPreferred: false,
      deliveryPreferred: true,
      exactDatesOnly: true,
      dateOffsetDays: 24,
      durationDays: 2,
      slots: [
        { slotKey: "camera", categoryKey: "cameras", quantity: 1, optional: false },
        { slotKey: "light", categoryKey: "lighting", quantity: 2, optional: false },
        { slotKey: "mics", categoryKey: "microphones", quantity: 2, optional: false },
        { slotKey: "mixer", categoryKey: "mixers", quantity: 1, optional: false },
      ],
      strategies: ["premium", "balanced", "sameLender", "cheapest", "weakLink"],
    },
    {
      key: "community-screening",
      nameHe: "הקרנה קהילתית",
      nameEn: "Community screening bundle",
      renterLocation: neighborhoods[2],
      preset: "easiestPickup",
      maxBudget: 3100,
      maxPickupPoints: 2,
      sameLenderPreferred: true,
      deliveryPreferred: false,
      exactDatesOnly: true,
      dateOffsetDays: 28,
      durationDays: 1,
      slots: [
        { slotKey: "projector", categoryKey: "projectors", quantity: 1, optional: false },
        { slotKey: "speakers", categoryKey: "speakers", quantity: 1, optional: false },
        { slotKey: "chairs", categoryKey: "chairs", quantity: 30, optional: false },
        { slotKey: "tables", categoryKey: "tables", quantity: 2, optional: true },
      ],
      strategies: ["sameLender", "balanced", "cheapest", "premium", "fragile"],
    },
    {
      key: "gallery-video",
      nameHe: "מיצב וידאו לגלריה",
      nameEn: "Gallery video installation",
      renterLocation: neighborhoods[0],
      preset: "balanced",
      maxBudget: 3400,
      maxPickupPoints: 3,
      sameLenderPreferred: false,
      deliveryPreferred: true,
      exactDatesOnly: true,
      dateOffsetDays: 31,
      durationDays: 5,
      slots: [
        { slotKey: "projector", categoryKey: "projectors", quantity: 2, optional: false },
        { slotKey: "speakers", categoryKey: "speakers", quantity: 1, optional: false },
        { slotKey: "lighting", categoryKey: "lighting", quantity: 1, optional: true },
      ],
      strategies: ["balanced", "premium", "sameLender", "cheapest", "weakLink"],
    },
    {
      key: "brand-roadshow",
      nameHe: "רוד שואו למותג",
      nameEn: "Brand roadshow setup",
      renterLocation: neighborhoods[3],
      preset: "bestDateFit",
      maxBudget: 4600,
      maxPickupPoints: 3,
      sameLenderPreferred: true,
      deliveryPreferred: true,
      exactDatesOnly: false,
      dateOffsetDays: 34,
      durationDays: 3,
      slots: [
        { slotKey: "stage", categoryKey: "stages", quantity: 1, optional: false },
        { slotKey: "tent", categoryKey: "tents", quantity: 1, optional: false },
        { slotKey: "speakers", categoryKey: "speakers", quantity: 1, optional: false },
        { slotKey: "heaters", categoryKey: "heaters", quantity: 2, optional: true },
      ],
      strategies: ["sameLender", "balanced", "premium", "cheapest", "fragile"],
    },
  ];
}

function createLenderMetrics(archetype: Archetype, featured: boolean) {
  if (archetype === "cheap") {
    const averageRating = round2(randomBetween(2.6, 3.8));
    const cancellationRate = round2(randomBetween(11.5, 24.5));
    const lateReturnRate = round2(randomBetween(6.5, 16.5));
    const complaintRate = round2(randomBetween(3.5, 10.5));
    const responseTimeScore = round2(randomBetween(4.5, 7.2));
    return {
      averageRating,
      cancellationRate,
      lateReturnRate,
      complaintRate,
      responseTimeScore,
      verificationLevel: bool(0.22) ? VerificationLevel.VERIFIED : VerificationLevel.BASIC,
      completedTransactionsCount: intBetween(18, 75),
      reliabilityScore: reliabilityFormula(averageRating, cancellationRate, lateReturnRate, complaintRate, responseTimeScore, VerificationLevel.BASIC, 28),
    };
  }

  if (archetype === "premium") {
    const averageRating = round2(randomBetween(4.62, 4.98));
    const cancellationRate = round2(randomBetween(0.8, 3.6));
    const lateReturnRate = round2(randomBetween(0.4, 2.8));
    const complaintRate = round2(randomBetween(0.2, 1.3));
    const responseTimeScore = round2(randomBetween(8.7, 9.8));
    const verificationLevel = featured || bool(0.7) ? VerificationLevel.TRUSTED : VerificationLevel.VERIFIED;
    const completedTransactionsCount = intBetween(95, 240);
    return {
      averageRating,
      cancellationRate,
      lateReturnRate,
      complaintRate,
      responseTimeScore,
      verificationLevel,
      completedTransactionsCount,
      reliabilityScore: reliabilityFormula(
        averageRating,
        cancellationRate,
        lateReturnRate,
        complaintRate,
        responseTimeScore,
        verificationLevel,
        completedTransactionsCount,
      ),
    };
  }

  if (archetype === "local") {
    const averageRating = round2(randomBetween(4.18, 4.82));
    const cancellationRate = round2(randomBetween(2.1, 7.1));
    const lateReturnRate = round2(randomBetween(1.2, 5.8));
    const complaintRate = round2(randomBetween(0.5, 2.9));
    const responseTimeScore = round2(randomBetween(7.4, 9.4));
    const verificationLevel = bool(0.35) ? VerificationLevel.TRUSTED : VerificationLevel.VERIFIED;
    const completedTransactionsCount = intBetween(50, 165);
    return {
      averageRating,
      cancellationRate,
      lateReturnRate,
      complaintRate,
      responseTimeScore,
      verificationLevel,
      completedTransactionsCount,
      reliabilityScore: reliabilityFormula(
        averageRating,
        cancellationRate,
        lateReturnRate,
        complaintRate,
        responseTimeScore,
        verificationLevel,
        completedTransactionsCount,
      ),
    };
  }

  const averageRating = round2(randomBetween(3.35, 4.55));
  const cancellationRate = round2(randomBetween(4.8, 13.8));
  const lateReturnRate = round2(randomBetween(2.8, 11.8));
  const complaintRate = round2(randomBetween(1.4, 6.0));
  const responseTimeScore = round2(randomBetween(5.4, 8.5));
  const verificationLevel = bool(0.55) ? VerificationLevel.VERIFIED : VerificationLevel.BASIC;
  const completedTransactionsCount = intBetween(28, 118);
  return {
    averageRating,
    cancellationRate,
    lateReturnRate,
    complaintRate,
    responseTimeScore,
    verificationLevel,
    completedTransactionsCount,
    reliabilityScore: reliabilityFormula(
      averageRating,
      cancellationRate,
      lateReturnRate,
      complaintRate,
      responseTimeScore,
      verificationLevel,
      completedTransactionsCount,
    ),
  };
}

function reliabilityFormula(
  averageRating: number,
  cancellationRate: number,
  lateReturnRate: number,
  complaintRate: number,
  responseTimeScore: number,
  verificationLevel: VerificationLevel,
  completedTransactionsCount: number,
) {
  const sampleBoost = Math.min(1.1, Math.log10(completedTransactionsCount + 10) / 2.2);
  const verificationBoost =
    verificationLevel === VerificationLevel.TRUSTED
      ? 0.9
      : verificationLevel === VerificationLevel.VERIFIED
        ? 0.45
        : 0.0;
  const raw =
    averageRating * 1.55 +
    responseTimeScore * 0.42 +
    verificationBoost +
    sampleBoost -
    cancellationRate * 0.08 -
    lateReturnRate * 0.05 -
    complaintRate * 0.11;
  return round2(clamp(raw, 2.5, 9.9));
}

function createListingRecord(args: {
  lender: GeneratedLender;
  categoryKey: CategoryKey;
  ordinal: number;
  listingRows: Prisma.ListingCreateManyInput[];
  listingMetas: GeneratedListingMeta[];
  mediaRows: Prisma.ListingMediaCreateManyInput[];
  attributeRows: Prisma.ListingAttributeValueCreateManyInput[];
  pricingRows: Prisma.PricingRuleCreateManyInput[];
  availabilityRows: Prisma.ListingAvailabilityBlockCreateManyInput[];
}) {
  const { lender, categoryKey, ordinal, listingRows, listingMetas, mediaRows, attributeRows, pricingRows, availabilityRows } = args;
  const category = categoryTemplates.find((candidate) => candidate.key === categoryKey)!;
  const listingIndex = listingRows.length + 1;
  const id = makeId(50, listingIndex);
  const qualityTier = chooseQualityTier(lender.archetype);
  const priceBand = choosePriceBand(lender.archetype, categoryKey);
  const basePrice = round2(randomBetween(category.priceBands[priceBand][0], category.priceBands[priceBand][1]));
  const inventoryCount = determineInventory(category, lender.archetype);
  const availabilityProfile = chooseAvailabilityProfile(lender.archetype);
  const listingStatus = chooseListingStatus(lender.archetype, qualityTier);
  const condition = chooseCondition(lender.archetype, qualityTier);
  const deliverySupported = lender.archetype !== "cheap" || bool(0.35);
  const imageCount = qualityTier === "high" ? intBetween(4, 5) : qualityTier === "mid" ? intBetween(3, 4) : 2;
  const coords = createCoordinates(lender.neighborhood, lender.archetype === "local" ? 0.32 : lender.archetype === "premium" ? 0.42 : 0.82);
  const namingIndex = (ordinal + listingIndex) % category.titleHe.length;
  const brand = category.brands[(listingIndex + ordinal) % category.brands.length];
  const model = category.models[(listingIndex + ordinal * 2) % category.models.length];
  const titleHe = `${category.titleHe[namingIndex]} ${brand} ${model}`;
  const titleEn = `${brand} ${model} ${category.titleEn[namingIndex]}`;
  const descriptionHe = buildHebrewDescription(category, lender, qualityTier);
  const descriptionEn = buildEnglishDescription(category, lender, qualityTier);
  const depositAmount = round2(basePrice * randomBetween(category.depositMultiplier[0], category.depositMultiplier[1]));
  const qualityScore = calculateQualityScore({
    archetype: lender.archetype,
    qualityTier,
    imageCount,
    descriptionLength: descriptionHe.length,
    condition,
  });
  const pickupAddressText = `${randomStreetName()} ${intBetween(3, 98)}, ${lender.neighborhood.nameHe}`;

  listingRows.push({
    id,
    lenderId: lender.id,
    categoryId: childCategoryIdsFromRuntime(categoryKey),
    titleHe,
    titleEn,
    descriptionHe,
    descriptionEn,
    condition,
    status: listingStatus,
    basePriceDaily: basePrice,
    depositAmount,
    qualityScoreCached: qualityScore,
    pickupLat: coords.lat,
    pickupLng: coords.lng,
    pickupAddressText,
    deliverySupported,
    inventoryCount,
    minRentalDays: lender.archetype === "premium" ? 2 : 1,
    maxRentalDays: lender.archetype === "cheap" ? 12 : 21,
  });

  listingMetas.push({
    id,
    lenderId: lender.id,
    categoryKey,
    lenderArchetype: lender.archetype,
    neighborhoodKey: lender.neighborhood.key,
    listingStatus,
    qualityTier,
    availabilityProfile,
    basePriceDaily: basePrice,
    depositAmount,
    qualityScore,
    deliverySupported,
    inventoryCount,
    pickupLat: coords.lat,
    pickupLng: coords.lng,
    pickupAddressText,
    imageCount,
    titleHe,
    titleEn,
  });

  for (let mediaIndex = 0; mediaIndex < imageCount; mediaIndex += 1) {
    mediaRows.push({
      id: makeId(60, mediaRows.length + 1),
      listingId: id,
      url: `${imageBaseUrl}/${id}/${mediaIndex + 1}.jpg`,
      sortOrder: mediaIndex,
      altText: mediaIndex === 0 ? titleHe : `${titleHe} - זווית ${mediaIndex + 1}`,
    });
  }

  category.attributes.forEach((attribute) => {
    attributeRows.push({
      id: makeId(61, attributeRows.length + 1),
      listingId: id,
      attributeKey: attribute.key,
      attributeValue: pick(attribute.values) as Prisma.InputJsonValue,
    });
  });

  pricingRows.push(
    {
      id: makeId(62, pricingRows.length + 1),
      listingId: id,
      ruleType: PricingRuleType.DURATION_DISCOUNT,
      minDays: lender.archetype === "cheap" ? 4 : 3,
      maxDays: 14,
      percentDiscount: lender.archetype === "premium" ? round2(randomBetween(7, 11)) : round2(randomBetween(5, 9)),
    },
    {
      id: makeId(62, pricingRows.length + 2),
      listingId: id,
      ruleType: PricingRuleType.WEEKEND_ADJUSTMENT,
      weekendAdjustment: round2(lender.archetype === "cheap" ? randomBetween(4, 10) : randomBetween(8, 16)),
      metadata: {
        appliesOn: ["FRIDAY", "SATURDAY"],
      } as Prisma.InputJsonValue,
    },
  );

  if (qualityTier !== "low" || bool(0.5)) {
    pricingRows.push({
      id: makeId(62, pricingRows.length + 1),
      listingId: id,
      ruleType: PricingRuleType.SEASONAL_ADJUSTMENT,
      seasonalAdjustment: round2(lender.archetype === "premium" ? randomBetween(9, 14) : randomBetween(4, 11)),
      startsAt: new Date(`${seedYear}-06-15T00:00:00.000Z`),
      endsAt: new Date(`${seedYear}-09-10T23:59:59.000Z`),
      metadata: {
        season: "summer-high-demand",
      } as Prisma.InputJsonValue,
    });
  }

  availabilityRows.push(...generateAvailabilityBlocks(id, availabilityProfile, inventoryCount, lender.archetype));
}

function childCategoryIdsFromRuntime(categoryKey: CategoryKey) {
  return runtimeCategoryIds.get(categoryKey)!;
}

const runtimeCategoryIds = new Map<CategoryKey, string>();

function chooseQualityTier(archetype: Archetype): QualityTier {
  if (archetype === "premium") {
    return weightedPick([
      { value: "high" as const, weight: 0.68 },
      { value: "mid" as const, weight: 0.28 },
      { value: "low" as const, weight: 0.04 },
    ]);
  }

  if (archetype === "local") {
    return weightedPick([
      { value: "high" as const, weight: 0.34 },
      { value: "mid" as const, weight: 0.52 },
      { value: "low" as const, weight: 0.14 },
    ]);
  }

  if (archetype === "cheap") {
    return weightedPick([
      { value: "high" as const, weight: 0.08 },
      { value: "mid" as const, weight: 0.42 },
      { value: "low" as const, weight: 0.5 },
    ]);
  }

  return weightedPick([
    { value: "high" as const, weight: 0.2 },
    { value: "mid" as const, weight: 0.44 },
    { value: "low" as const, weight: 0.36 },
  ]);
}

function choosePriceBand(archetype: Archetype, categoryKey: CategoryKey): PriceBand {
  if (archetype === "premium") {
    return weightedPick([
      { value: "premium" as const, weight: 0.72 },
      { value: "mid" as const, weight: 0.28 },
    ]);
  }

  if (archetype === "cheap") {
    return weightedPick([
      { value: "cheap" as const, weight: 0.78 },
      { value: "mid" as const, weight: 0.22 },
    ]);
  }

  if (archetype === "local") {
    if (categoryKey === "chairs" || categoryKey === "tables") {
      return weightedPick([
        { value: "mid" as const, weight: 0.75 },
        { value: "cheap" as const, weight: 0.15 },
        { value: "premium" as const, weight: 0.1 },
      ]);
    }
    return weightedPick([
      { value: "mid" as const, weight: 0.62 },
      { value: "premium" as const, weight: 0.22 },
      { value: "cheap" as const, weight: 0.16 },
    ]);
  }

  return weightedPick([
    { value: "mid" as const, weight: 0.42 },
    { value: "cheap" as const, weight: 0.34 },
    { value: "premium" as const, weight: 0.24 },
  ]);
}

function determineInventory(category: CategoryTemplate, archetype: Archetype) {
  const [min, max] = category.inventoryRange;
  if (archetype === "premium" && max <= 8) {
    return intBetween(Math.max(1, min), Math.max(min, Math.ceil(max * 0.7)));
  }
  if (archetype === "cheap" && max >= 10) {
    return intBetween(Math.max(min, 2), max);
  }
  return intBetween(min, max);
}

function chooseAvailabilityProfile(archetype: Archetype): AvailabilityProfile {
  if (archetype === "premium") {
    return weightedPick([
      { value: "open" as const, weight: 0.42 },
      { value: "partial" as const, weight: 0.4 },
      { value: "fragmented" as const, weight: 0.15 },
      { value: "scarce" as const, weight: 0.03 },
    ]);
  }
  if (archetype === "local") {
    return weightedPick([
      { value: "open" as const, weight: 0.3 },
      { value: "partial" as const, weight: 0.44 },
      { value: "fragmented" as const, weight: 0.2 },
      { value: "scarce" as const, weight: 0.06 },
    ]);
  }
  if (archetype === "cheap") {
    return weightedPick([
      { value: "open" as const, weight: 0.18 },
      { value: "partial" as const, weight: 0.34 },
      { value: "fragmented" as const, weight: 0.31 },
      { value: "scarce" as const, weight: 0.17 },
    ]);
  }
  return weightedPick([
    { value: "open" as const, weight: 0.15 },
    { value: "partial" as const, weight: 0.29 },
    { value: "fragmented" as const, weight: 0.36 },
    { value: "scarce" as const, weight: 0.2 },
  ]);
}

function chooseListingStatus(archetype: Archetype, qualityTier: QualityTier) {
  const blockedChance = archetype === "inconsistent" ? 0.12 : 0.05;
  const archivedChance = archetype === "cheap" && qualityTier === "low" ? 0.08 : 0.03;
  const pendingChance = qualityTier === "high" ? 0.03 : 0.07;

  if (bool(archivedChance)) {
    return ListingStatus.ARCHIVED;
  }
  if (bool(blockedChance)) {
    return ListingStatus.BLOCKED;
  }
  if (bool(pendingChance)) {
    return ListingStatus.PENDING_REVIEW;
  }
  return ListingStatus.ACTIVE;
}

function chooseCondition(archetype: Archetype, qualityTier: QualityTier) {
  if (qualityTier === "high") {
    return weightedPick([
      { value: ListingCondition.NEW, weight: archetype === "premium" ? 0.52 : 0.18 },
      { value: ListingCondition.LIKE_NEW, weight: 0.48 },
    ]);
  }
  if (qualityTier === "mid") {
    return weightedPick([
      { value: ListingCondition.LIKE_NEW, weight: 0.36 },
      { value: ListingCondition.GOOD, weight: 0.54 },
      { value: ListingCondition.FAIR, weight: 0.1 },
    ]);
  }
  return weightedPick([
    { value: ListingCondition.GOOD, weight: 0.34 },
    { value: ListingCondition.FAIR, weight: 0.48 },
    { value: ListingCondition.HEAVY_USE, weight: 0.18 },
  ]);
}

function calculateQualityScore(args: {
  archetype: Archetype;
  qualityTier: QualityTier;
  imageCount: number;
  descriptionLength: number;
  condition: ListingCondition;
}) {
  const base =
    args.archetype === "premium"
      ? 7.7
      : args.archetype === "local"
        ? 6.9
        : args.archetype === "cheap"
          ? 5.2
          : 6.1;
  const qualityTierBoost = args.qualityTier === "high" ? 1.3 : args.qualityTier === "mid" ? 0.45 : -0.35;
  const imageBoost = args.imageCount * 0.22;
  const descriptionBoost = args.descriptionLength > 120 ? 0.55 : args.descriptionLength > 85 ? 0.25 : 0.0;
  const conditionBoost =
    args.condition === ListingCondition.NEW
      ? 0.8
      : args.condition === ListingCondition.LIKE_NEW
        ? 0.45
        : args.condition === ListingCondition.GOOD
          ? 0.1
          : args.condition === ListingCondition.FAIR
            ? -0.45
            : -0.9;
  return round2(clamp(base + qualityTierBoost + imageBoost + descriptionBoost + conditionBoost, 3.9, 9.8));
}

function buildHebrewDescription(category: CategoryTemplate, lender: GeneratedLender, qualityTier: QualityTier) {
  const sentenceA = `${pick(category.detailsHe)}.`;
  const sentenceB =
    lender.archetype === "premium"
      ? "הציוד עובר בדיקה לפני כל יציאה ומסופק במצב מוקפד."
      : lender.archetype === "local"
        ? "נקודת האיסוף קרובה וניתן לשלב בקלות עם פריטים נוספים מאותו מלווה."
        : lender.archetype === "cheap"
          ? "המחיר אטרקטיבי, אך זמינות האיסוף מוגבלת יותר והציוד ותיק יחסית."
          : "הציוד משתנה בין הזמנות ולכן מומלץ לבדוק זמינות ומצב עדכני לפני אישור.";
  const sentenceC =
    qualityTier === "high"
      ? "כולל אביזרים נלווים, הדרכה קצרה באיסוף ותמונות עדכניות."
      : qualityTier === "mid"
        ? "מגיע מוכן לעבודה עם האביזרים הבסיסיים הדרושים."
        : "כולל את הפריט העיקרי בלבד ומתאים למי שמחפש פתרון תקציבי.";
  return `${sentenceA} ${sentenceB} ${sentenceC}`;
}

function buildEnglishDescription(category: CategoryTemplate, lender: GeneratedLender, qualityTier: QualityTier) {
  const sentenceA = `${pick(category.detailsEn)}.`;
  const sentenceB =
    lender.archetype === "premium"
      ? "This lender runs pre-rental checks and keeps the gear presentation level high."
      : lender.archetype === "local"
        ? "Pickup is compact and easy to combine with adjacent items from the same lender."
        : lender.archetype === "cheap"
          ? "Pricing is aggressive, but the pickup is farther out and the kit is usually older."
          : "Availability is less stable and item condition can vary from one booking to the next.";
  const sentenceC =
    qualityTier === "high"
      ? "Includes supporting accessories, a clear handoff process, and recent product photos."
      : qualityTier === "mid"
        ? "Ready for work with the core accessories needed for a normal rental."
        : "Focused on the main item and intended for renters optimizing budget first.";
  return `${sentenceA} ${sentenceB} ${sentenceC}`;
}

function generateAvailabilityBlocks(
  listingId: string,
  profile: AvailabilityProfile,
  inventoryCount: number,
  archetype: Archetype,
) {
  const rows: Prisma.ListingAvailabilityBlockCreateManyInput[] = [];
  const baseQuantity = Math.max(1, Math.min(2, inventoryCount));

  if (profile === "open") {
    if (bool(archetype === "premium" ? 0.18 : 0.1)) {
      rows.push({
        listingId,
        startDate: new Date(`${seedYear}-07-14T08:00:00.000Z`),
        endDate: new Date(`${seedYear}-07-15T18:00:00.000Z`),
        status: AvailabilityBlockStatus.MAINTENANCE,
        quantity: 1,
        reason: "Routine inspection",
      });
    }
    return rows;
  }

  if (profile === "partial") {
    const windowCount = intBetween(2, 4);
    for (let index = 0; index < windowCount; index += 1) {
      const start = offsetDate(new Date(`${seedYear}-05-01T08:00:00.000Z`), intBetween(4, 92), 8);
      rows.push({
        listingId,
        startDate: start,
        endDate: offsetDate(start, intBetween(2, 4), 18),
        status: bool(0.76) ? AvailabilityBlockStatus.BOOKED : AvailabilityBlockStatus.BLOCKED,
        quantity: baseQuantity,
        reason: "Existing rental overlap",
      });
    }
    return rows;
  }

  if (profile === "fragmented") {
    for (let week = 0; week < 8; week += 1) {
      const friday = offsetDate(new Date(`${seedYear}-05-08T09:00:00.000Z`), week * 7, 9);
      rows.push({
        listingId,
        startDate: friday,
        endDate: offsetDate(friday, 2, 18),
        status: AvailabilityBlockStatus.BOOKED,
        quantity: baseQuantity,
        reason: "Weekend booking block",
      });
    }
    rows.push({
      listingId,
      startDate: new Date(`${seedYear}-06-22T07:00:00.000Z`),
      endDate: new Date(`${seedYear}-06-24T19:00:00.000Z`),
      status: AvailabilityBlockStatus.MAINTENANCE,
      quantity: 1,
      reason: "Maintenance turnaround",
    });
    return rows;
  }

  const scarceStart = new Date(`${seedYear}-05-18T08:00:00.000Z`);
  rows.push(
    {
      listingId,
      startDate: scarceStart,
      endDate: new Date(`${seedYear}-06-20T18:00:00.000Z`),
      status: AvailabilityBlockStatus.BOOKED,
      quantity: Math.max(1, inventoryCount),
      reason: "Long production hold",
    },
    {
      listingId,
      startDate: new Date(`${seedYear}-06-27T08:00:00.000Z`),
      endDate: new Date(`${seedYear}-07-18T18:00:00.000Z`),
      status: AvailabilityBlockStatus.BLOCKED,
      quantity: Math.max(1, inventoryCount),
      reason: "Owner blockout",
    },
    {
      listingId,
      startDate: new Date(`${seedYear}-07-23T08:00:00.000Z`),
      endDate: new Date(`${seedYear}-07-25T18:00:00.000Z`),
      status: AvailabilityBlockStatus.MAINTENANCE,
      quantity: 1,
      reason: "Repair queue",
    },
  );
  return rows;
}

function pickWeightedCategory(lender: GeneratedLender) {
  const combined = [
    ...lender.primaryCategories.map((value) => ({ value, weight: 3 })),
    ...lender.secondaryCategories.map((value) => ({ value, weight: 1.5 })),
  ];
  return weightedPick(combined);
}

function buildCandidateDraft(args: {
  scenario: SearchScenarioTemplate;
  strategy: ScenarioCandidateType;
  searchRequestId: string;
  candidateIndex: number;
  listingsByCategory: Map<CategoryKey, GeneratedListingMeta[]>;
  lenders: GeneratedLender[];
  renterLocation: Neighborhood;
}): SearchCandidateDraft {
  const { scenario, strategy, searchRequestId, candidateIndex, listingsByCategory, lenders, renterLocation } = args;
  const usedListings = new Set<string>();
  const items: SearchCandidateDraft["items"] = [];

  let preferredLender: GeneratedLender | undefined;
  if (strategy === "sameLender") {
    preferredLender = findLenderForScenario(lenders, scenario, ["local", "premium"]);
  } else if (strategy === "premium") {
    preferredLender = findLenderForScenario(lenders, scenario, ["premium"]);
  } else if (strategy === "fragile") {
    preferredLender = findLenderForScenario(lenders, scenario, ["inconsistent", "cheap", "local"]);
  } else if (strategy === "weakLink") {
    preferredLender = findLenderForScenario(lenders, scenario, ["cheap", "inconsistent", "local"]);
  }

  scenario.slots.forEach((slot, slotIndex) => {
    const candidates = listingsByCategory.get(slot.categoryKey) ?? [];
    const selected = selectListingForStrategy({
      candidates,
      strategy,
      slotQuantity: slot.quantity,
      slotIndex,
      preferredLender,
      usedListings,
      renterLocation,
    });
    usedListings.add(selected.id);
    items.push({
      id: makeId(92, items.length + 1 + candidateIndex * 1000 + hashCode(searchRequestId)),
      requestedSlotKey: slot.slotKey,
      listing: selected,
      quantity: slot.quantity,
    });
  });

  const uniqueLenders = unique(items.map((item) => item.listing.lenderId));
  const pickupPointsCount = unique(
    items.map((item) => `${item.listing.lenderId}:${item.listing.pickupAddressText}`),
  ).length;
  const totalDistanceKm = round2(
    items.reduce((sum, item) => sum + haversineKm(renterLocation.lat, renterLocation.lng, item.listing.pickupLat, item.listing.pickupLng), 0),
  );
  const totalPrice = round2(items.reduce((sum, item) => sum + item.listing.basePriceDaily * item.quantity * scenario.durationDays, 0));
  const reliabilityRaw = round2(
    average(
      uniqueLenders.map((lenderId) => lenders.find((candidate) => candidate.id === lenderId)!.reliabilityScore),
    ),
  );
  const qualityRaw = round2(average(items.map((item) => item.listing.qualityScore)));
  const availabilityRaw = round2(
    average(items.map((item) => availabilityProfileScore(item.listing.availabilityProfile))) -
      (strategy === "fragile" ? 2.0 : 0) -
      (strategy === "weakLink" ? 0.9 : 0),
  );
  const logisticsRaw = round2(
    clamp(
      10.4 -
        totalDistanceKm * 0.32 -
        (pickupPointsCount - 1) * 1.2 +
        (uniqueLenders.length === 1 ? 1.8 : 0) +
        (items.every((item) => item.listing.deliverySupported) ? 0.45 : 0),
      1,
      10,
    ),
  );
  const baseScores = [reliabilityRaw, logisticsRaw, clamp(availabilityRaw, 1, 10), qualityRaw];
  const stabilityRaw = round2(
    clamp(
      8.4 -
        standardDeviation(baseScores) * 1.15 -
        baseScores.filter((score) => score < 5.8).length * 0.85 +
        Math.min(...baseScores) * 0.18,
      1,
      10,
    ),
  );

  return {
    id: makeId(93, hashCode(`${searchRequestId}-${strategy}-${candidateIndex}`)),
    searchRequestId,
    type: strategy,
    label: candidateLabel(strategy).label,
    labelHe: candidateLabel(strategy).labelHe,
    items,
    rawPrice: totalPrice,
    rawReliability: reliabilityRaw,
    rawLogistics: logisticsRaw,
    rawAvailability: clamp(availabilityRaw, 1, 10),
    rawQuality: qualityRaw,
    rawStability: stabilityRaw,
    totalDistanceKm,
    pickupPointsCount,
    lendersCount: uniqueLenders.length,
    exactAvailabilityFit: strategy !== "fragile",
  };
}

function rankCandidateDrafts(drafts: SearchCandidateDraft[], weights: Record<string, number>) {
  const minPrice = Math.min(...drafts.map((draft) => draft.rawPrice));
  const maxPrice = Math.max(...drafts.map((draft) => draft.rawPrice));

  return drafts
    .map((draft) => {
      const priceScore =
        maxPrice === minPrice ? 8.5 : round2(clamp(10 - ((draft.rawPrice - minPrice) / (maxPrice - minPrice)) * 8.2, 1.5, 10));
      const coreScores = [
        priceScore,
        draft.rawReliability,
        draft.rawLogistics,
        draft.rawAvailability,
        draft.rawQuality,
      ];
      const weightedMean =
        priceScore * weights.price +
        draft.rawReliability * weights.reliability +
        draft.rawLogistics * weights.logistics +
        draft.rawAvailability * weights.availability +
        draft.rawQuality * weights.quality;
      const stdDev = standardDeviation(coreScores);
      const lowScores = coreScores.filter((score) => score < 5.6);
      const lowScorePenalty = lowScores.reduce((sum, score) => sum + (5.6 - score) * 0.16, 0);
      const bottleneckBoost = Math.min(...coreScores) * 0.24;
      const finalScore = round2(clamp(weightedMean - stdDev * 0.33 - lowScorePenalty + bottleneckBoost, 1, 10));
      const stabilityScore = round2(
        clamp(
          draft.rawStability - stdDev * 0.18 - lowScores.length * 0.22 + Math.min(...coreScores) * 0.09,
          1,
          10,
        ),
      );
      return {
        draft,
        priceScore,
        finalScore,
        stabilityScore,
      };
    })
    .sort((left, right) => right.finalScore - left.finalScore)
    .map((row, index) => {
      const explanation = buildExplanation(row.draft, row.priceScore, row.stabilityScore);
      const bundleRow: Prisma.BundleCandidateCreateManyInput = {
        id: row.draft.id,
        searchRequestId: row.draft.searchRequestId,
        scoreTotal: row.finalScore,
        priceScore: row.priceScore,
        reliabilityScore: row.draft.rawReliability,
        logisticsScore: row.draft.rawLogistics,
        availabilityScore: row.draft.rawAvailability,
        productQualityScore: row.draft.rawQuality,
        stabilityScore: row.stabilityScore,
        explanation: explanation as Prisma.InputJsonValue,
        debugData: {
          strategy: row.draft.type,
          weightedMean: round2(
            row.priceScore * 0.2 +
              row.draft.rawReliability * 0.2 +
              row.draft.rawLogistics * 0.2 +
              row.draft.rawAvailability * 0.2 +
              row.draft.rawQuality * 0.2,
          ),
          pickupPointsCount: row.draft.pickupPointsCount,
          lendersCount: row.draft.lendersCount,
          weakDimensions: [
            row.priceScore < 5.6 ? "price" : undefined,
            row.draft.rawReliability < 5.6 ? "reliability" : undefined,
            row.draft.rawLogistics < 5.6 ? "logistics" : undefined,
            row.draft.rawAvailability < 5.6 ? "availability" : undefined,
            row.draft.rawQuality < 5.6 ? "quality" : undefined,
          ].filter(Boolean),
        } as Prisma.InputJsonValue,
        totalPrice: row.draft.rawPrice,
        totalDistanceKm: row.draft.totalDistanceKm,
        pickupPointsCount: row.draft.pickupPointsCount,
        lendersCount: row.draft.lendersCount,
        exactAvailabilityFit: row.draft.exactAvailabilityFit,
        rankIndex: index + 1,
        label: row.draft.label,
      };

      const itemRows: Prisma.BundleCandidateItemCreateManyInput[] = row.draft.items.map((item, itemIndex) => ({
        id: makeId(94, hashCode(`${row.draft.id}-${item.requestedSlotKey}-${itemIndex}`)),
        bundleCandidateId: row.draft.id,
        requestedSlotKey: item.requestedSlotKey,
        listingId: item.listing.id,
        lenderId: item.listing.lenderId,
        quantity: item.quantity,
        contributionScores: {
          price: round2(Math.max(1, 10 - item.listing.basePriceDaily / 90)),
          logistics: round2(Math.max(1, 10 - haversineKm(neighborhoods[0].lat, neighborhoods[0].lng, item.listing.pickupLat, item.listing.pickupLng) / 2)),
          reliability: row.draft.rawReliability,
          quality: item.listing.qualityScore,
          availability: availabilityProfileScore(item.listing.availabilityProfile),
        } as Prisma.InputJsonValue,
      }));

      return {
        bundleRow,
        itemRows,
        label: row.draft.label,
      };
    });
}

function buildExplanation(draft: SearchCandidateDraft, priceScore: number, stabilityScore: number) {
  const strengths = [
    priceScore >= 8.3 ? "price efficiency" : undefined,
    draft.rawReliability >= 8.3 ? "good reliability" : undefined,
    draft.rawLogistics >= 8.3 ? "close pickup" : undefined,
    draft.rawAvailability >= 8.0 ? "strong date fit" : undefined,
    draft.rawQuality >= 8.1 ? "high listing quality" : undefined,
    draft.lendersCount === 1 ? "same lender convenience" : undefined,
  ].filter(Boolean) as string[];

  const weaknesses = [
    priceScore <= 5.2 ? "higher price" : undefined,
    draft.rawReliability <= 5.4 ? "weaker lender trust" : undefined,
    draft.rawLogistics <= 5.4 ? "spread pickup points" : undefined,
    draft.rawAvailability <= 5.5 ? "fragile availability" : undefined,
    draft.rawQuality <= 5.5 ? "one weaker item" : undefined,
    stabilityScore <= 5.6 ? "imbalanced bundle" : undefined,
  ].filter(Boolean) as string[];

  const chips = [
    draft.lendersCount === 1 ? "same lender" : `${draft.lendersCount} lenders`,
    `${draft.pickupPointsCount} pickup points`,
    draft.exactAvailabilityFit ? "exact date match" : "tight date fit",
    priceScore >= 8.2 ? "budget-friendly" : undefined,
    draft.rawReliability >= 8.2 ? "highly rated lenders" : undefined,
  ].filter(Boolean) as string[];

  const strengthsHe = strengths.map((value) => translateExplanation(value));
  const weaknessesHe = weaknesses.map((value) => translateExplanation(value));
  const chipsHe = chips.map((value) => translateExplanation(value));

  return {
    label: draft.label,
    labelHe: draft.labelHe,
    strengths,
    strengthsHe,
    weaknesses,
    weaknessesHe,
    chips,
    chipsHe,
    summaryEn: explanationSummary(draft.label, strengths, weaknesses),
    summaryHe: explanationSummaryHe(draft.labelHe, strengthsHe, weaknessesHe),
  };
}

function candidateLabel(type: ScenarioCandidateType) {
  if (type === "balanced") {
    return { label: "best balanced", labelHe: "הכי מאוזן" };
  }
  if (type === "cheapest") {
    return { label: "best price", labelHe: "הכי משתלם במחיר" };
  }
  if (type === "sameLender") {
    return { label: "easiest pickup", labelHe: "איסוף הכי נוח" };
  }
  if (type === "premium") {
    return { label: "most reliable", labelHe: "הכי אמין" };
  }
  if (type === "fragile") {
    return { label: "availability edge case", labelHe: "קצה זמינות" };
  }
  return { label: "one weak item", labelHe: "פריט חלש אחד" };
}

function selectListingForStrategy(args: {
  candidates: GeneratedListingMeta[];
  strategy: ScenarioCandidateType;
  slotQuantity: number;
  slotIndex: number;
  preferredLender?: GeneratedLender;
  usedListings: Set<string>;
  renterLocation: Neighborhood;
}) {
  const { candidates, strategy, slotQuantity, slotIndex, preferredLender, usedListings, renterLocation } = args;
  const filtered = candidates.filter((candidate) => candidate.inventoryCount >= Math.min(slotQuantity, candidate.inventoryCount) && !usedListings.has(candidate.id));
  const pool = filtered.length > 0 ? filtered : candidates;

  if (preferredLender) {
    const sameLender = pool.filter((candidate) => candidate.lenderId === preferredLender.id);
    if (sameLender.length > 0) {
      return chooseByStrategy(sameLender, strategy, renterLocation, slotIndex);
    }
  }

  return chooseByStrategy(pool, strategy, renterLocation, slotIndex);
}

function chooseByStrategy(
  listings: GeneratedListingMeta[],
  strategy: ScenarioCandidateType,
  renterLocation: Neighborhood,
  slotIndex: number,
) {
  const sorted = [...listings].sort((left, right) => left.basePriceDaily - right.basePriceDaily);

  if (strategy === "cheapest") {
    return sorted[Math.min(slotIndex, sorted.length - 1)];
  }
  if (strategy === "premium") {
    return [...listings].sort((left, right) => right.qualityScore - left.qualityScore)[slotIndex % Math.min(3, listings.length)];
  }
  if (strategy === "sameLender") {
    return [...listings].sort(
      (left, right) =>
        haversineKm(renterLocation.lat, renterLocation.lng, left.pickupLat, left.pickupLng) -
        haversineKm(renterLocation.lat, renterLocation.lng, right.pickupLat, right.pickupLng),
    )[0];
  }
  if (strategy === "fragile") {
    const scarce = listings.filter((listing) => listing.availabilityProfile === "scarce" || listing.availabilityProfile === "fragmented");
    if (scarce.length > 0) {
      return scarce[slotIndex % scarce.length];
    }
  }
  if (strategy === "weakLink") {
    const weak = [...listings].sort((left, right) => left.qualityScore - right.qualityScore);
    return slotIndex === 0 ? weak[0] : weak[Math.min(weak.length - 1, slotIndex + 1)];
  }

  return [...listings].sort((left, right) => {
    const leftScore =
      left.qualityScore * 0.34 +
      availabilityProfileScore(left.availabilityProfile) * 0.18 +
      (10 - Math.min(9.5, left.basePriceDaily / 70)) * 0.18 +
      (10 - haversineKm(renterLocation.lat, renterLocation.lng, left.pickupLat, left.pickupLng)) * 0.3;
    const rightScore =
      right.qualityScore * 0.34 +
      availabilityProfileScore(right.availabilityProfile) * 0.18 +
      (10 - Math.min(9.5, right.basePriceDaily / 70)) * 0.18 +
      (10 - haversineKm(renterLocation.lat, renterLocation.lng, right.pickupLat, right.pickupLng)) * 0.3;
    return rightScore - leftScore;
  })[0];
}

function availabilityProfileScore(profile: AvailabilityProfile) {
  if (profile === "open") {
    return 9.4;
  }
  if (profile === "partial") {
    return 7.8;
  }
  if (profile === "fragmented") {
    return 5.9;
  }
  return 4.2;
}

function findLenderForScenario(
  lenders: GeneratedLender[],
  scenario: SearchScenarioTemplate,
  preferredArchetypes: Archetype[],
) {
  const slotCategories = scenario.slots.map((slot) => slot.categoryKey);
  return lenders.find(
    (lender) =>
      preferredArchetypes.includes(lender.archetype) &&
      slotCategories.every((category) => lender.primaryCategories.includes(category) || lender.secondaryCategories.includes(category)),
  );
}

function createBookings(args: {
  renterIds: string[];
  activeListings: GeneratedListingMeta[];
  listingsByCategory: Map<CategoryKey, GeneratedListingMeta[]>;
  lenders: GeneratedLender[];
  bundleCandidateRows: Prisma.BundleCandidateCreateManyInput[];
}) {
  const { renterIds, listingsByCategory, lenders, bundleCandidateRows } = args;
  const bookingRows: Prisma.BookingCreateManyInput[] = [];
  const bookingItemRows: Prisma.BookingItemCreateManyInput[] = [];
  const bookingAvailabilityBlocks: Prisma.ListingAvailabilityBlockCreateManyInput[] = [];
  const completedBookingsForReview: Array<{
    bookingId: string;
    renterId: string;
    listingId: string;
    revieweeUserId: string;
    lenderArchetype: Archetype;
  }> = [];
  const disputeEligibleBookings: Prisma.DisputeCreateManyInput[] = [];
  const paymentBookings: Array<{ bookingId: string; amount: number; status: string }> = [];

  const statusPlan: BookingStatus[] = [
    ...Array.from({ length: 38 }, () => BookingStatus.COMPLETED),
    ...Array.from({ length: 10 }, () => BookingStatus.IN_PROGRESS),
    ...Array.from({ length: 8 }, () => BookingStatus.CONFIRMED),
    ...Array.from({ length: 8 }, () => BookingStatus.CANCELLED),
    ...Array.from({ length: 8 }, () => BookingStatus.REJECTED),
  ];

  statusPlan.forEach((status, index) => {
    const bookingId = makeId(110, index + 1);
    const renterId = renterIds[index % renterIds.length];
    const templateCategories = pick(bookingCategorySets());
    const startDate = offsetDate(new Date(`${seedYear}-01-04T10:00:00.000Z`), index * 3, 10);
    const duration = intBetween(1, templateCategories.length >= 4 ? 4 : 3);
    const endDate = offsetDate(startDate, duration, 18);
    const linkedCandidate = index < bundleCandidateRows.length && index % 3 === 0 ? bundleCandidateRows[index].id : undefined;
    const itemsForBooking = templateCategories.map((categoryKey, categoryIndex) => {
      const candidates = listingsByCategory.get(categoryKey)!;
      const preferredArchetypes =
        status === BookingStatus.CANCELLED || status === BookingStatus.REJECTED
          ? ["cheap", "inconsistent"]
          : status === BookingStatus.COMPLETED
            ? ["local", "premium", "local", "inconsistent"]
            : ["local", "premium", "cheap"];
      const preferred = candidates.find((candidate) => preferredArchetypes.includes(candidate.lenderArchetype)) ?? candidates[0];
      const quantity =
        categoryKey === "chairs"
          ? intBetween(12, 36)
          : categoryKey === "tables"
            ? intBetween(2, 6)
            : categoryKey === "heaters"
              ? intBetween(2, 5)
              : categoryKey === "projectors" || categoryKey === "cameras" || categoryKey === "mixers"
                ? 1
                : categoryKey === "microphones"
                  ? intBetween(1, 3)
                  : 1;
      return {
        listing: candidates[(categoryIndex + index) % Math.min(candidates.length, 7)] ?? preferred,
        quantity,
      };
    });

    const totalPrice = round2(
      itemsForBooking.reduce((sum, entry) => sum + entry.listing.basePriceDaily * entry.quantity * duration, 0),
    );
    const totalDeposit = round2(
      itemsForBooking.reduce((sum, entry) => sum + entry.listing.depositAmount * Math.min(entry.quantity, 3), 0),
    );
    const logisticsSnapshot = round2(
      clamp(
        9.8 -
          unique(itemsForBooking.map((entry) => entry.listing.lenderId)).length * 1.1 -
          itemsForBooking.reduce(
            (sum, entry) => sum + haversineKm(32.0722, 34.8117, entry.listing.pickupLat, entry.listing.pickupLng),
            0,
          ) *
            0.18,
        2,
        10,
      ),
    );
    const reliabilitySnapshot = round2(
      average(
        unique(itemsForBooking.map((entry) => entry.listing.lenderId)).map(
          (lenderId) => lenders.find((candidate) => candidate.id === lenderId)!.reliabilityScore,
        ),
      ),
    );

    bookingRows.push({
      id: bookingId,
      renterId,
      bundleCandidateId: linkedCandidate,
      status,
      startDate,
      endDate,
      totalPrice,
      totalDeposit,
      logisticsScoreSnapshot: logisticsSnapshot,
      reliabilityScoreSnapshot: reliabilitySnapshot,
      paymentStatus:
        status === BookingStatus.COMPLETED
          ? PaymentStatus.CAPTURED
          : status === BookingStatus.IN_PROGRESS || status === BookingStatus.CONFIRMED
            ? PaymentStatus.AUTHORIZED
            : status === BookingStatus.REJECTED
              ? PaymentStatus.NOT_REQUIRED
              : status === BookingStatus.CANCELLED
                ? PaymentStatus.REFUNDED
                : PaymentStatus.PENDING,
      paymentReference: status === BookingStatus.REJECTED ? null : `pi_${bookingId.replace(/-/g, "").slice(0, 20)}`,
    });

    itemsForBooking.forEach((entry) => {
      bookingItemRows.push({
        id: makeId(111, bookingItemRows.length + 1),
        bookingId,
        listingId: entry.listing.id,
        lenderId: entry.listing.lenderId,
        quantity: entry.quantity,
        itemPrice: round2(entry.listing.basePriceDaily * entry.quantity * duration),
        depositAmount: round2(entry.listing.depositAmount * Math.min(entry.quantity, 3)),
        pickupMethod: entry.listing.deliverySupported && bool(0.35) ? PickupMethod.DELIVERY : PickupMethod.PICKUP,
        pickupWindow: {
          date: startDate.toISOString().slice(0, 10),
          from: "09:00",
          to: "12:00",
        } as Prisma.InputJsonValue,
      });

      if (status !== BookingStatus.CANCELLED && status !== BookingStatus.REJECTED) {
        bookingAvailabilityBlocks.push({
          listingId: entry.listing.id,
          startDate,
          endDate,
          status: AvailabilityBlockStatus.BOOKED,
          quantity: Math.min(entry.quantity, Math.max(1, entry.listing.inventoryCount)),
          reason: `Seed booking ${bookingId}`,
        });
      }
    });

    if (status === BookingStatus.COMPLETED && completedBookingsForReview.length < 44) {
      const primaryItem = itemsForBooking[0];
      completedBookingsForReview.push({
        bookingId,
        renterId,
        listingId: primaryItem.listing.id,
        revieweeUserId: primaryItem.listing.lenderId,
        lenderArchetype: primaryItem.listing.lenderArchetype,
      });
    }

    if (status === BookingStatus.CANCELLED || status === BookingStatus.REJECTED) {
      disputeEligibleBookings.push({
        id: makeId(113, disputeEligibleBookings.length + 1),
        bookingId,
        openedByUserId: renterId,
        assignedAdminId: makeId(1, 1),
        status: status === BookingStatus.CANCELLED ? DisputeStatus.UNDER_REVIEW : DisputeStatus.OPEN,
        reason:
          status === BookingStatus.CANCELLED
            ? "Pickup changed after confirmation and renter requested review"
            : "Listing was unavailable after request approval",
        resolutionNote: status === BookingStatus.REJECTED ? null : "Pending review by admin ops",
      });
    }

    if (status !== BookingStatus.REJECTED) {
      paymentBookings.push({
        bookingId,
        amount: totalPrice,
        status:
          status === BookingStatus.COMPLETED
            ? "captured"
            : status === BookingStatus.CANCELLED
              ? "refunded"
              : status === BookingStatus.IN_PROGRESS || status === BookingStatus.CONFIRMED
                ? "authorized"
                : "pending",
      });
    }
  });

  return {
    bookingRows,
    bookingItemRows,
    bookingAvailabilityBlocks,
    completedBookingsForReview,
    disputeEligibleBookings,
    paymentBookings,
  };
}

function createReviews(
  completedBookingsForReview: Array<{
    bookingId: string;
    renterId: string;
    listingId: string;
    revieweeUserId: string;
    lenderArchetype: Archetype;
  }>,
  lenders: GeneratedLender[],
) {
  return completedBookingsForReview.map((entry, index): Prisma.ReviewCreateManyInput => {
    const lender = lenders.find((candidate) => candidate.id === entry.revieweeUserId)!;
    const rating =
      entry.lenderArchetype === "premium"
        ? weightedPick([
            { value: 5, weight: 0.78 },
            { value: 4, weight: 0.22 },
          ])
        : entry.lenderArchetype === "local"
          ? weightedPick([
              { value: 5, weight: 0.54 },
              { value: 4, weight: 0.36 },
              { value: 3, weight: 0.1 },
            ])
          : entry.lenderArchetype === "cheap"
            ? weightedPick([
                { value: 4, weight: 0.18 },
                { value: 3, weight: 0.46 },
                { value: 2, weight: 0.36 },
              ])
            : weightedPick([
                { value: 5, weight: 0.18 },
                { value: 4, weight: 0.28 },
                { value: 3, weight: 0.34 },
                { value: 2, weight: 0.2 },
              ]);

    return {
      id: makeId(120, index + 1),
      bookingId: entry.bookingId,
      reviewerId: entry.renterId,
      revieweeUserId: entry.revieweeUserId,
      listingId: entry.listingId,
      rating,
      text: reviewText(entry.lenderArchetype, rating, lender.displayName),
      tags: reviewTags(entry.lenderArchetype, rating) as Prisma.InputJsonValue,
      createdAt: offsetDate(new Date(`${seedYear}-02-10T10:00:00.000Z`), index * 2, 12),
    };
  });
}

function createDisputes(disputes: Prisma.DisputeCreateManyInput[], adminId: string) {
  return disputes.map((row, index) => ({
    ...row,
    assignedAdminId: adminId,
    id: makeId(121, index + 1),
  }));
}

function createPaymentPlaceholders(paymentBookings: Array<{ bookingId: string; amount: number; status: string }>) {
  return paymentBookings.map((payment, index): Prisma.PaymentIntentPlaceholderCreateManyInput => ({
    id: makeId(122, index + 1),
    bookingId: payment.bookingId,
    provider: "demo-payments",
    providerReference: `demo_${payment.bookingId.replace(/-/g, "").slice(0, 18)}`,
    status: payment.status,
    amount: payment.amount,
    currency: "ILS",
    metadata: {
      source: "seed",
      mode: "payment-ready-placeholder",
    } as Prisma.InputJsonValue,
  }));
}

function createNotifications(adminId: string, renterIds: string[]) {
  const rows: Prisma.NotificationCreateManyInput[] = [];
  renterIds.slice(0, 10).forEach((renterId, index) => {
    rows.push({
      id: makeId(130, rows.length + 1),
      userId: renterId,
      channel: NotificationChannel.IN_APP,
      type: NotificationType.BUNDLE_RESULT,
      titleHe: "נמצאו חבילות חכמות חדשות",
      titleEn: "New smart bundles are ready",
      bodyHe: "זמינות עכשיו תוצאות חדשות עם הסברים, מחיר וציוני לוגיסטיקה.",
      bodyEn: "Fresh ranked bundles are ready with explanations, pricing, and logistics scores.",
    });
  });
  renterIds.slice(10, 20).forEach((renterId) => {
    rows.push({
      id: makeId(130, rows.length + 1),
      userId: renterId,
      channel: NotificationChannel.EMAIL,
      type: NotificationType.BOOKING,
      titleHe: "עדכון סטטוס הזמנה",
      titleEn: "Booking status update",
      bodyHe: "ההזמנה שלך עודכנה. ניתן לעבור למסך ההזמנות לצפייה בפרטים.",
      bodyEn: "Your booking was updated. Open the orders page for the latest details.",
    });
  });
  rows.push({
    id: makeId(130, rows.length + 1),
    userId: adminId,
    channel: NotificationChannel.IN_APP,
    type: NotificationType.ADMIN,
    titleHe: "סיכום פעילות יומי",
    titleEn: "Daily operations summary",
    bodyHe: "התווספו חיפושי חבילות חדשים ויש 4 מחלוקות פתוחות לבדיקה.",
    bodyEn: "New bundle searches were generated and 4 disputes are waiting for review.",
  });
  return rows;
}

function createFeatureFlags(): Prisma.FeatureFlagCreateManyInput[] {
  return [
    {
      key: "enableExperimentalRankingV2",
      description: "Alternative ranking coefficients for bundle stability experiments",
      enabled: false,
      payload: {
        owner: "ranking",
        rollout: 0,
      } as Prisma.InputJsonValue,
    },
    {
      key: "enableAdminBundleDebug",
      description: "Expose bundle debug traces to admin dashboard",
      enabled: true,
      payload: {
        redactCoordinates: false,
      } as Prisma.InputJsonValue,
    },
    {
      key: "enableHeuristicPickupClusterBonus",
      description: "Give same-area bundles an extra logistics push",
      enabled: true,
      payload: {
        clusterBonus: 0.45,
      } as Prisma.InputJsonValue,
    },
  ];
}

function createRankingConfigs(adminId: string): Prisma.RankingConfigCreateManyInput[] {
  return [
    {
      id: makeId(140, 1),
      presetKey: "balanced",
      displayNameHe: "מאוזן",
      weights: {
        price: 0.2,
        reliability: 0.22,
        logistics: 0.22,
        availability: 0.18,
        quality: 0.18,
      } as Prisma.InputJsonValue,
      lowScoreThreshold: 5.4,
      stdDevAlpha: 0.35,
      lowScoreBeta: 0.62,
      bottleneckGamma: 0.28,
      updatedByUserId: adminId,
    },
    {
      id: makeId(140, 2),
      presetKey: "cheapest",
      displayNameHe: "הכי זול",
      weights: {
        price: 0.4,
        reliability: 0.16,
        logistics: 0.17,
        availability: 0.15,
        quality: 0.12,
      } as Prisma.InputJsonValue,
      lowScoreThreshold: 5.2,
      stdDevAlpha: 0.28,
      lowScoreBeta: 0.54,
      bottleneckGamma: 0.24,
      updatedByUserId: adminId,
    },
    {
      id: makeId(140, 3),
      presetKey: "mostReliable",
      displayNameHe: "הכי אמין",
      weights: {
        price: 0.1,
        reliability: 0.38,
        logistics: 0.14,
        availability: 0.16,
        quality: 0.22,
      } as Prisma.InputJsonValue,
      lowScoreThreshold: 5.6,
      stdDevAlpha: 0.36,
      lowScoreBeta: 0.66,
      bottleneckGamma: 0.3,
      updatedByUserId: adminId,
    },
    {
      id: makeId(140, 4),
      presetKey: "easiestPickup",
      displayNameHe: "איסוף הכי נוח",
      weights: {
        price: 0.14,
        reliability: 0.16,
        logistics: 0.4,
        availability: 0.15,
        quality: 0.15,
      } as Prisma.InputJsonValue,
      lowScoreThreshold: 5.3,
      stdDevAlpha: 0.34,
      lowScoreBeta: 0.58,
      bottleneckGamma: 0.28,
      updatedByUserId: adminId,
    },
    {
      id: makeId(140, 5),
      presetKey: "bestDateFit",
      displayNameHe: "התאמת תאריכים",
      weights: {
        price: 0.14,
        reliability: 0.18,
        logistics: 0.16,
        availability: 0.34,
        quality: 0.18,
      } as Prisma.InputJsonValue,
      lowScoreThreshold: 5.5,
      stdDevAlpha: 0.32,
      lowScoreBeta: 0.61,
      bottleneckGamma: 0.29,
      updatedByUserId: adminId,
    },
  ];
}

function createAuditLogs(adminId: string, lenders: GeneratedLender[]) {
  return [
    {
      id: makeId(150, 1),
      actorUserId: adminId,
      action: "ranking-config.update",
      entityType: "RankingConfig",
      entityId: makeId(140, 1),
      before: {
        presetKey: "balanced",
        weights: { price: 0.2, reliability: 0.2, logistics: 0.2, availability: 0.2, quality: 0.2 },
      } as Prisma.InputJsonValue,
      after: {
        presetKey: "balanced",
        weights: { price: 0.2, reliability: 0.22, logistics: 0.22, availability: 0.18, quality: 0.18 },
      } as Prisma.InputJsonValue,
      metadata: {
        source: "seed",
      } as Prisma.InputJsonValue,
    },
    {
      id: makeId(150, 2),
      actorUserId: adminId,
      action: "listing.moderation.approve",
      entityType: "ListingBatch",
      entityId: "seed-local-launch",
      before: {
        status: "PENDING_REVIEW",
      } as Prisma.InputJsonValue,
      after: {
        status: "ACTIVE",
        approvedCount: 18,
      } as Prisma.InputJsonValue,
      metadata: {
        archetype: "local",
      } as Prisma.InputJsonValue,
    },
    {
      id: makeId(150, 3),
      actorUserId: lenders[0]?.id ?? adminId,
      action: "listing.bulk-price-update",
      entityType: "Listing",
      entityId: "cheap-lender-pricing",
      before: {
        basePriceBand: "mid",
      } as Prisma.InputJsonValue,
      after: {
        basePriceBand: "cheap",
      } as Prisma.InputJsonValue,
      metadata: {
        note: "Lender moved to aggressive pricing",
      } as Prisma.InputJsonValue,
    },
  ];
}

function createFavoriteRows(renterIds: string[], activeListings: GeneratedListingMeta[]) {
  const rows: Prisma.FavoriteCreateManyInput[] = [];
  const used = new Set<string>();
  while (rows.length < 30) {
    const renterId = renterIds[rows.length % renterIds.length];
    const listing = activeListings[intBetween(0, activeListings.length - 1)];
    const key = `${renterId}:${listing.id}`;
    if (used.has(key)) {
      continue;
    }
    used.add(key);
    rows.push({
      id: makeId(160, rows.length + 1),
      renterId,
      listingId: listing.id,
    });
  }
  return rows;
}

function bookingCategorySets(): CategoryKey[][] {
  return [
    ["cameras", "tripods", "lighting"],
    ["projectors", "speakers", "microphones"],
    ["chairs", "tables", "projectors"],
    ["tents", "heaters", "generators"],
    ["cameras", "microphones", "lighting", "mixers"],
    ["stages", "speakers", "mixers"],
    ["chairs", "tables", "speakers", "microphones"],
    ["projectors", "chairs", "tables", "speakers"],
  ];
}

function reviewText(archetype: Archetype, rating: number, displayName: string) {
  if (archetype === "premium") {
    return rating === 5
      ? `איסוף מדויק מאוד מ-${displayName}, הציוד הגיע נקי ומסודר וההסבר במקום היה מקצועי.`
      : `הציוד של ${displayName} היה איכותי מאוד, רק המחיר הרגיש מעט גבוה ביחס להזמנה.`;
  }
  if (archetype === "local") {
    return rating >= 4
      ? `היה נוח לקחת כמה פריטים יחד מ-${displayName}. חוויית האיסוף קיצרה לנו את יום ההפקה.`
      : `המיקום של ${displayName} היה נוח אבל אחד הפריטים הגיע עם בלאי מורגש.`;
  }
  if (archetype === "cheap") {
    return rating >= 3
      ? `המחיר אצל ${displayName} עזר לנו להישאר בתקציב, אבל התיאום דרש יותר מעקב.`
      : `הזמינות של ${displayName} הייתה פחות יציבה והציוד הרגיש שחוק יחסית לתיאור.`;
  }
  return rating >= 4
    ? `בפעם הזו ${displayName} עבד טוב והציוד היה במצב מפתיע לטובה.`
    : `החוויה מול ${displayName} הייתה לא אחידה, חלק מהציוד היה טוב וחלק דרש פתרון במקום.`;
}

function reviewTags(archetype: Archetype, rating: number) {
  if (archetype === "premium") {
    return rating === 5 ? ["אמין", "מסודר", "ציוד איכותי"] : ["איכותי", "יקר", "שירות טוב"];
  }
  if (archetype === "local") {
    return rating >= 4 ? ["איסוף נוח", "חבילה טובה", "קרוב"] : ["קרוב", "סביר", "צריך בדיקה"];
  }
  if (archetype === "cheap") {
    return rating >= 3 ? ["זול", "דורש תיאום", "תמורה"] : ["זול", "לא יציב", "בלאי"];
  }
  return rating >= 4 ? ["מצא חן בעיניי", "משתנה", "שווה בדיקה"] : ["לא אחיד", "זמינות חלשה", "זהירות"];
}

function presetWeights(preset: PreferencePreset) {
  if (preset === "cheapest") {
    return { price: 0.4, reliability: 0.16, logistics: 0.17, availability: 0.15, quality: 0.12 };
  }
  if (preset === "mostReliable") {
    return { price: 0.1, reliability: 0.38, logistics: 0.14, availability: 0.16, quality: 0.22 };
  }
  if (preset === "easiestPickup") {
    return { price: 0.14, reliability: 0.16, logistics: 0.4, availability: 0.15, quality: 0.15 };
  }
  if (preset === "bestDateFit") {
    return { price: 0.14, reliability: 0.18, logistics: 0.16, availability: 0.34, quality: 0.18 };
  }
  return { price: 0.2, reliability: 0.22, logistics: 0.22, availability: 0.18, quality: 0.18 };
}

async function clearDatabase() {
  await prisma.$transaction([
    prisma.review.deleteMany(),
    prisma.dispute.deleteMany(),
    prisma.paymentIntentPlaceholder.deleteMany(),
    prisma.bookingItem.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.bundleCandidateItem.deleteMany(),
    prisma.bundleCandidate.deleteMany(),
    prisma.bundleSearchRequest.deleteMany(),
    prisma.pricingRule.deleteMany(),
    prisma.listingAvailabilityBlock.deleteMany(),
    prisma.listingAttributeValue.deleteMany(),
    prisma.listingMedia.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.savedSearch.deleteMany(),
    prisma.deliveryWindow.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.listing.deleteMany(),
    prisma.category.deleteMany(),
    prisma.rankingConfig.deleteMany(),
    prisma.featureFlag.deleteMany(),
    prisma.refreshSession.deleteMany(),
    prisma.renterProfile.deleteMany(),
    prisma.lenderProfile.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function createInChunks<T>(rows: T[], size: number, insert: (chunk: T[]) => Promise<unknown>) {
  for (let index = 0; index < rows.length; index += size) {
    await insert(rows.slice(index, index + size));
  }
}

function createCoordinates(neighborhood: Neighborhood, spreadMultiplier: number) {
  return {
    lat: round6(neighborhood.lat + randomBetween(-neighborhood.spreadLat, neighborhood.spreadLat) * spreadMultiplier),
    lng: round6(neighborhood.lng + randomBetween(-neighborhood.spreadLng, neighborhood.spreadLng) * spreadMultiplier),
  };
}

function makeId(space: number, index: number) {
  const value = (BigInt(space) << 64n) | BigInt(index);
  const chars = value.toString(16).padStart(32, "0").split("");
  chars[12] = "4";
  const variant = Number.parseInt(chars[16], 16);
  chars[16] = ((variant & 0x3) | 0x8).toString(16);
  const hex = chars.join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function createRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBetween(min: number, max: number) {
  return rng() * (max - min) + min;
}

function intBetween(min: number, max: number) {
  return Math.floor(randomBetween(min, max + 1));
}

function bool(chance: number) {
  return rng() <= chance;
}

function pick<T>(items: readonly T[]): T {
  return items[intBetween(0, items.length - 1)];
}

function weightedPick<T>(items: Array<{ value: T; weight: number }>): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const threshold = rng() * total;
  let running = 0;
  for (const item of items) {
    running += item.weight;
    if (threshold <= running) {
      return item.value;
    }
  }
  return items[items.length - 1].value;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function round6(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]) {
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function offsetDate(date: Date, days: number, hour: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  next.setUTCHours(hour, 0, 0, 0);
  return next;
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function groupBy<T, K>(values: T[], keySelector: (value: T) => K) {
  const map = new Map<K, T[]>();
  values.forEach((value) => {
    const key = keySelector(value);
    const collection = map.get(key);
    if (collection) {
      collection.push(value);
    } else {
      map.set(key, [value]);
    }
  });
  return map;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = rad(lat2 - lat1);
  const deltaLng = rad(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(deltaLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function makePhone(prefix: number, index: number) {
  return `0${String(prefix + index).slice(0, 9)}`;
}

function createLenderBio(displayNameHe: string, archetype: Archetype, neighborhoodHe: string) {
  if (archetype === "premium") {
    return `${displayNameHe} פועל מ-${neighborhoodHe} ומתמחה בציוד מוקפד עם מסירה מסודרת, בדיקות קדם השכרה ורמת שירות גבוהה.`;
  }
  if (archetype === "local") {
    return `${displayNameHe} ממוקם ב-${neighborhoodHe} ומתאים להשכרות שדורשות איסוף נוח של כמה פריטים יחד מאותו אזור.`;
  }
  if (archetype === "cheap") {
    return `${displayNameHe} מציע מחירים אגרסיביים מ-${neighborhoodHe} ומתאים ללקוחות שמעדיפים תקציב לפני נוחות.`;
  }
  return `${displayNameHe} פועל מ-${neighborhoodHe} עם מלאי מגוון אך פחות אחיד, ולכן כדאי לבדוק כל פריט בנפרד.`;
}

function randomStreetName() {
  return pick([
    "הרצל",
    "לינקולן",
    "יצחק שדה",
    "דרך יפו",
    "אחד העם",
    "קרליבך",
    "לוינסקי",
    "המלאכה",
    "היצירה",
    "בן צבי",
  ]);
}

function explanationSummary(label: string, strengths: string[], weaknesses: string[]) {
  const strengthsText = strengths.slice(0, 2).join(", ") || "solid overall fit";
  const weaknessText = weaknesses[0] ?? "no major tradeoff";
  return `${label}: strengths include ${strengthsText}; tradeoff is ${weaknessText}.`;
}

function explanationSummaryHe(labelHe: string, strengthsHe: string[], weaknessesHe: string[]) {
  const strengthsText = strengthsHe.slice(0, 2).join(", ") || "התאמה טובה";
  const weaknessText = weaknessesHe[0] ?? "ללא חולשה בולטת";
  return `${labelHe}: החוזקות הן ${strengthsText}; הפשרה העיקרית היא ${weaknessText}.`;
}

function translateExplanation(value: string) {
  const dictionary: Record<string, string> = {
    "price efficiency": "מחיר יעיל",
    "good reliability": "אמינות טובה",
    "close pickup": "איסוף קרוב",
    "strong date fit": "התאמת תאריכים חזקה",
    "high listing quality": "איכות רישום גבוהה",
    "same lender convenience": "נוחות של מלווה אחד",
    "higher price": "מחיר גבוה יותר",
    "weaker lender trust": "אמון נמוך יותר במלווה",
    "spread pickup points": "נקודות איסוף מפוזרות",
    "fragile availability": "זמינות שברירית",
    "one weaker item": "פריט חלש אחד",
    "imbalanced bundle": "חבילה לא מאוזנת",
    "same lender": "מלווה אחד",
    "exact date match": "התאמה מדויקת לתאריכים",
    "tight date fit": "התאמה צרה לתאריכים",
    "budget-friendly": "ידידותי לתקציב",
    "highly rated lenders": "מלווים בדירוג גבוה",
  };
  if (value.endsWith("lenders")) {
    return value.replace("lenders", "מלווים");
  }
  if (value.endsWith("pickup points")) {
    const count = value.split(" ")[0];
    return `${count} נקודות איסוף`;
  }
  return dictionary[value] ?? value;
}

function hashCode(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
