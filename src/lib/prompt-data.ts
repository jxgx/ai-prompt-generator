// ──────────────────────────────────────────────
// Random Prompt Generator — Master Data File
// All models, scenes, attributes, and quality configs
// ──────────────────────────────────────────────

// ─── Model Configurations ─────────────────────

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  qualityTags: string[];
  negativePrompts: string[];
  promptStyle: "danbooru" | "natural" | "pony" | "illustrious" | "chroma" | "zimage";
  supportsWeighting: boolean;
  defaultSteps: number;
  defaultCfg: number;
  defaultSampler: string;
  tagSeparator: string;
  prependQuality: boolean; // quality tags go first or last
  supportsNsfw: boolean;
  specialNotes: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: "sdxl",
    name: "SDXL",
    description: "Stable Diffusion XL — versatile, natural language or tags",
    qualityTags: [
      "masterpiece", "best quality", "highly detailed",
      "8k resolution", "professional photography", "sharp focus",
      "cinematic lighting", "depth of field", "bokeh",
    ],
    negativePrompts: [
      "worst quality", "low quality", "normal quality", "lowres",
      "blurry", "jpeg artifacts", "cropped", "watermark", "text",
      "signature", "username", "deformed", "disfigured", "bad anatomy",
      "bad proportions", "extra limbs", "cloned face",
    ],
    promptStyle: "natural",
    supportsWeighting: true,
    defaultSteps: 30,
    defaultCfg: 7,
    defaultSampler: "DPM++ 2M Karras",
    tagSeparator: ", ",
    prependQuality: false,
    supportsNsfw: true,
    specialNotes: "Works best with natural language descriptions. Supports both tag and sentence format.",
  },
  {
    id: "sd15",
    name: "SD 1.5",
    description: "Stable Diffusion 1.5 — classic Danbooru tag format",
    qualityTags: [
      "masterpiece", "best quality", "highres", "ultra-detailed",
      "absurdres", "intricate detail",
    ],
    negativePrompts: [
      "lowres", "bad anatomy", "bad hands", "text", "error",
      "missing fingers", "extra digit", "fewer digits", "cropped",
      "worst quality", "low quality", "normal quality", "jpeg artifacts",
      "signature", "watermark", "username", "blurry", "deformed",
      "mutated hands", "poorly drawn hands", "extra limbs",
      "fused fingers", "too many fingers", "long neck",
    ],
    promptStyle: "danbooru",
    supportsWeighting: true,
    defaultSteps: 28,
    defaultCfg: 7.5,
    defaultSampler: "Euler a",
    tagSeparator: ", ",
    prependQuality: true,
    supportsNsfw: true,
    specialNotes: "Use Danbooru-style tags separated by commas. Emphasize quality tags with (tag:1.2).",
  },
  {
    id: "pony",
    name: "FluxPony (Pony V6 XL)",
    description: "Pony Diffusion V6 XL — anime-focused, uses score rating system",
    qualityTags: [
      "score_9", "score_8_up", "score_7_up",
      "source_anime", "absurdres", "highres",
    ],
    negativePrompts: [
      "score_6", "score_5", "score_4",
      "source_pony", "source_furry",
      "3d", "ugly", "bad anatomy", "bad hands",
      "poorly drawn", "mutated", "deformed", "extra limbs",
      "bad proportions", "cloned face", "disfigured",
    ],
    promptStyle: "pony",
    supportsWeighting: true,
    defaultSteps: 25,
    defaultCfg: 7,
    defaultSampler: "DPM++ 2M Karras",
    tagSeparator: ", ",
    prependQuality: true,
    supportsNsfw: true,
    specialNotes: "Always start with score_9, score_8_up, score_7_up. Use source_anime for anime style. For realism: source_cartoon, source_3d, etc.",
  },
  {
    id: "illustrious",
    name: "Illustrious XL",
    description: "Illustrious XL — high-quality anime illustration model",
    qualityTags: [
      "masterpiece", "best quality", "very aesthetic", "absurdres",
      "highres", "newest", "ultra-detailed",
    ],
    negativePrompts: [
      "lowres", "bad anatomy", "bad hands", "text", "error",
      "worst quality", "low quality", "jpeg artifacts",
      "blurry", "deformed", "disfigured", "extra limbs",
      "bad proportions", "mutated hands", "missing fingers",
      "poorly drawn face", "bad face",
    ],
    promptStyle: "illustrious",
    supportsWeighting: true,
    defaultSteps: 25,
    defaultCfg: 6,
    defaultSampler: "DPM++ 2M Karras",
    tagSeparator: ", ",
    prependQuality: true,
    supportsNsfw: true,
    specialNotes: "Anime-optimized. Use aesthetic tags and detailed character descriptions. Works well with long prompts.",
  },
  {
    id: "chroma",
    name: "Chroma",
    description: "Chroma — vibrant, colorful artistic model",
    qualityTags: [
      "masterpiece", "best quality", "highly detailed",
      "vibrant colors", "rich colors", "colorful",
      "professional", "sharp focus", "detailed lighting",
    ],
    negativePrompts: [
      "worst quality", "low quality", "normal quality",
      "lowres", "blurry", "jpeg artifacts", "cropped",
      "watermark", "text", "signature", "deformed",
      "disfigured", "bad anatomy", "extra limbs",
      "bad proportions", "dull colors", "monochrome",
    ],
    promptStyle: "chroma",
    supportsWeighting: true,
    defaultSteps: 28,
    defaultCfg: 7,
    defaultSampler: "DPM++ SDE Karras",
    tagSeparator: ", ",
    prependQuality: false,
    supportsNsfw: true,
    specialNotes: "Excels with vibrant color descriptions. Include color-related tags for best results.",
  },
  {
    id: "zimage",
    name: "Z-Image",
    description: "Z-Image — Z.ai proprietary image model",
    qualityTags: [
      "masterpiece", "best quality", "high resolution",
      "detailed", "professional", "sharp", "highly detailed",
    ],
    negativePrompts: [
      "low quality", "blurry", "deformed", "bad anatomy",
      "extra limbs", "watermark", "text", "cropped",
      "worst quality", "jpeg artifacts", "signature",
      "disfigured", "bad proportions", "missing fingers",
      "bad hands", "poorly drawn",
    ],
    promptStyle: "natural",
    supportsWeighting: false,
    defaultSteps: 30,
    defaultCfg: 7.5,
    defaultSampler: "DPM++ 2M Karras",
    tagSeparator: ", ",
    prependQuality: false,
    supportsNsfw: true,
    specialNotes: "Natural language descriptions work best. Focus on clear, descriptive language.",
  },
  {
    id: "xlporn",
    name: "XL Porn",
    description: "XL Porn — adult-oriented generation model",
    qualityTags: [
      "masterpiece", "best quality", "highly detailed",
      "realistic", "photorealistic", "8k", "raw photo",
      "professional photography", "sharp focus",
      "detailed skin texture", "natural lighting",
    ],
    negativePrompts: [
      "worst quality", "low quality", "normal quality", "lowres",
      "blurry", "jpeg artifacts", "cropped", "watermark", "text",
      "signature", "deformed", "disfigured", "bad anatomy",
      "bad proportions", "extra limbs", "bad hands",
      "mutated", "ugly", "cartoon", "anime", "3d render",
      "plastic skin", "doll-like", "uncanny valley",
    ],
    promptStyle: "natural",
    supportsWeighting: true,
    defaultSteps: 30,
    defaultCfg: 7,
    defaultSampler: "DPM++ 2M Karras",
    tagSeparator: ", ",
    prependQuality: false,
    supportsNsfw: true,
    specialNotes: "Optimized for realistic adult content. Use natural language with detailed physical descriptions.",
  },
];

// ─── Scene / Theme Data ───────────────────────

export interface Scene {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  lighting?: string[];
  mood?: string[];
}

export const SCENE_CATEGORIES = [
  "Indoor",
  "Outdoor",
  "Fantasy",
  "Sci-Fi",
  "Historical",
  "Water",
  "Urban",
  "Intimate",
] as const;

export type SceneCategory = (typeof SCENE_CATEGORIES)[number];

export const SCENES: Scene[] = [
  // ── Indoor ──
  { id: "bedroom", name: "Bedroom", description: "Private bedroom setting", tags: ["bedroom", "bed", "pillows", "sheets"], category: "Indoor", lighting: ["warm lighting", "soft lamp light"], mood: ["intimate", "cozy"] },
  { id: "living-room", name: "Living Room", description: "Spacious living area", tags: ["living room", "sofa", "couch", "coffee table"], category: "Indoor", lighting: ["natural window light", "warm interior lighting"], mood: ["relaxed", "domestic"] },
  { id: "kitchen", name: "Kitchen", description: "Modern or rustic kitchen", tags: ["kitchen", "counter", "stove", "marble countertops"], category: "Indoor", lighting: ["bright overhead lighting", "under-cabinet lighting"], mood: ["domestic", "casual"] },
  { id: "bathroom", name: "Bathroom", description: "Luxurious bathroom", tags: ["bathroom", "bathtub", "shower", "mirror", "marble tiles"], category: "Indoor", lighting: ["soft candlelight", "steam", "backlit mirror"], mood: ["sensual", "relaxing"] },
  { id: "office", name: "Office", description: "Professional workspace", tags: ["office", "desk", "computer", "office chair", "documents"], category: "Indoor", lighting: ["fluorescent lighting", "monitor glow"], mood: ["professional", "focused"] },
  { id: "gym", name: "Gym", description: "Fitness center", tags: ["gym", "exercise equipment", "weights", "mirrors"], category: "Indoor", lighting: ["harsh overhead lighting", "spotlights"], mood: ["energetic", "powerful"] },
  { id: "library", name: "Library", description: "Grand library with bookshelves", tags: ["library", "bookshelves", "books", "reading nook", "ladder"], category: "Indoor", lighting: ["warm reading lamp", "dusty sunlight through windows"], mood: ["intellectual", "quiet"] },
  { id: "studio", name: "Art Studio", description: "Creative art space", tags: ["art studio", "easel", "canvas", "paint", "sketches"], category: "Indoor", lighting: ["north light", "natural studio lighting"], mood: ["creative", "artistic"] },
  { id: "dungeon", name: "Dungeon", description: "Dark medieval dungeon", tags: ["dungeon", "stone walls", "chains", "torches", "iron bars"], category: "Indoor", lighting: ["torchlight", "dim shadows", "flickering light"], mood: ["dark", "mysterious"] },
  { id: "nightclub", name: "Nightclub", description: "Vibrant nightlife venue", tags: ["nightclub", "dance floor", "DJ booth", "neon lights", "bar"], category: "Indoor", lighting: ["strobe lights", "neon glow", "laser lights", "UV blacklight"], mood: ["energetic", "wild"] },
  { id: "hotel-room", name: "Hotel Room", description: "Luxury hotel suite", tags: ["hotel room", "king bed", "city view window", "minibar"], category: "Indoor", lighting: ["ambient mood lighting", "city lights through window"], mood: ["luxurious", "romantic"] },
  { id: "spa", name: "Spa", description: "Relaxing spa environment", tags: ["spa", "massage table", "candles", "bamboo", "incense"], category: "Indoor", lighting: ["soft candlelight", "diffused natural light"], mood: ["serene", "peaceful"] },
  { id: "restaurant", name: "Restaurant", description: "Upscale dining", tags: ["restaurant", "table setting", "wine glasses", "candles"], category: "Indoor", lighting: ["candlelight", "chandelier"], mood: ["romantic", "elegant"] },
  { id: "warehouse", name: "Warehouse", description: "Industrial warehouse", tags: ["warehouse", "concrete floor", "shelving units", "industrial"], category: "Indoor", lighting: ["harsh overhead lights", "single bare bulb"], mood: ["gritty", "raw"] },
  { id: "casino", name: "Casino", description: "Glittering casino floor", tags: ["casino", "slot machines", "card table", "chips", "roulette"], category: "Indoor", lighting: ["bright casino lights", "colorful neon"], mood: ["exciting", "glamorous"] },

  // ── Outdoor ──
  { id: "beach", name: "Beach", description: "Sandy beach at the ocean", tags: ["beach", "sand", "ocean waves", "palm trees", "tropical"], category: "Outdoor", lighting: ["golden hour", "sunrise", "sunset"], mood: ["relaxed", "tropical"] },
  { id: "forest", name: "Forest", description: "Dense woodland", tags: ["forest", "trees", "moss", "sunbeams through canopy", "fallen leaves"], category: "Outdoor", lighting: ["dappled sunlight", "ethereal forest light"], mood: ["mystical", "peaceful"] },
  { id: "mountain", name: "Mountain", description: "Mountain peak or trail", tags: ["mountain", "snow caps", "rocky terrain", "cliff edge", "clouds below"], category: "Outdoor", lighting: ["dramatic sunlight", "alpine glow"], mood: ["majestic", "adventurous"] },
  { id: "park", name: "Park", description: "City or nature park", tags: ["park", "grass", "trees", "bench", "flower garden"], category: "Outdoor", lighting: ["afternoon sunlight", "soft overcast light"], mood: ["peaceful", "casual"] },
  { id: "rooftop", name: "Rooftop", description: "Building rooftop view", tags: ["rooftop", "city skyline", "helipad", "ledge", "urban view"], category: "Outdoor", lighting: ["golden hour city light", "twilight"], mood: ["dramatic", "urban"] },
  { id: "garden", name: "Garden", description: "Lush garden setting", tags: ["garden", "flowers", "gazebo", "fountain", "hedges"], category: "Outdoor", lighting: ["soft garden light", "butterfly-lit sunlight"], mood: ["romantic", "serene"] },
  { id: "desert", name: "Desert", description: "Arid desert landscape", tags: ["desert", "sand dunes", "cacti", "hot sun", "mirage"], category: "Outdoor", lighting: ["harsh midday sun", "golden desert sunset"], mood: ["harsh", "vast"] },
  { id: "field", name: "Open Field", description: "Wide open grassland", tags: ["field", "tall grass", "wildflowers", "blue sky", "rolling hills"], category: "Outdoor", lighting: ["golden hour backlight", "overcast soft light"], mood: ["free", "expansive"] },
  { id: "castle-exterior", name: "Castle Exterior", description: "Medieval castle grounds", tags: ["castle", "stone walls", "tower", "courtyard", "battlements"], category: "Outdoor", lighting: ["dramatic clouds", "torchlight at dusk"], mood: ["medieval", "grand"] },
  { id: "vineyard", name: "Vineyard", description: "Wine country vineyard", tags: ["vineyard", "grapevines", "wine barrels", "rolling hills", "terrace"], category: "Outdoor", lighting: ["golden afternoon light", "warm sunset"], mood: ["romantic", "pastoral"] },
  { id: "snowscape", name: "Snowscape", description: "Snowy winter landscape", tags: ["snow", "snowflakes", "frozen lake", "pine trees covered in snow", "winter"], category: "Outdoor", lighting: ["cold blue-white light", "warm cabin light contrast"], mood: ["cold", "magical"] },
  { id: "waterfall", name: "Waterfall", description: "Tropical or forest waterfall", tags: ["waterfall", "mist", "rocks", "pool below", "tropical foliage"], category: "Outdoor", lighting: ["mist-filtered sunlight", "rainbow light"], mood: ["refreshing", "powerful"] },

  // ── Fantasy ──
  { id: "enchanted-forest", name: "Enchanted Forest", description: "Magical glowing forest", tags: ["enchanted forest", "glowing mushrooms", "fairy lights", "magical trees", "bioluminescence"], category: "Fantasy", lighting: ["ethereal bioluminescent glow", "magical particle light"], mood: ["magical", "wondrous"] },
  { id: "crystal-cave", name: "Crystal Cave", description: "Cave filled with crystals", tags: ["crystal cave", "glowing crystals", "underground lake", "stalactites"], category: "Fantasy", lighting: ["crystal refraction glow", "prismatic light"], mood: ["mystical", "awe-inspiring"] },
  { id: "dragons-lair", name: "Dragon's Lair", description: "Lair filled with treasure", tags: ["dragon's lair", "gold treasure", "bones", "giant scales", "mountain cave"], category: "Fantasy", lighting: ["firelight", "golden glow from treasure"], mood: ["dangerous", "epic"] },
  { id: "celestial-palace", name: "Celestial Palace", description: "Heavenly floating palace", tags: ["celestial palace", "floating in clouds", "golden gates", "marble pillars", "starlight"], category: "Fantasy", lighting: ["heavenly golden light", "starlight and moonlight"], mood: ["divine", "majestic"] },
  { id: "underwater-kingdom", name: "Underwater Kingdom", description: "Submerged fantasy realm", tags: ["underwater kingdom", "coral palace", "merfolk architecture", "bubbles", "bioluminescent sea life"], category: "Fantasy", lighting: ["filtered underwater light", "bioluminescent glow"], mood: ["dreamy", "otherworldly"] },
  { id: "floating-island", name: "Floating Island", description: "Sky island in the clouds", tags: ["floating island", "waterfalls from sky", "ancient ruins", "clouds below", "bridges"], category: "Fantasy", lighting: ["sunrise through clouds", "dramatic sunset clouds"], mood: ["breathtaking", "mythical"] },
  { id: "fairy-garden", name: "Fairy Garden", description: "Miniature magical garden", tags: ["fairy garden", "oversized flowers", "tiny houses", "glowing fireflies", "mushrooms"], category: "Fantasy", lighting: ["soft fairy glow", "twilight sparkle"], mood: ["whimsical", "delicate"] },
  { id: "dark-realm", name: "Dark Realm", description: "Shadowy demon world", tags: ["dark realm", "obsidian spires", "lava rivers", "dark sky", "thorny vines"], category: "Fantasy", lighting: ["crimson firelight", "eerie purple glow"], mood: ["ominous", "powerful"] },

  // ── Sci-Fi ──
  { id: "space-station", name: "Space Station", description: "Orbital space station", tags: ["space station", "view of Earth", "holographic displays", "futuristic corridors"], category: "Sci-Fi", lighting: ["cold LED lighting", "holographic glow", "starlight through viewport"], mood: ["futuristic", "isolated"] },
  { id: "cyberpunk-city", name: "Cyberpunk City", description: "Neon-lit futuristic city", tags: ["cyberpunk city", "neon signs", "flying cars", "holographic advertisements", "rain-soaked streets"], category: "Sci-Fi", lighting: ["neon pink and blue glow", "rain reflections", "holographic light"], mood: ["dystopian", "vibrant"] },
  { id: "alien-planet", name: "Alien Planet", description: "Extraterrestrial world", tags: ["alien planet", "multiple moons", "strange vegetation", "purple sky", "alien ruins"], category: "Sci-Fi", lighting: ["binary star light", "alien atmospheric glow"], mood: ["alien", "exploratory"] },
  { id: "futuristic-lab", name: "Futuristic Lab", description: "High-tech laboratory", tags: ["laboratory", "holographic screens", "cryogenic pods", "advanced equipment", "clean room"], category: "Sci-Fi", lighting: ["sterile white light", "holographic blue glow"], mood: ["clinical", "high-tech"] },
  { id: "starship-bridge", name: "Starship Bridge", description: "Starship command center", tags: ["starship bridge", "captain's chair", "viewscreen", "control panels", "star map"], category: "Sci-Fi", lighting: ["console glow", "strategic blue lighting"], mood: ["commanding", "epic"] },
  { id: "mech-bay", name: "Mech Bay", description: "Giant robot maintenance hangar", tags: ["mech bay", "giant robot", "maintenance crane", "tool panels", "spare parts"], category: "Sci-Fi", lighting: ["industrial overhead lights", "spark glow"], mood: ["industrial", "powerful"] },

  // ── Historical ──
  { id: "medieval-castle", name: "Medieval Castle", description: "Grand stone castle interior", tags: ["medieval castle", "stone walls", "tapestries", "great hall", "fireplace"], category: "Historical", lighting: ["fireplace glow", "candlelight", "torchlight"], mood: ["regal", "medieval"] },
  { id: "ancient-temple", name: "Ancient Temple", description: "Ruins of ancient temple", tags: ["ancient temple", "stone pillars", "overgrown vines", "carvings", "sacrificial altar"], category: "Historical", lighting: ["sunlight through broken roof", "misty dawn"], mood: ["ancient", "sacred"] },
  { id: "roman-bathhouse", name: "Roman Bathhouse", description: "Opulent Roman bath complex", tags: ["roman bathhouse", "marble columns", "warm pools", "mosaic floor", "arches"], category: "Historical", lighting: ["warm golden light", "steam-softened sunlight"], mood: ["luxurious", "classical"] },
  { id: "victorian-parlor", name: "Victorian Parlor", description: "19th century parlor", tags: ["victorian parlor", "velvet furniture", "oil paintings", "fireplace", "antique clock"], category: "Historical", lighting: ["gas lamp light", "warm firelight"], mood: ["elegant", "nostalgic"] },
  { id: "feudal-japan", name: "Feudal Japan", description: "Traditional Japanese setting", tags: ["feudal japan", "tatami room", "shoji screens", "cherry blossoms", "torii gate"], category: "Historical", lighting: ["paper lantern light", "soft morning light"], mood: ["serene", "traditional"] },
  { id: "wild-west", name: "Wild West Saloon", description: "American frontier saloon", tags: ["wild west", "saloon", "swinging doors", "wooden bar", "wanted posters"], category: "Historical", lighting: ["dusty sunlight", "warm kerosene lamp light"], mood: ["rugged", "adventurous"] },
  { id: "egyptian-palace", name: "Egyptian Palace", description: "Ancient Egyptian grandeur", tags: ["egyptian palace", "gold ornaments", "hieroglyphs", "sphinx", "palm trees", "nile"], category: "Historical", lighting: ["harsh desert sun through columns", "golden torchlight"], mood: ["opulent", "exotic"] },
  { id: "viking-longhouse", name: "Viking Longhouse", description: "Norse Viking hall", tags: ["viking longhouse", "wooden beams", "animal furs", "shield wall", "long fire pit"], category: "Historical", lighting: ["fire pit light", "smoky atmosphere"], mood: ["rugged", "communal"] },
  { id: "renaissance-court", name: "Renaissance Court", description: "Italian Renaissance palace", tags: ["renaissance court", "frescoed ceilings", "marble floors", "oil paintings", "gilded frames"], category: "Historical", lighting: ["candlelit chandeliers", "large window daylight"], mood: ["refined", "artistic"] },

  // ── Water ──
  { id: "pool", name: "Swimming Pool", description: "Swimming pool setting", tags: ["swimming pool", "pool water", "poolside", "lanai"], category: "Water", lighting: ["underwater pool lights", "sun reflections on water"], mood: ["refreshing", "luxurious"] },
  { id: "lake", name: "Lake", description: "Serene lake setting", tags: ["lake", "dock", "rowboat", "misty morning", "surrounded by trees"], category: "Water", lighting: ["misty morning light", "golden lake reflection"], mood: ["tranquil", "reflective"] },
  { id: "underwater", name: "Underwater", description: "Deep underwater scene", tags: ["underwater", "coral reef", "tropical fish", "sunbeams through water", "bubbles"], category: "Water", lighting: ["caustic light patterns", "deep blue ambient light"], mood: ["dreamy", "weightless"] },
  { id: "hot-spring", name: "Hot Spring", description: "Natural hot spring", tags: ["hot spring", "onsen", "steaming water", "rocks", "surrounded by nature"], category: "Water", lighting: ["steam-softened light", "moonlight"], mood: ["relaxing", "natural"] },

  // ── Urban ──
  { id: "city-street", name: "City Street", description: "Busy urban street", tags: ["city street", "skyscrapers", "traffic", "crosswalk", "neon signs"], category: "Urban", lighting: ["street lights", "neon reflections on wet pavement"], mood: ["bustling", "urban"] },
  { id: "alley", name: "Dark Alley", description: "Shadowy urban alley", tags: ["dark alley", "brick walls", "fire escape", "dumpster", "puddles"], category: "Urban", lighting: ["single overhead light", "neon sign reflection in puddles"], mood: ["gritty", "mysterious"] },
  { id: "rooftop-party", name: "Rooftop Party", description: "Rooftop social gathering", tags: ["rooftop party", "string lights", "drinks", "city skyline backdrop", "lounge furniture"], category: "Urban", lighting: ["string lights", "city glow backdrop"], mood: ["lively", "social"] },
  { id: "subway", name: "Subway Station", description: "Underground train station", tags: ["subway station", "train tracks", "tiled walls", "bench", "fluorescent lights"], category: "Urban", lighting: ["fluorescent tubes", "train headlight"], mood: ["gritty", "underground"] },

  // ── Intimate ──
  { id: "candlelit-room", name: "Candlelit Room", description: "Romantic candlelit setting", tags: ["candlelit room", "many candles", "rose petals", "silk sheets"], category: "Intimate", lighting: ["warm candlelight", "soft shadows"], mood: ["romantic", "intimate"] },
  { id: "jacuzzi", name: "Jacuzzi / Hot Tub", description: "Private hot tub setting", tags: ["jacuzzi", "hot tub", "bubbles", "steam", "outdoor deck"], category: "Intimate", lighting: ["underwater LED lights", "starlight"], mood: ["sensual", "relaxing"] },
  { id: "four-poster-bed", name: "Four-Poster Bed", description: "Grand four-poster bed", tags: ["four-poster bed", "canopy", "silk curtains", "luxurious bedding", "antique furniture"], category: "Intimate", lighting: ["soft bedside lamp", "candlelight"], mood: ["opulent", "intimate"] },
  { id: "private-beach-cabin", name: "Private Beach Cabin", description: "Secluded beach cabin", tags: ["beach cabin", "wooden cabin", "ocean view", "hammock", "driftwood"], category: "Intimate", lighting: ["warm interior light", "ocean sunset through window"], mood: ["private", "cozy"] },
];

// ─── Character Attributes ─────────────────────

export interface AttributeOption {
  id: string;
  label: string;
  tags: string[];
  secondaryTags?: string[]; // additional flavor tags
}

export interface CharacterAttribute {
  id: string;
  label: string;
  options: AttributeOption[];
  allowMultiple?: boolean;
  required?: boolean;
}

export const CHARACTER_ATTRIBUTES: CharacterAttribute[] = [
  {
    id: "gender",
    label: "Gender",
    required: true,
    options: [
      { id: "female", label: "Female", tags: ["1girl", "woman"] },
      { id: "male", label: "Male", tags: ["1boy", "man"] },
      { id: "futanari", label: "Futanari", tags: ["futanari"] },
      { id: "androgynous", label: "Androgynous", tags: ["androgynous"] },
    ],
  },
  {
    id: "age",
    label: "Age Range",
    options: [
      { id: "18-19", label: "18–19 (Young)", tags: ["young adult"] },
      { id: "20-25", label: "20–25", tags: ["young woman", "young man"] },
      { id: "26-35", label: "26–35", tags: ["adult"] },
      { id: "36-45", label: "36–45 (Mature)", tags: ["mature female", "mature male", "mature"] },
      { id: "46-55", label: "46–55 (MILF/DILF)", tags: ["MILF", "DILF", "middle-aged"] },
      { id: "56+", label: "56+ (Elegant)", tags: ["elderly", "silver fox", "elegant"] },
    ],
  },
  {
    id: "body-type",
    label: "Body Type",
    allowMultiple: true,
    options: [
      { id: "slim", label: "Slim", tags: ["slim body", "slender"] },
      { id: "athletic", label: "Athletic", tags: ["athletic body", "toned", "fit"] },
      { id: "average", label: "Average", tags: ["average body"] },
      { id: "curvy", label: "Curvy", tags: ["curvy", "curves", "hourglass figure"] },
      { id: "muscular", label: "Muscular", tags: ["muscular", "muscles", "abs", "ripped"] },
      { id: "petite", label: "Petite", tags: ["petite", "small body", "short"] },
      { id: "voluptuous", label: "Voluptuous", tags: ["voluptuous", "thick", "plump"] },
      { id: "plus-size", label: "Plus-Size", tags: ["plus-size", "bbw", "full-figured"] },
      { id: "tall", label: "Tall", tags: ["tall", "long legs"] },
      { id: "lithe", label: "Lithe", tags: ["lithe", "willowy", "graceful"] },
    ],
  },
  {
    id: "ethnicity",
    label: "Ethnicity",
    options: [
      { id: "caucasian", label: "Caucasian", tags: ["caucasian", "white"] },
      { id: "east-asian", label: "East Asian", tags: ["east asian", "japanese", "korean", "chinese"] },
      { id: "southeast-asian", label: "Southeast Asian", tags: ["southeast asian", "thai", "filipino", "vietnamese"] },
      { id: "south-asian", label: "South Asian", tags: ["south asian", "indian", "desi"] },
      { id: "black", label: "Black / African", tags: ["black", "african", "dark skin"] },
      { id: "latina", label: "Latina / Hispanic", tags: ["latina", "hispanic", "latin"] },
      { id: "middle-eastern", label: "Middle Eastern", tags: ["middle eastern", "arab", "persian"] },
      { id: "mixed", label: "Mixed / Multi-ethnic", tags: ["mixed race", "multi-ethnic", "ambiguous ethnicity"] },
    ],
  },
  {
    id: "hair-color",
    label: "Hair Color",
    options: [
      { id: "black", label: "Black", tags: ["black hair"] },
      { id: "brown", label: "Brown", tags: ["brown hair"] },
      { id: "blonde", label: "Blonde", tags: ["blonde hair"] },
      { id: "red", label: "Red", tags: ["red hair", "ginger hair"] },
      { id: "platinum", label: "Platinum / White", tags: ["platinum blonde hair", "white hair", "silver hair"] },
      { id: "blue", label: "Blue", tags: ["blue hair"] },
      { id: "pink", label: "Pink", tags: ["pink hair"] },
      { id: "purple", label: "Purple", tags: ["purple hair"] },
      { id: "green", label: "Green", tags: ["green hair"] },
      { id: "orange", label: "Orange", tags: ["orange hair"] },
      { id: "gradient", label: "Gradient / Ombre", tags: ["gradient hair", "ombre hair", "two-tone hair"] },
    ],
  },
  {
    id: "hair-style",
    label: "Hair Style",
    allowMultiple: true,
    options: [
      { id: "long-straight", label: "Long Straight", tags: ["long straight hair", "long hair"] },
      { id: "long-wavy", label: "Long Wavy", tags: ["long wavy hair", "wavy hair"] },
      { id: "short-bob", label: "Short Bob", tags: ["short bob hair", "bob cut"] },
      { id: "pixie", label: "Pixie Cut", tags: ["pixie cut", "short hair"] },
      { id: "ponytail", label: "Ponytail", tags: ["ponytail"] },
      { id: "bun", label: "Bun / Updo", tags: ["hair bun", "updo", "messy bun"] },
      { id: "braids", label: "Braids", tags: ["braided hair", "braids"] },
      { id: "twintails", label: "Twintails", tags: ["twintails", "pigtails"] },
      { id: "curly", label: "Curly", tags: ["curly hair"] },
      { id: "messy", label: "Messy / Bedhead", tags: ["messy hair", "bedhead"] },
      { id: "buzz-cut", label: "Buzz Cut / Shaved", tags: ["buzz cut", "shaved head", "short hair"] },
      { id: "bald", label: "Bald", tags: ["bald"] },
      { id: "dreadlocks", label: "Dreadlocks", tags: ["dreadlocks", "locs"] },
      { id: "side-shave", label: "Side Shave / Undercut", tags: ["side shave", "undercut", "shaved side"] },
    ],
  },
  {
    id: "eye-color",
    label: "Eye Color",
    options: [
      { id: "brown", label: "Brown", tags: ["brown eyes"] },
      { id: "blue", label: "Blue", tags: ["blue eyes"] },
      { id: "green", label: "Green", tags: ["green eyes"] },
      { id: "hazel", label: "Hazel", tags: ["hazel eyes"] },
      { id: "amber", label: "Amber / Gold", tags: ["amber eyes", "golden eyes"] },
      { id: "gray", label: "Gray", tags: ["gray eyes"] },
      { id: "violet", label: "Violet", tags: ["violet eyes", "purple eyes"] },
      { id: "red", label: "Red", tags: ["red eyes"] },
      { id: "heterochromia", label: "Heterochromia", tags: ["heterochromia", "different colored eyes"] },
    ],
  },
  {
    id: "skin-tone",
    label: "Skin Tone",
    options: [
      { id: "pale", label: "Pale", tags: ["pale skin", "fair skin"] },
      { id: "light", label: "Light", tags: ["light skin"] },
      { id: "medium", label: "Medium", tags: ["medium skin", "olive skin"] },
      { id: "tan", label: "Tan", tags: ["tan skin", "tanned skin"] },
      { id: "brown", label: "Brown", tags: ["brown skin"] },
      { id: "dark", label: "Dark", tags: ["dark skin", "ebony skin"] },
    ],
  },
  {
    id: "clothing",
    label: "Clothing / Outfit",
    allowMultiple: true,
    options: [
      { id: "casual", label: "Casual", tags: ["casual clothes", "t-shirt", "jeans"] },
      { id: "formal", label: "Formal / Suit", tags: ["formal attire", "suit", "evening gown", "cocktail dress"] },
      { id: "lingerie", label: "Lingerie", tags: ["lingerie", "lace underwear", "bra", "panties"] },
      { id: "swimwear", label: "Swimwear", tags: ["swimwear", "bikini", "swimsuit", "one-piece"] },
      { id: "athletic-wear", label: "Athletic Wear", tags: ["sportswear", "athletic wear", "yoga pants", "sports bra", "tank top"] },
      { id: "fantasy-armor", label: "Fantasy Armor", tags: ["fantasy armor", "plate armor", "leather armor", "wizard robes"] },
      { id: "sci-fi-suit", label: "Sci-Fi Suit", tags: ["sci-fi suit", "futuristic clothing", "spacesuit", "cyberwear"] },
      { id: "school-uniform", label: "School Uniform", tags: ["school uniform", "sailor uniform", "serafuku"] },
      { id: "gothic", label: "Gothic", tags: ["gothic clothing", "gothic dress", "dark fashion"] },
      { id: "punk", label: "Punk", tags: ["punk fashion", "leather jacket", "chains", "studs"] },
      { id: "japanese-traditional", label: "Japanese Traditional", tags: ["kimono", "yukata", "japanese clothes"] },
      { id: "chinese-traditional", label: "Chinese Traditional", tags: ["chinese clothes", "hanfu", "qipao", "cheongsam"] },
      { id: "maid", label: "Maid Outfit", tags: ["maid outfit", "apron", "headband"] },
      { id: "nude", label: "Nude / None", tags: ["nude", "naked", "no clothes"] },
      { id: "business", label: "Business Attire", tags: ["business attire", "blazer", "pencil skirt", "button-up shirt"] },
      { id: "bohemian", label: "Bohemian", tags: ["bohemian clothes", "flowing dress", "ethnic patterns"] },
      { id: "military", label: "Military", tags: ["military uniform", "camouflage", "combat boots"] },
      { id: "steampunk", label: "Steampunk", tags: ["steampunk clothing", "corset", "goggles", "victorian-futurism"] },
    ],
  },
  {
    id: "expression",
    label: "Expression",
    options: [
      { id: "happy", label: "Happy / Smiling", tags: ["smile", "happy", "grinning"] },
      { id: "sad", label: "Sad", tags: ["sad", "teary eyes", "frowning"] },
      { id: "angry", label: "Angry", tags: ["angry", "frowning", "glaring"] },
      { id: "surprised", label: "Surprised", tags: ["surprised", "wide eyes", "open mouth"] },
      { id: "seductive", label: "Seductive", tags: ["seductive smile", "seductive gaze", "alluring", "lusty"] },
      { id: "shy", label: "Shy / Embarrassed", tags: ["shy", "blushing", "embarrassed", "flustered"] },
      { id: "confident", label: "Confident", tags: ["confident", "smirk", "self-assured"] },
      { id: "mysterious", label: "Mysterious", tags: ["mysterious", "enigmatic", "half-closed eyes"] },
      { id: "playful", label: "Playful", tags: ["playful", "teasing", "winking"] },
      { id: "serious", label: "Serious", tags: ["serious", "stoic", "determined"] },
      { id: "blissful", label: "Blissful", tags: ["blissful", "ecstatic", "eyes closed"] },
      { id: "mischievous", label: "Mischievous", tags: ["mischievous", "sly smile", "devious"] },
      { id: "sleepy", label: "Sleepy", tags: ["sleepy", "yawning", "half-asleep"] },
    ],
  },
  {
    id: "pose",
    label: "Pose / Composition",
    allowMultiple: true,
    options: [
      { id: "standing", label: "Standing", tags: ["standing"] },
      { id: "sitting", label: "Sitting", tags: ["sitting"] },
      { id: "lying-down", label: "Lying Down", tags: ["lying down", "reclining"] },
      { id: "kneeling", label: "Kneeling", tags: ["kneeling"] },
      { id: "action", label: "Action / Dynamic", tags: ["dynamic pose", "action pose", "running", "jumping"] },
      { id: "looking-at-viewer", label: "Looking at Viewer", tags: ["looking at viewer"] },
      { id: "profile", label: "Profile / Side View", tags: ["profile", "side view"] },
      { id: "from-behind", label: "From Behind", tags: ["from behind", "back view"] },
      { id: "close-up", label: "Close-up / Portrait", tags: ["close-up", "portrait", "face close-up"] },
      { id: "full-body", label: "Full Body", tags: ["full body", "entire body visible"] },
      { id: "upper-body", label: "Upper Body / Cowboy Shot", tags: ["upper body", "cowboy shot"] },
      { id: "stretching", label: "Stretching", tags: ["stretching", "arms raised"] },
      { id: "leaning", label: "Leaning", tags: ["leaning", "leaning against wall"] },
      { id: "walking", label: "Walking", tags: ["walking", "in motion"] },
      { id: "arms-crossed", label: "Arms Crossed", tags: ["arms crossed"] },
      { id: "hand-on-hip", label: "Hand on Hip", tags: ["hand on hip", "akimbo"] },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    allowMultiple: true,
    options: [
      { id: "glasses", label: "Glasses", tags: ["glasses"] },
      { id: "sunglasses", label: "Sunglasses", tags: ["sunglasses"] },
      { id: "jewelry", label: "Jewelry", tags: ["jewelry", "necklace", "earrings", "bracelet"] },
      { id: "hat", label: "Hat", tags: ["hat"] },
      { id: "headband", label: "Headband / Hairband", tags: ["headband", "hairband"] },
      { id: "choker", label: "Choker", tags: ["choker"] },
      { id: "stockings", label: "Stockings / Thigh-highs", tags: ["thigh-highs", "stockings", "pantyhose"] },
      { id: "gloves", label: "Gloves", tags: ["gloves", "elbow gloves"] },
      { id: "scarf", label: "Scarf", tags: ["scarf"] },
      { id: "wings", label: "Wings", tags: ["wings", "angel wings", "fairy wings"] },
      { id: "horns", label: "Horns", tags: ["horns", "demon horns"] },
      { id: "tail", label: "Tail", tags: ["tail", "animal tail"] },
      { id: "weapon", label: "Weapon", tags: ["holding weapon", "sword", "staff", "gun"] },
    ],
  },
];

// ─── Action / Activity Tags ───────────────────

export const ACTIONS: { id: string; label: string; tags: string[] }[] = [
  { id: "relaxing", label: "Relaxing", tags: ["relaxing", "lounging"] },
  { id: "reading", label: "Reading a Book", tags: ["reading", "holding book", "open book"] },
  { id: "dancing", label: "Dancing", tags: ["dancing", "moving gracefully"] },
  { id: "drinking", label: "Drinking (Wine/Coffee)", tags: ["drinking", "holding wine glass", "holding coffee cup"] },
  { id: "cooking", label: "Cooking", tags: ["cooking", "wearing apron", "stirring pot"] },
  { id: "exercising", label: "Exercising / Yoga", tags: ["exercising", "yoga pose", "stretching", "workout"] },
  { id: "playing-music", label: "Playing Music", tags: ["playing music", "holding instrument", "singing"] },
  { id: "painting", label: "Painting / Art", tags: ["painting", "holding paintbrush", "creating art"] },
  { id: "using-phone", label: "Using Phone", tags: ["looking at phone", "selfie", "texting"] },
  { id: "looking-out-window", label: "Looking Out Window", tags: ["looking out window", "gazing outside", "daydreaming"] },
  { id: "getting-dressed", label: "Getting Dressed", tags: ["getting dressed", "putting on clothes", "adjusting clothing"] },
  { id: "bathtub-scene", label: "In Bathtub", tags: ["in bathtub", "bathing", "surrounded by bubbles"] },
  { id: "swimming", label: "Swimming", tags: ["swimming", "in water", "wet"] },
  { id: "shopping", label: "Shopping", tags: ["shopping", "carrying bags", "browsing"] },
  { id: "meditating", label: "Meditating", tags: ["meditating", "lotus position", "peaceful expression"] },
  { id: "gardening", label: "Gardening", tags: ["gardening", "holding flowers", "watering plants"] },
  { id: "riding", label: "Riding (Horse/Bike)", tags: ["riding horse", "riding bicycle", "motorcycle"] },
  { id: "fighting", label: "Fighting / Combat", tags: ["fighting stance", "martial arts", "sword fighting"] },
  { id: "sleeping", label: "Sleeping", tags: ["sleeping", "peacefully sleeping", "in bed"] },
  { id: "laughing", label: "Laughing", tags: ["laughing", "throwing head back laughing"] },
  { id: "flirting", label: "Flirting", tags: ["flirting", "playful gesture", "biting lip"] },
  { id: "working", label: "Working / Studying", tags: ["working", "studying", "writing", "using laptop"] },
  { id: "sunbathing", label: "Sunbathing", tags: ["sunbathing", "lying in sun", "tanning"] },
  { id: "playing-game", label: "Playing Video Games", tags: ["playing video games", "holding controller", "gaming"] },
  { id: "campfire", label: "By Campfire", tags: ["by campfire", "sitting by fire", "roasting marshmallows"] },
];

// ─── Art Style Tags ───────────────────────────

export const ART_STYLES: { id: string; label: string; tags: string[] }[] = [
  { id: "photorealistic", label: "Photorealistic", tags: ["photorealistic", "realistic", "raw photo", "DSLR photo"] },
  { id: "anime", label: "Anime", tags: ["anime style", "anime art", "anime illustration"] },
  { id: "digital-art", label: "Digital Art", tags: ["digital art", "digital painting", "artstation"] },
  { id: "oil-painting", label: "Oil Painting", tags: ["oil painting", "classical painting", "fine art"] },
  { id: "watercolor", label: "Watercolor", tags: ["watercolor painting", "watercolor art", "soft washes"] },
  { id: "concept-art", label: "Concept Art", tags: ["concept art", "matte painting", "concept design"] },
  { id: "cinematic", label: "Cinematic", tags: ["cinematic", "cinematic lighting", "movie still", "film grain"] },
  { id: "fantasy-art", label: "Fantasy Art", tags: ["fantasy art", "epic fantasy", "dark fantasy art"] },
  { id: "pixel-art", label: "Pixel Art", tags: ["pixel art", "retro pixel", "16-bit"] },
  { id: "comic", label: "Comic / Manga", tags: ["comic style", "manga", "comic book art", "cel shading"] },
  { id: "noir", label: "Film Noir", tags: ["film noir", "high contrast black and white", "dramatic shadows"] },
  { id: "pastel", label: "Pastel / Soft", tags: ["pastel colors", "soft lighting", "dreamy atmosphere", "ethereal"] },
  { id: "vintage", label: "Vintage / Retro", tags: ["vintage photo", "retro style", "film photography", "aged photo"] },
  { id: "hyperrealistic", label: "Hyperrealistic", tags: ["hyperrealistic", "ultra realistic", "ultra detailed", "8k photo"] },
];

// ─── Camera / Composition ────────────────────

export const CAMERA_ANGLES: { id: string; label: string; tags: string[] }[] = [
  { id: "eye-level", label: "Eye Level", tags: ["eye-level shot"] },
  { id: "low-angle", label: "Low Angle", tags: ["low angle", "looking up", "from below", "dramatic angle"] },
  { id: "high-angle", label: "High Angle", tags: ["high angle", "looking down", "from above"] },
  { id: "birds-eye", label: "Bird's Eye", tags: ["bird's eye view", "overhead shot", "top-down view"] },
  { id: "worms-eye", label: "Worm's Eye", tags: ["worm's eye view", "ground level", "extreme low angle"] },
  { id: "dutch-angle", label: "Dutch Angle", tags: ["dutch angle", "tilted camera", "canted angle"] },
  { id: "over-shoulder", label: "Over the Shoulder", tags: ["over the shoulder shot"] },
  { id: "wide-shot", label: "Wide Shot", tags: ["wide shot", "establishing shot", "wide angle lens"] },
  { id: "medium-shot", label: "Medium Shot", tags: ["medium shot"] },
  { id: "extreme-closeup", label: "Extreme Close-up", tags: ["extreme close-up", "macro shot", "detailed face"] },
];

// ─── Additional Quality / Enhancement Tags ────

export const EXTRA_QUALITY_TAGS = [
  "perfect anatomy", "correct anatomy", "proper proportions",
  "detailed face", "detailed eyes", "detailed skin",
  "symmetrical face", "beautiful detailed eyes",
  "sharp focus", "high resolution", "intricate details",
  "no artifacts", "clean image", "professional quality",
];

export const EXTRA_NEGATIVE_TAGS = [
  "anatomical inaccuracies", "body distortion",
  "cross-eyed", "wall-eyed", "lazy eye",
  "disconnected limbs", "floating limbs",
  "webbed fingers", "webbed toes",
  "extra fingers", "extra toes", "missing fingers",
  "badly drawn face", "asymmetric eyes",
  "deformed iris", "deformed pupils",
  "ugly", "duplicate", "morbid", "out of frame",
  "mutation", "extra arms", "extra legs",
  "poorly drawn hands", "poorly drawn feet",
  "mutilated", "truncated", "too many fingers",
  "long neck", "cross-eyed",
  "gross proportions", "malformed limbs",
  "bad perspective", "tilted horizon",
];

// ─── Utility Functions ────────────────────────

export function pickRandom<T>(arr: T[], count: number = 1): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

export function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
