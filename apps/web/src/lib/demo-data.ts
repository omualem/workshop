export const demoCategories = [
  {
    id: "demo-category-sound",
    slug: "sound",
    nameHe: "סאונד",
    nameEn: "Sound",
    children: [
      {
        id: "demo-category-speakers",
        slug: "speakers",
        nameHe: "רמקולים",
        nameEn: "Speakers",
        children: [],
      },
    ],
  },
  {
    id: "demo-category-projection",
    slug: "projection-display",
    nameHe: "הקרנה ותצוגה",
    nameEn: "Projection and Display",
    children: [],
  },
];

export const demoListings = [
  {
    id: "listing-1",
    titleHe: "רמקול מוגבר JBL לאירועים",
    titleEn: "JBL Powered Event Speaker",
    descriptionHe:
      "רמקול מוגבר איכותי שמתאים לאירועים קטנים ובינוניים, הרצאות, מסיבות וימי הולדת.",
    descriptionEn:
      "Powered speaker for small and medium events, talks, parties, and birthdays.",
    basePriceDaily: 180,
    depositAmount: 500,
    lender: {
      displayName: "EventPro Rentals",
      averageRating: 4.8,
      completedTransactionsCount: 96,
    },
    category: { nameHe: "רמקולים" },
    media: [],
  },
  {
    id: "listing-2",
    titleHe: "מקרן Full HD לאירועים",
    titleEn: "Full HD Event Projector",
    descriptionHe: "מקרן נייד למצגות, הקרנות ואירועים עסקיים.",
    descriptionEn:
      "Portable projector for presentations, screenings, and business events.",
    basePriceDaily: 220,
    depositAmount: 700,
    lender: {
      displayName: "Rental Lab",
      averageRating: 4.7,
      completedTransactionsCount: 48,
    },
    category: { nameHe: "מקרנים" },
    media: [],
  },
];

export const demoListing = {
  id: "listing-1",
  titleHe: "רמקול מוגבר JBL לאירועים",
  titleEn: "JBL Powered Event Speaker",
  descriptionHe:
    "רמקול מוגבר איכותי שמתאים לאירועים קטנים ובינוניים, הרצאות, מסיבות וימי הולדת.",
  descriptionEn:
    "Powered speaker for small and medium events, talks, parties, and birthdays.",
  suitableFor: "אירועים פרטיים, הרצאות, מסיבות קטנות, ימי הולדת",
  mainUses: "השמעת מוזיקה, הגברה לדיבור, קריוקי בסיסי",
  basePriceDaily: 180,
  depositAmount: 500,
  minRentalDays: 1,
  maxRentalDays: 7,
  deliverySupported: true,
  city: "תל אביב",
  pickupAddressText: "צפון תל אביב",
  pickupInstructions: "איסוף מצפון תל אביב, אפשרות משלוח בתיאום מראש",
  includedItems: ["רמקול מוגבר JBL", "סטנד לרמקול", "כבל חשמל", "כבל AUX"],
  cancellationPolicy: "ביטול עד 24 שעות לפני מועד ההשכרה ללא חיוב",
  returnTerms: "יש להחזיר את הפריט עם כל האביזרים שסופקו ובאריזה המקורית אם קיימת",
  requiresOperator: false,
  setupRequired: false,
  category: {
    nameHe: "רמקולים",
    breadcrumb: [
      { id: "sound", nameHe: "סאונד", nameEn: "Sound", slug: "sound" },
      {
        id: "speakers",
        nameHe: "רמקולים",
        nameEn: "Speakers",
        slug: "speakers",
      },
    ],
  },
  lender: {
    displayName: "EventPro Rentals",
    averageRating: 4.8,
    completedTransactionsCount: 96,
    reliabilitySummary: "אמינות גבוהה",
    responseScore: 96,
    deliveryWindows: [],
  },
  media: [],
  attributeValues: [
    { attributeKey: "powerWatts", labelHe: "הספק", value: "1000W" },
    { attributeKey: "bluetooth", labelHe: "Bluetooth", value: "כן" },
    { attributeKey: "batteryPowered", labelHe: "מופעל סוללה", value: "לא" },
    { attributeKey: "inputPorts", labelHe: "כניסות", value: "XLR, AUX, USB" },
  ],
  pricingRules: [],
  reviews: [
    {
      id: "review-1",
      rating: 5,
      text: "ציוד שמור, תקשורת מעולה ואיסוף מהיר.",
      reviewer: { fullName: "נועה כהן" },
    },
  ],
};

export const demoBundleResults = {
  searchId: "demo-search",
  requestedItems: [
    { slotKey: "speaker", quantity: 1 },
    { slotKey: "projector", quantity: 1 },
  ],
  topRankedBundles: [
    {
      id: "bundle-1",
      label: "best-balanced",
      overallScore: 8.8,
      scores: {
        price: 7.4,
        reliability: 9.1,
        logistics: 8.5,
        availability: 8.7,
        quality: 9.0,
        stability: 8.8,
      },
      explanation: {
        he: {
          title: "האפשרות המאוזנת ביותר",
          subtitle: "₪400, נקודת איסוף אחת, התאמה מלאה לתאריכים",
          strengths: ["מלווה אמין", "איסוף פשוט"],
          tradeoffs: ["מחיר ביניים ביחס לשוק"],
        },
        chips: [
          "highly rated lender",
          "single pickup point",
          "exact date match",
        ],
      },
      pickupPointsCount: 1,
      totalEstimatedDistanceKm: 4.8,
      totalBundlePrice: 400,
      exactAvailabilityFit: true,
      includedItems: [
        {
          slotKey: "speaker",
          listingId: "listing-1",
          listingTitleHe: "רמקול מוגבר JBL לאירועים",
          categoryNameHe: "רמקולים",
        },
      ],
    },
  ],
  alternateBundles: [],
  labels: {
    bestBalanced: "bundle-1",
    bestPrice: "bundle-1",
    easiestPickup: "bundle-1",
  },
  observability: {
    timings: {
      candidateFetchMs: 42,
      bundleGenerationMs: 13,
      scoringMs: 7,
    },
  },
};
