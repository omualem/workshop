"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
const emptySchema = { fields: [] };
const schemas = {
    furniture: {
        fields: [
            { key: "material", type: "string", labelHe: "חומר", labelEn: "Material" },
            {
                key: "foldable",
                type: "boolean",
                labelHe: "מתקפל",
                labelEn: "Foldable",
            },
            {
                key: "capacity",
                type: "number",
                labelHe: "כמות/קיבולת",
                labelEn: "Capacity",
            },
        ],
    },
    dimensions: {
        fields: [
            {
                key: "widthCm",
                type: "number",
                labelHe: "רוחב בס״מ",
                labelEn: "Width Cm",
            },
            {
                key: "heightCm",
                type: "number",
                labelHe: "גובה בס״מ",
                labelEn: "Height Cm",
            },
            {
                key: "indoorOutdoor",
                type: "string",
                labelHe: "פנים/חוץ",
                labelEn: "Indoor/Outdoor",
            },
        ],
    },
    tent: {
        fields: [
            {
                key: "coveredAreaSqm",
                type: "number",
                labelHe: "שטח כיסוי במ״ר",
                labelEn: "Covered Area Sqm",
            },
            {
                key: "waterproof",
                type: "boolean",
                labelHe: "עמיד למים",
                labelEn: "Waterproof",
            },
            {
                key: "setupIncluded",
                type: "boolean",
                labelHe: "כולל הקמה",
                labelEn: "Setup Included",
            },
        ],
    },
    serving: {
        fields: [
            { key: "material", type: "string", labelHe: "חומר", labelEn: "Material" },
            {
                key: "capacity",
                type: "string",
                labelHe: "קיבולת",
                labelEn: "Capacity",
            },
            {
                key: "dishwasherSafe",
                type: "boolean",
                labelHe: "מתאים למדיח",
                labelEn: "Dishwasher Safe",
            },
        ],
    },
    stage: {
        fields: [
            {
                key: "surfaceSqm",
                type: "number",
                labelHe: "שטח במה במ״ר",
                labelEn: "Surface Sqm",
            },
            {
                key: "heightCm",
                type: "number",
                labelHe: "גובה בס״מ",
                labelEn: "Height Cm",
            },
            {
                key: "loadKg",
                type: "number",
                labelHe: "עומס מרבי בק״ג",
                labelEn: "Max Load Kg",
            },
        ],
    },
    lighting: {
        fields: [
            {
                key: "powerWatts",
                type: "number",
                labelHe: "הספק בוואט",
                labelEn: "Power Watts",
            },
            {
                key: "colorTemperature",
                type: "string",
                labelHe: "טמפרטורת צבע",
                labelEn: "Color Temperature",
            },
            {
                key: "dimmable",
                type: "boolean",
                labelHe: "ניתן לעמעום",
                labelEn: "Dimmable",
            },
        ],
    },
    speaker: {
        fields: [
            {
                key: "powerWatts",
                type: "number",
                labelHe: "הספק בוואט",
                labelEn: "Power Watts",
            },
            {
                key: "bluetooth",
                type: "boolean",
                labelHe: "בלוטות׳",
                labelEn: "Bluetooth",
            },
            {
                key: "batteryPowered",
                type: "boolean",
                labelHe: "מופעל סוללה",
                labelEn: "Battery Powered",
            },
        ],
    },
    microphone: {
        fields: [
            {
                key: "wireless",
                type: "boolean",
                labelHe: "אלחוטי",
                labelEn: "Wireless",
            },
            {
                key: "frequencyBand",
                type: "string",
                labelHe: "תחום תדרים",
                labelEn: "Frequency Band",
            },
            {
                key: "kitSize",
                type: "number",
                labelHe: "כמות בערכה",
                labelEn: "Kit Size",
            },
        ],
    },
    mixer: {
        fields: [
            {
                key: "channels",
                type: "number",
                labelHe: "מספר ערוצים",
                labelEn: "Channels",
            },
            {
                key: "digital",
                type: "boolean",
                labelHe: "דיגיטלי",
                labelEn: "Digital",
            },
            {
                key: "effects",
                type: "boolean",
                labelHe: "כולל אפקטים",
                labelEn: "Effects",
            },
        ],
    },
    dj: {
        fields: [
            { key: "brand", type: "string", labelHe: "מותג", labelEn: "Brand" },
            {
                key: "channels",
                type: "number",
                labelHe: "מספר ערוצים",
                labelEn: "Channels",
            },
            {
                key: "software",
                type: "string",
                labelHe: "תוכנה נתמכת",
                labelEn: "Supported Software",
            },
        ],
    },
    camera: {
        fields: [
            { key: "brand", type: "string", labelHe: "מותג", labelEn: "Brand" },
            { key: "sensor", type: "string", labelHe: "חיישן", labelEn: "Sensor" },
            {
                key: "videoResolution",
                type: "string",
                labelHe: "רזולוציית וידאו",
                labelEn: "Video Resolution",
            },
        ],
    },
    lens: {
        fields: [
            { key: "mount", type: "string", labelHe: "תושבת", labelEn: "Mount" },
            {
                key: "focalLength",
                type: "string",
                labelHe: "אורך מוקד",
                labelEn: "Focal Length",
            },
            {
                key: "aperture",
                type: "string",
                labelHe: "מפתח צמצם",
                labelEn: "Aperture",
            },
        ],
    },
    video: {
        fields: [
            {
                key: "resolution",
                type: "string",
                labelHe: "רזולוציה",
                labelEn: "Resolution",
            },
            { key: "inputs", type: "string", labelHe: "כניסות", labelEn: "Inputs" },
            {
                key: "recordingFormat",
                type: "string",
                labelHe: "פורמט הקלטה",
                labelEn: "Recording Format",
            },
        ],
    },
    support: {
        fields: [
            {
                key: "maxLoadKg",
                type: "number",
                labelHe: "משקל נשיאה בק״ג",
                labelEn: "Max Load Kg",
            },
            {
                key: "maxHeightCm",
                type: "number",
                labelHe: "גובה מרבי בס״מ",
                labelEn: "Max Height Cm",
            },
            {
                key: "foldable",
                type: "boolean",
                labelHe: "מתקפל",
                labelEn: "Foldable",
            },
        ],
    },
    projector: {
        fields: [
            {
                key: "lumens",
                type: "number",
                labelHe: "עוצמת הארה",
                labelEn: "Lumens",
            },
            {
                key: "resolution",
                type: "string",
                labelHe: "רזולוציה",
                labelEn: "Resolution",
            },
            {
                key: "inputPorts",
                type: "string",
                labelHe: "חיבורים",
                labelEn: "Input Ports",
            },
        ],
    },
    display: {
        fields: [
            {
                key: "screenSizeInch",
                type: "number",
                labelHe: "גודל מסך באינץ׳",
                labelEn: "Screen Size Inch",
            },
            {
                key: "resolution",
                type: "string",
                labelHe: "רזולוציה",
                labelEn: "Resolution",
            },
            {
                key: "standIncluded",
                type: "boolean",
                labelHe: "כולל מעמד",
                labelEn: "Stand Included",
            },
        ],
    },
    foodMachine: {
        fields: [
            {
                key: "powerWatts",
                type: "number",
                labelHe: "הספק בוואט",
                labelEn: "Power Watts",
            },
            {
                key: "capacity",
                type: "string",
                labelHe: "קיבולת",
                labelEn: "Capacity",
            },
            {
                key: "requiresOperator",
                type: "boolean",
                labelHe: "דורש מפעיל",
                labelEn: "Requires Operator",
            },
        ],
    },
    kitchen: {
        fields: [
            {
                key: "powerSource",
                type: "string",
                labelHe: "מקור אנרגיה",
                labelEn: "Power Source",
            },
            {
                key: "capacity",
                type: "string",
                labelHe: "קיבולת",
                labelEn: "Capacity",
            },
            {
                key: "requiresVentilation",
                type: "boolean",
                labelHe: "דורש אוורור",
                labelEn: "Requires Ventilation",
            },
        ],
    },
    cooling: {
        fields: [
            {
                key: "capacity",
                type: "string",
                labelHe: "קיבולת",
                labelEn: "Capacity",
            },
            {
                key: "powerWatts",
                type: "number",
                labelHe: "הספק בוואט",
                labelEn: "Power Watts",
            },
            {
                key: "temperatureRange",
                type: "string",
                labelHe: "טווח טמפרטורה",
                labelEn: "Temperature Range",
            },
        ],
    },
    climate: {
        fields: [
            {
                key: "powerWatts",
                type: "number",
                labelHe: "הספק בוואט",
                labelEn: "Power Watts",
            },
            {
                key: "coverageSqm",
                type: "number",
                labelHe: "שטח כיסוי במ״ר",
                labelEn: "Coverage Sqm",
            },
            {
                key: "outdoorSuitable",
                type: "boolean",
                labelHe: "מתאים לחוץ",
                labelEn: "Outdoor Suitable",
            },
        ],
    },
    attraction: {
        fields: [
            {
                key: "ageRange",
                type: "string",
                labelHe: "טווח גילאים",
                labelEn: "Age Range",
            },
            {
                key: "operatorRequired",
                type: "boolean",
                labelHe: "דורש מפעיל",
                labelEn: "Operator Required",
            },
            {
                key: "spaceRequiredSqm",
                type: "number",
                labelHe: "שטח נדרש במ״ר",
                labelEn: "Space Required Sqm",
            },
        ],
    },
    generator: {
        fields: [
            {
                key: "powerKw",
                type: "number",
                labelHe: "הספק בקילו-וואט",
                labelEn: "Power Kw",
            },
            {
                key: "fuelType",
                type: "string",
                labelHe: "סוג דלק",
                labelEn: "Fuel Type",
            },
            { key: "quiet", type: "boolean", labelHe: "שקט", labelEn: "Quiet" },
        ],
    },
    electrical: {
        fields: [
            {
                key: "ampRating",
                type: "number",
                labelHe: "זרם באמפר",
                labelEn: "Amp Rating",
            },
            {
                key: "lengthMeters",
                type: "number",
                labelHe: "אורך במטרים",
                labelEn: "Length Meters",
            },
            {
                key: "outdoorRated",
                type: "boolean",
                labelHe: "מתאים לחוץ",
                labelEn: "Outdoor Rated",
            },
        ],
    },
    tool: {
        fields: [
            {
                key: "powerSource",
                type: "string",
                labelHe: "מקור כוח",
                labelEn: "Power Source",
            },
            {
                key: "kitIncluded",
                type: "boolean",
                labelHe: "כולל ערכה",
                labelEn: "Kit Included",
            },
            {
                key: "operatorRequired",
                type: "boolean",
                labelHe: "דורש מפעיל",
                labelEn: "Operator Required",
            },
        ],
    },
    businessDevice: {
        fields: [
            {
                key: "screenSizeInch",
                type: "number",
                labelHe: "גודל מסך באינץ׳",
                labelEn: "Screen Size Inch",
            },
            {
                key: "connectivity",
                type: "string",
                labelHe: "קישוריות",
                labelEn: "Connectivity",
            },
            {
                key: "softwareIncluded",
                type: "boolean",
                labelHe: "כולל תוכנה",
                labelEn: "Software Included",
            },
        ],
    },
    logistics: {
        fields: [
            {
                key: "loadCapacityKg",
                type: "number",
                labelHe: "כושר נשיאה בק״ג",
                labelEn: "Load Capacity Kg",
            },
            {
                key: "dimensions",
                type: "string",
                labelHe: "מידות",
                labelEn: "Dimensions",
            },
            {
                key: "foldable",
                type: "boolean",
                labelHe: "מתקפל",
                labelEn: "Foldable",
            },
        ],
    },
    cleaning: {
        fields: [
            {
                key: "powerWatts",
                type: "number",
                labelHe: "הספק בוואט",
                labelEn: "Power Watts",
            },
            {
                key: "tankCapacity",
                type: "string",
                labelHe: "קיבולת מיכל",
                labelEn: "Tank Capacity",
            },
            {
                key: "industrialGrade",
                type: "boolean",
                labelHe: "תעשייתי",
                labelEn: "Industrial Grade",
            },
        ],
    },
};
const taxonomy = [
    {
        nameEn: "Event Equipment",
        nameHe: "ציוד לאירועים",
        slug: "event-equipment",
        children: [
            {
                nameEn: "Event Furniture",
                nameHe: "ריהוט לאירועים",
                slug: "event-furniture",
            },
            { nameEn: "Tables", nameHe: "שולחנות", slug: "tables" },
            { nameEn: "Chairs", nameHe: "כיסאות", slug: "chairs" },
            { nameEn: "Mobile Bars", nameHe: "ברים ניידים", slug: "mobile-bars" },
            {
                nameEn: "Lounge Seating",
                nameHe: "פינות ישיבה",
                slug: "lounge-seating",
            },
            {
                nameEn: "Tents and Shade",
                nameHe: "אוהלים והצללות",
                slug: "tents-and-shade",
            },
            { nameEn: "Tents", nameHe: "אוהלים", slug: "tents" },
            { nameEn: "Parasols", nameHe: "שמשיות", slug: "parasols" },
            {
                nameEn: "Shade Structures",
                nameHe: "הצללות",
                slug: "shade-structures",
            },
            {
                nameEn: "Serving Equipment",
                nameHe: "ציוד הגשה",
                slug: "serving-equipment",
            },
            { nameEn: "Tableware", nameHe: "כלי אוכל", slug: "tableware" },
            { nameEn: "Food Warmers", nameHe: "מחממי מזון", slug: "food-warmers" },
            { nameEn: "Serving Carts", nameHe: "עגלות הגשה", slug: "serving-carts" },
            {
                nameEn: "Event Structures",
                nameHe: "מתקנים לאירועים",
                slug: "event-structures",
            },
            { nameEn: "Stages", nameHe: "במות", slug: "stages" },
            { nameEn: "Podiums", nameHe: "פודיומים", slug: "podiums" },
            { nameEn: "Carpets", nameHe: "שטיחים", slug: "carpets" },
        ],
    },
    {
        nameEn: "Lighting",
        nameHe: "תאורה",
        slug: "lighting",
        children: [
            {
                nameEn: "Event Lighting",
                nameHe: "תאורת אירועים",
                slug: "event-lighting",
            },
            {
                nameEn: "String Lights",
                nameHe: "שרשראות נורות",
                slug: "string-lights",
            },
            {
                nameEn: "Ambient Lighting",
                nameHe: "תאורת אווירה",
                slug: "ambient-lighting",
            },
            { nameEn: "Uplights", nameHe: "תאורת Uplight", slug: "uplights" },
            { nameEn: "Stage Lighting", nameHe: "תאורת במה", slug: "stage-lighting" },
            { nameEn: "Spotlights", nameHe: "ספוטים", slug: "spotlights" },
            { nameEn: "Moving Heads", nameHe: "Moving Heads", slug: "moving-heads" },
            {
                nameEn: "Photography Lighting",
                nameHe: "תאורת צילום",
                slug: "photography-lighting",
            },
            { nameEn: "Softboxes", nameHe: "Softbox", slug: "softboxes" },
            { nameEn: "LED Panels", nameHe: "פאנלי LED", slug: "led-panels" },
            { nameEn: "Ring Lights", nameHe: "Ring Light", slug: "ring-lights" },
            {
                nameEn: "Lighting Accessories",
                nameHe: "אביזרי תאורה",
                slug: "lighting-accessories",
            },
            {
                nameEn: "Lighting Stands",
                nameHe: "סטנדים לתאורה",
                slug: "lighting-stands",
            },
            {
                nameEn: "Lighting Cables",
                nameHe: "כבלי תאורה",
                slug: "lighting-cables",
            },
            {
                nameEn: "Lighting Controllers",
                nameHe: "בקרי תאורה",
                slug: "lighting-controllers",
            },
        ],
    },
    {
        nameEn: "Sound",
        nameHe: "סאונד",
        slug: "sound",
        children: [
            { nameEn: "Speakers", nameHe: "רמקולים", slug: "speakers" },
            { nameEn: "PA Systems", nameHe: "מערכות הגברה", slug: "pa-systems" },
            { nameEn: "Microphones", nameHe: "מיקרופונים", slug: "microphones" },
            {
                nameEn: "Wireless Microphones",
                nameHe: "מיקרופונים אלחוטיים",
                slug: "wireless-microphones",
            },
            {
                nameEn: "Wired Microphones",
                nameHe: "מיקרופונים חוטיים",
                slug: "wired-microphones",
            },
            { nameEn: "Mixers", nameHe: "מיקסרים", slug: "mixers" },
            { nameEn: "DJ Equipment", nameHe: "ציוד DJ", slug: "dj-equipment" },
            {
                nameEn: "DJ Controllers",
                nameHe: "קונטרולרים",
                slug: "dj-controllers",
            },
            { nameEn: "Turntables", nameHe: "פטיפונים", slug: "turntables" },
            {
                nameEn: "Sound Accessories",
                nameHe: "אביזרי סאונד",
                slug: "sound-accessories",
            },
            {
                nameEn: "Speaker Stands",
                nameHe: "סטנדים לרמקולים",
                slug: "speaker-stands",
            },
            { nameEn: "Audio Cables", nameHe: "כבלי אודיו", slug: "audio-cables" },
        ],
    },
    {
        nameEn: "Photography and Production",
        nameHe: "צילום והפקות",
        slug: "photography-production",
        children: [
            { nameEn: "Cameras", nameHe: "מצלמות", slug: "cameras" },
            { nameEn: "Lenses", nameHe: "עדשות", slug: "lenses" },
            {
                nameEn: "Video Equipment",
                nameHe: "ציוד וידאו",
                slug: "video-equipment",
            },
            { nameEn: "Drones", nameHe: "רחפנים", slug: "drones" },
            { nameEn: "Tripods", nameHe: "חצובות", slug: "tripods" },
            { nameEn: "Gimbals", nameHe: "מייצבים", slug: "gimbals" },
            {
                nameEn: "Backgrounds and Sets",
                nameHe: "רקעים וסטים",
                slug: "backgrounds-and-sets",
            },
        ],
    },
    {
        nameEn: "Projection and Display",
        nameHe: "הקרנה ותצוגה",
        slug: "projection-display",
        children: [
            { nameEn: "Projectors", nameHe: "מקרנים", slug: "projectors" },
            {
                nameEn: "Projection Screens",
                nameHe: "מסכים להקרנה",
                slug: "projection-screens",
            },
            { nameEn: "TVs", nameHe: "טלוויזיות", slug: "tvs" },
            { nameEn: "LED Screens", nameHe: "מסכי LED", slug: "led-screens" },
            {
                nameEn: "Presentation Equipment",
                nameHe: "ציוד מצגות",
                slug: "presentation-equipment",
            },
            { nameEn: "Clickers", nameHe: "שלטי מצגות", slug: "clickers" },
            { nameEn: "Adapters", nameHe: "מתאמים", slug: "adapters" },
        ],
    },
    {
        nameEn: "Music and DJ",
        nameHe: "ציוד DJ ומוזיקה",
        slug: "music-dj",
        children: [
            {
                nameEn: "DJ Controllers",
                nameHe: "קונטרולרים ל-DJ",
                slug: "music-dj-controllers",
            },
            {
                nameEn: "Turntables",
                nameHe: "פטיפונים ל-DJ",
                slug: "music-dj-turntables",
            },
            { nameEn: "DJ Headphones", nameHe: "אוזניות DJ", slug: "dj-headphones" },
            { nameEn: "Consoles", nameHe: "קונסולות", slug: "consoles" },
        ],
    },
    {
        nameEn: "Food and Beverage Equipment",
        nameHe: "ציוד מזון ומשקאות",
        slug: "food-beverage-equipment",
        children: [
            { nameEn: "Food Machines", nameHe: "מכונות מזון", slug: "food-machines" },
            {
                nameEn: "Ice Cream Machines",
                nameHe: "מכונות גלידה",
                slug: "ice-cream-machines",
            },
            {
                nameEn: "Popcorn Machines",
                nameHe: "מכונות פופקורן",
                slug: "popcorn-machines",
            },
            {
                nameEn: "Cotton Candy Machines",
                nameHe: "מכונות צמר גפן מתוק",
                slug: "cotton-candy-machines",
            },
            {
                nameEn: "Waffle Machines",
                nameHe: "מכונות וופל בלגי",
                slug: "waffle-machines",
            },
            {
                nameEn: "Drink Machines",
                nameHe: "מכונות שתייה",
                slug: "drink-machines",
            },
            { nameEn: "Beer Taps", nameHe: "ברזי בירה", slug: "beer-taps" },
            {
                nameEn: "Coffee Machines",
                nameHe: "מכונות קפה",
                slug: "coffee-machines",
            },
            {
                nameEn: "Smoothie Machines",
                nameHe: "מכונות שייקים",
                slug: "smoothie-machines",
            },
            {
                nameEn: "Mobile Kitchen Equipment",
                nameHe: "ציוד מטבח נייד",
                slug: "mobile-kitchen-equipment",
            },
            { nameEn: "Ovens", nameHe: "תנורים", slug: "ovens" },
            { nameEn: "Grills", nameHe: "גרילים", slug: "grills" },
            { nameEn: "Cooktops", nameHe: "כיריים", slug: "cooktops" },
            {
                nameEn: "Cooling Equipment",
                nameHe: "ציוד קירור",
                slug: "cooling-equipment",
            },
            { nameEn: "Refrigerators", nameHe: "מקררים", slug: "refrigerators" },
            { nameEn: "Freezers", nameHe: "מקפיאים", slug: "freezers" },
        ],
    },
    {
        nameEn: "Cooling and Heating",
        nameHe: "קירור וחימום",
        slug: "cooling-heating",
        children: [
            {
                nameEn: "Portable Air Conditioners",
                nameHe: "מזגנים ניידים",
                slug: "portable-air-conditioners",
            },
            { nameEn: "Space Heaters", nameHe: "מפזרי חום", slug: "space-heaters" },
            {
                nameEn: "Outdoor Heaters",
                nameHe: "תנורי חוץ",
                slug: "outdoor-heaters",
            },
            { nameEn: "Fans", nameHe: "מאווררים", slug: "fans" },
        ],
    },
    {
        nameEn: "Attractions and Special Events",
        nameHe: "אטרקציות ואירועים מיוחדים",
        slug: "attractions-special-events",
        children: [
            { nameEn: "Inflatables", nameHe: "מתנפחים", slug: "inflatables" },
            { nameEn: "Game Tables", nameHe: "שולחנות משחק", slug: "game-tables" },
            {
                nameEn: "Foosball Tables",
                nameHe: "שולחנות כדורגל",
                slug: "foosball-tables",
            },
            {
                nameEn: "Air Hockey Tables",
                nameHe: "שולחנות הוקי",
                slug: "air-hockey-tables",
            },
            { nameEn: "Simulators", nameHe: "סימולטורים", slug: "simulators" },
            { nameEn: "Photo Booths", nameHe: "עמדות צילום", slug: "photo-booths" },
            { nameEn: "Karaoke", nameHe: "קריוקי", slug: "karaoke" },
        ],
    },
    {
        nameEn: "Setup and Production Equipment",
        nameHe: "ציוד הקמה והפקה",
        slug: "setup-production-equipment",
        children: [
            { nameEn: "Generators", nameHe: "גנרטורים", slug: "generators" },
            { nameEn: "Power Cables", nameHe: "כבלים וחשמל", slug: "power-cables" },
            {
                nameEn: "Electrical Boards",
                nameHe: "לוחות חשמל",
                slug: "electrical-boards",
            },
            {
                nameEn: "Lifting Equipment",
                nameHe: "ציוד הרמה",
                slug: "lifting-equipment",
            },
            { nameEn: "Barriers", nameHe: "מחסומים", slug: "barriers" },
            { nameEn: "Tools", nameHe: "כלים", slug: "tools" },
        ],
    },
    {
        nameEn: "Business Digital Equipment",
        nameHe: "ציוד דיגיטלי לעסקים",
        slug: "business-digital-equipment",
        children: [
            { nameEn: "Kiosk Stands", nameHe: "עמדות קיוסק", slug: "kiosk-stands" },
            { nameEn: "Tablets", nameHe: "טאבלטים", slug: "tablets" },
            { nameEn: "Laptops", nameHe: "מחשבים ניידים", slug: "laptops" },
            { nameEn: "Touch Screens", nameHe: "מסכי מגע", slug: "touch-screens" },
            { nameEn: "POS Systems", nameHe: "מערכות POS", slug: "pos-systems" },
            { nameEn: "Scanners", nameHe: "סורקים", slug: "scanners" },
        ],
    },
    {
        nameEn: "Logistics and Transport",
        nameHe: "לוגיסטיקה והובלה",
        slug: "logistics-transport",
        children: [
            { nameEn: "Carts", nameHe: "עגלות", slug: "carts" },
            { nameEn: "Pallets", nameHe: "משטחים", slug: "pallets" },
            {
                nameEn: "Packing Equipment",
                nameHe: "ציוד אריזה",
                slug: "packing-equipment",
            },
            { nameEn: "Tie Straps", nameHe: "רצועות קשירה", slug: "tie-straps" },
        ],
    },
    {
        nameEn: "Cleaning and Maintenance",
        nameHe: "ניקיון ותחזוקה",
        slug: "cleaning-maintenance",
        children: [
            {
                nameEn: "Pressure Washers",
                nameHe: "מכונות שטיפה",
                slug: "pressure-washers",
            },
            {
                nameEn: "Industrial Vacuums",
                nameHe: "שואבי אבק תעשייתיים",
                slug: "industrial-vacuums",
            },
            {
                nameEn: "Cleaning Equipment",
                nameHe: "ציוד ניקיון",
                slug: "cleaning-equipment",
            },
        ],
    },
];
const adminNames = [
    "נועה מנהלת",
    "אורי מנהל",
    "דנה בקרת איכות",
    "יואב תפעול",
    "מיכל תמיכה",
    "רועי מערכת",
    "תמר קטלוג",
    "איילת אמון",
    "גיא בקרה",
    "שירה אדמין",
];
const renterNames = [
    "דנה כהן",
    "יואב לוי",
    "מיכל אברהם",
    "תמר ברק",
    "איתי שחר",
    "שירה מזרחי",
    "רועי גולן",
    "נועה פרידמן",
    "אלון ביטון",
    "יעל רוזן",
];
const lenderNames = [
    "אורי ציוד לאירועים",
    "נועה הפקות",
    "דניאל סאונד ותאורה",
    "EventPro Rentals",
    "השכרות במה ותאורה",
    "מרכז ציוד למסיבות",
    "הפקות תל אביב",
    "ציוד שטח ישראל",
    "Rental Lab",
    "סאונד פלוס",
];
const demoUsers = [
    ...adminNames.map((fullName, index) => ({
        email: `admin${index + 1}@rentmatch.local`,
        fullName,
        role: client_1.UserRole.ADMIN,
        phone: makeSeedPhone(100, index),
    })),
    ...renterNames.map((fullName, index) => ({
        email: `renter${index + 1}@rentmatch.local`,
        fullName,
        role: client_1.UserRole.RENTER,
        phone: makeSeedPhone(200, index),
    })),
    ...lenderNames.map((fullName, index) => ({
        email: `lender${index + 1}@rentmatch.local`,
        fullName,
        role: client_1.UserRole.LENDER,
        phone: makeSeedPhone(300, index),
    })),
];
async function main() {
    await resetProductData();
    await resetIdentityData();
    const passwordHash = await argon2.hash("Password123!");
    const users = await upsertDemoUsers(passwordHash);
    await insertTaxonomy();
    const [usersCount, lendersCount, rentersCount, categoriesCount, listingsCount,] = await Promise.all([
        prisma.user.count(),
        prisma.lenderProfile.count(),
        prisma.renterProfile.count(),
        prisma.category.count(),
        prisma.listing.count(),
    ]);
    console.log("Seed complete");
    console.log(`users count: ${usersCount}`);
    console.log(`lenders count: ${lendersCount}`);
    console.log(`renters count: ${rentersCount}`);
    console.log(`categories count: ${categoriesCount}`);
    console.log(`listings count: ${listingsCount}`);
}
async function resetProductData() {
    await prisma.$transaction([
        prisma.notification.deleteMany({
            where: {
                type: {
                    in: [
                        client_1.NotificationType.BOOKING,
                        client_1.NotificationType.BUNDLE_RESULT,
                        client_1.NotificationType.REVIEW,
                    ],
                },
            },
        }),
        prisma.auditLog.deleteMany({
            where: {
                entityType: {
                    in: [
                        "Listing",
                        "ListingBatch",
                        "Booking",
                        "BookingItem",
                        "Review",
                        "Favorite",
                        "SavedSearch",
                        "Dispute",
                    ],
                },
            },
        }),
        prisma.paymentIntentPlaceholder.deleteMany(),
        prisma.dispute.deleteMany(),
        prisma.review.deleteMany(),
        prisma.bookingItem.deleteMany(),
        prisma.booking.deleteMany(),
        prisma.favorite.deleteMany(),
        prisma.savedSearch.deleteMany(),
        prisma.listingMedia.deleteMany(),
        prisma.listingAttributeValue.deleteMany(),
        prisma.listingAvailabilityBlock.deleteMany(),
        prisma.pricingRule.deleteMany(),
        prisma.deliveryWindow.deleteMany(),
        prisma.listing.deleteMany(),
    ]);
    await deleteCategoriesByDepth();
}
async function resetIdentityData() {
    await prisma.$transaction([
        prisma.notification.deleteMany(),
        prisma.auditLog.deleteMany(),
        prisma.refreshSession.deleteMany(),
        prisma.renterProfile.deleteMany(),
        prisma.lenderProfile.deleteMany(),
        prisma.user.deleteMany(),
    ]);
}
async function deleteCategoriesByDepth() {
    for (let depth = 0; depth < 10; depth += 1) {
        const childIds = await prisma.category.findMany({
            where: {
                children: {
                    none: {},
                },
            },
            select: {
                id: true,
            },
        });
        if (childIds.length === 0) {
            return;
        }
        await prisma.category.deleteMany({
            where: {
                id: {
                    in: childIds.map((category) => category.id),
                },
            },
        });
        const remaining = await prisma.category.count();
        if (remaining === 0) {
            return;
        }
    }
    throw new Error("Unable to delete category tree safely");
}
async function upsertDemoUsers(passwordHash) {
    const userIds = new Map();
    for (const demoUser of demoUsers) {
        const user = await prisma.user.upsert({
            where: { email: demoUser.email },
            update: {
                fullName: demoUser.fullName,
                phone: demoUser.phone,
                role: demoUser.role,
                passwordHash,
                status: client_1.UserStatus.ACTIVE,
                locale: "he",
            },
            create: {
                email: demoUser.email,
                fullName: demoUser.fullName,
                phone: demoUser.phone,
                role: demoUser.role,
                passwordHash,
                status: client_1.UserStatus.ACTIVE,
                locale: "he",
            },
        });
        userIds.set(demoUser.email, user.id);
    }
    const renterEmails = demoUsers
        .filter((user) => user.role === client_1.UserRole.RENTER)
        .map((user) => user.email);
    for (const email of renterEmails) {
        await prisma.renterProfile.upsert({
            where: { userId: userIds.get(email) },
            update: {
                defaultAddressText: "תל אביב",
                defaultLocationLat: 32.0853,
                defaultLocationLng: 34.7818,
                verificationStatus: client_1.VerificationStatus.VERIFIED,
                preferences: {
                    locale: "he",
                    emptyCatalogReady: true,
                },
            },
            create: {
                userId: userIds.get(email),
                defaultAddressText: "תל אביב",
                defaultLocationLat: 32.0853,
                defaultLocationLng: 34.7818,
                verificationStatus: client_1.VerificationStatus.VERIFIED,
                preferences: {
                    locale: "he",
                    emptyCatalogReady: true,
                },
            },
        });
    }
    const lenders = lenderNames.map((displayName, index) => ({
        email: `lender${index + 1}@rentmatch.local`,
        displayName,
        featured: index < 3,
    }));
    for (const lender of lenders) {
        await prisma.lenderProfile.upsert({
            where: { userId: userIds.get(lender.email) },
            update: {
                displayName: lender.displayName,
                bio: "פרופיל בדיקה ללא מוצרים. ניתן להוסיף ציוד אמיתי אחרי איפוס הקטלוג.",
                verificationLevel: client_1.VerificationLevel.VERIFIED,
                isFeatured: lender.featured,
                averageRating: 0,
                completedTransactionsCount: 0,
                cancellationRate: 0,
                lateReturnRate: 0,
                complaintRate: 0,
                responseTimeScore: 5,
                reliabilityScoreCached: 0,
                pickupAreaGeo: {
                    city: "תל אביב",
                },
            },
            create: {
                userId: userIds.get(lender.email),
                displayName: lender.displayName,
                bio: "פרופיל בדיקה ללא מוצרים. ניתן להוסיף ציוד אמיתי אחרי איפוס הקטלוג.",
                verificationLevel: client_1.VerificationLevel.VERIFIED,
                isFeatured: lender.featured,
                averageRating: 0,
                completedTransactionsCount: 0,
                cancellationRate: 0,
                lateReturnRate: 0,
                complaintRate: 0,
                responseTimeScore: 5,
                reliabilityScoreCached: 0,
                pickupAreaGeo: {
                    city: "תל אביב",
                },
            },
        });
    }
    return {
        adminId: userIds.get("admin1@rentmatch.local"),
    };
}
function makeSeedPhone(prefix, index) {
    return `050${prefix}${String(index + 1).padStart(4, "0")}`;
}
async function insertTaxonomy() {
    for (const parent of taxonomy) {
        const createdParent = await prisma.category.create({
            data: {
                slug: parent.slug,
                nameHe: parent.nameHe,
                nameEn: parent.nameEn,
                status: client_1.CategoryStatus.ACTIVE,
                attributesSchema: schemaFor(parent.slug),
            },
        });
        for (const child of parent.children ?? []) {
            await prisma.category.create({
                data: {
                    parentId: createdParent.id,
                    slug: child.slug,
                    nameHe: child.nameHe,
                    nameEn: child.nameEn,
                    status: client_1.CategoryStatus.ACTIVE,
                    attributesSchema: schemaFor(child.slug),
                },
            });
        }
    }
}
function schemaFor(slug) {
    if ([
        "event-furniture",
        "tables",
        "chairs",
        "mobile-bars",
        "lounge-seating",
        "carpets",
    ].includes(slug)) {
        return schemas.furniture;
    }
    if ([
        "event-structures",
        "podiums",
        "backgrounds-and-sets",
        "projection-screens",
    ].includes(slug)) {
        return schemas.dimensions;
    }
    if (["tents-and-shade", "tents", "parasols", "shade-structures"].includes(slug)) {
        return schemas.tent;
    }
    if ([
        "serving-equipment",
        "tableware",
        "food-warmers",
        "serving-carts",
    ].includes(slug)) {
        return schemas.serving;
    }
    if (["stages"].includes(slug)) {
        return schemas.stage;
    }
    if ([
        "lighting",
        "event-lighting",
        "string-lights",
        "ambient-lighting",
        "uplights",
        "stage-lighting",
        "spotlights",
        "moving-heads",
        "photography-lighting",
        "softboxes",
        "led-panels",
        "ring-lights",
        "lighting-accessories",
        "lighting-stands",
        "lighting-cables",
        "lighting-controllers",
    ].includes(slug)) {
        return schemas.lighting;
    }
    if (["speakers", "pa-systems"].includes(slug)) {
        return schemas.speaker;
    }
    if (["microphones", "wireless-microphones", "wired-microphones"].includes(slug)) {
        return schemas.microphone;
    }
    if (["mixers"].includes(slug)) {
        return schemas.mixer;
    }
    if ([
        "dj-equipment",
        "dj-controllers",
        "music-dj",
        "music-dj-controllers",
        "turntables",
        "music-dj-turntables",
        "dj-headphones",
        "consoles",
    ].includes(slug)) {
        return schemas.dj;
    }
    if (["cameras", "drones"].includes(slug)) {
        return schemas.camera;
    }
    if (["lenses"].includes(slug)) {
        return schemas.lens;
    }
    if (["video-equipment", "gimbals"].includes(slug)) {
        return schemas.video;
    }
    if (["tripods", "speaker-stands"].includes(slug)) {
        return schemas.support;
    }
    if (["projectors", "presentation-equipment", "clickers", "adapters"].includes(slug)) {
        return schemas.projector;
    }
    if (["tvs", "led-screens"].includes(slug)) {
        return schemas.display;
    }
    if ([
        "food-machines",
        "ice-cream-machines",
        "popcorn-machines",
        "cotton-candy-machines",
        "waffle-machines",
        "drink-machines",
        "beer-taps",
        "coffee-machines",
        "smoothie-machines",
    ].includes(slug)) {
        return schemas.foodMachine;
    }
    if (["mobile-kitchen-equipment", "ovens", "grills", "cooktops"].includes(slug)) {
        return schemas.kitchen;
    }
    if (["cooling-equipment", "refrigerators", "freezers"].includes(slug)) {
        return schemas.cooling;
    }
    if ([
        "cooling-heating",
        "portable-air-conditioners",
        "space-heaters",
        "outdoor-heaters",
        "fans",
    ].includes(slug)) {
        return schemas.climate;
    }
    if ([
        "attractions-special-events",
        "inflatables",
        "game-tables",
        "foosball-tables",
        "air-hockey-tables",
        "simulators",
        "photo-booths",
        "karaoke",
    ].includes(slug)) {
        return schemas.attraction;
    }
    if (["generators"].includes(slug)) {
        return schemas.generator;
    }
    if (["power-cables", "electrical-boards", "audio-cables"].includes(slug)) {
        return schemas.electrical;
    }
    if (["lifting-equipment", "barriers", "tools"].includes(slug)) {
        return schemas.tool;
    }
    if ([
        "business-digital-equipment",
        "kiosk-stands",
        "tablets",
        "laptops",
        "touch-screens",
        "pos-systems",
        "scanners",
    ].includes(slug)) {
        return schemas.businessDevice;
    }
    if ([
        "logistics-transport",
        "carts",
        "pallets",
        "packing-equipment",
        "tie-straps",
    ].includes(slug)) {
        return schemas.logistics;
    }
    if ([
        "cleaning-maintenance",
        "pressure-washers",
        "industrial-vacuums",
        "cleaning-equipment",
    ].includes(slug)) {
        return schemas.cleaning;
    }
    return emptySchema;
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map