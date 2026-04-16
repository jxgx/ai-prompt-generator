// ──────────────────────────────────────────────
// Random Prompt Generator — Master Data File v3.0
// All models, scenes, attributes, and quality configs
// Director styles, expanded actions, diverse moods
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
  prependQuality: boolean;
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
      "monochrome", "black and white", "grayscale", "desaturated",
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
      "monochrome", "black and white", "grayscale", "desaturated",
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
      "monochrome", "black and white", "grayscale", "desaturated",
    ],
    promptStyle: "pony",
    supportsWeighting: true,
    defaultSteps: 25,
    defaultCfg: 7,
    defaultSampler: "DPM++ 2M Karras",
    tagSeparator: ", ",
    prependQuality: true,
    supportsNsfw: true,
    specialNotes: "Always start with score_9, score_8_up, score_7_up. Use source_anime for anime style.",
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
      "monochrome", "black and white", "grayscale", "desaturated",
    ],
    promptStyle: "illustrious",
    supportsWeighting: true,
    defaultSteps: 25,
    defaultCfg: 6,
    defaultSampler: "DPM++ 2M Karras",
    tagSeparator: ", ",
    prependQuality: true,
    supportsNsfw: true,
    specialNotes: "Anime-optimized. Use aesthetic tags and detailed character descriptions.",
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
      "black and white", "grayscale", "desaturated",
    ],
    promptStyle: "chroma",
    supportsWeighting: true,
    defaultSteps: 28,
    defaultCfg: 7,
    defaultSampler: "DPM++ SDE Karras",
    tagSeparator: ", ",
    prependQuality: false,
    supportsNsfw: true,
    specialNotes: "Excels with vibrant color descriptions.",
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
      "monochrome", "black and white", "grayscale", "desaturated",
    ],
    promptStyle: "natural",
    supportsWeighting: false,
    defaultSteps: 30,
    defaultCfg: 7.5,
    defaultSampler: "DPM++ 2M Karras",
    tagSeparator: ", ",
    prependQuality: false,
    supportsNsfw: true,
    specialNotes: "Natural language descriptions work best.",
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
      "monochrome", "black and white", "grayscale", "desaturated",
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

// ─── Director Styles ──────────────────────────

export interface DirectorStyle {
  id: string;
  label: string;
  description: string;
  tags: string[];
}

export const DIRECTOR_STYLES: DirectorStyle[] = [
  {
    id: "none",
    label: "Default (No Style Weight)",
    description: "Use default art styles — no director influence",
    tags: [],
  },
  {
    id: "helmut-newton",
    label: "Helmut Newton",
    description: "High contrast color photography, dramatic shadows, powerful women, voyeuristic, editorial fashion",
    tags: [
      "Helmut Newton style", "high contrast color photography", "dramatic shadows",
      "powerful woman", "voyeuristic framing", "bold composition",
      "fashion photography", "provocative pose", "vivid color",
      "sharp geometric shadows", "dominant stance", "editorial nude",
      "hotel hallway", "surreal fashion", "rich color palette",
      "vintage Vogue aesthetic", "editorial color photography",
    ],
  },
  {
    id: "terry-richardson",
    label: "Terry Richardson",
    description: "Harsh direct flash, washed-out colors, raw/unedited, snapshot feel, white background",
    tags: [
      "Terry Richardson style", "harsh direct flash", "washed-out colors",
      "raw unedited photo", "snapshot aesthetic", "white seamless background",
      "direct eye contact", "provocative casual", "ring light flash",
      "point and shoot camera", "intimate snapshot", "overexposed flash",
      "authentic moment", "casual provocative", "instant camera aesthetic",
    ],
  },
  {
    id: "nicholas-winding-refn",
    label: "N.W. Refn (Drive / Only God Forgives)",
    description: "Neon-drenched, extreme color grading (blue/purple/red), atmospheric haze, cinematic noir",
    tags: [
      "Nicholas Winding Refn style", "neon-drenched", "extreme color grading",
      "blue and purple neon glow", "atmospheric haze", "slow-motion cinematic feel",
      "cinematic wide shot", "hyper-stylized", "noir influences",
      "red and blue color palette", "smoky atmosphere", "crime film aesthetic",
      "moody neon lighting", "wet streets reflection", "stylized violence aesthetic",
      "synthwave color palette", "dreamlike cinematic",
    ],
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
  { id: "bedroom", name: "Bedroom", description: "Private bedroom setting", tags: ["bedroom", "bed", "pillows", "sheets"], category: "Indoor", lighting: ["warm lighting", "soft lamp light", "morning light through curtains"], mood: ["intimate", "cozy", "romantic", "private", "relaxed"] },
  { id: "living-room", name: "Living Room", description: "Spacious living area", tags: ["living room", "sofa", "couch", "coffee table"], category: "Indoor", lighting: ["natural window light", "warm interior lighting", "evening lamp light"], mood: ["relaxed", "domestic", "comfortable", "casual", "homely"] },
  { id: "kitchen", name: "Kitchen", description: "Modern or rustic kitchen", tags: ["kitchen", "counter", "stove", "marble countertops"], category: "Indoor", lighting: ["bright overhead lighting", "under-cabinet lighting", "morning sunlight"], mood: ["domestic", "casual", "warm", "productive", "everyday"] },
  { id: "bathroom", name: "Bathroom", description: "Luxurious bathroom", tags: ["bathroom", "bathtub", "shower", "mirror", "marble tiles"], category: "Indoor", lighting: ["soft candlelight", "steam", "backlit mirror"], mood: ["sensual", "relaxing", "intimate", "steamy", "refreshing"] },
  { id: "office", name: "Office", description: "Professional workspace", tags: ["office", "desk", "computer", "office chair", "documents"], category: "Indoor", lighting: ["fluorescent lighting", "monitor glow", "desk lamp"], mood: ["professional", "focused", "stressed", "productive", "corporate"] },
  { id: "gym", name: "Gym", description: "Fitness center", tags: ["gym", "exercise equipment", "weights", "mirrors"], category: "Indoor", lighting: ["harsh overhead lighting", "spotlights", "natural skylight"], mood: ["energetic", "powerful", "sweaty", "determined", "intense"] },
  { id: "library", name: "Library", description: "Grand library with bookshelves", tags: ["library", "bookshelves", "books", "reading nook", "ladder"], category: "Indoor", lighting: ["warm reading lamp", "dusty sunlight through windows"], mood: ["intellectual", "quiet", "contemplative", "scholarly", "peaceful"] },
  { id: "studio", name: "Art Studio", description: "Creative art space", tags: ["art studio", "easel", "canvas", "paint", "sketches"], category: "Indoor", lighting: ["north light", "natural studio lighting"], mood: ["creative", "artistic", "inspired", "messy", "expressive"] },
  { id: "dungeon", name: "Dungeon", description: "Dark medieval dungeon", tags: ["dungeon", "stone walls", "chains", "torches", "iron bars"], category: "Indoor", lighting: ["torchlight", "dim shadows", "flickering light"], mood: ["dark", "mysterious", "sinister", "forbidding", "ominous"] },
  { id: "nightclub", name: "Nightclub", description: "Vibrant nightlife venue", tags: ["nightclub", "dance floor", "DJ booth", "neon lights", "bar"], category: "Indoor", lighting: ["strobe lights", "neon glow", "laser lights", "UV blacklight"], mood: ["energetic", "wild", "euphoric", "chaotic", "intoxicating"] },
  { id: "hotel-room", name: "Hotel Room", description: "Luxury hotel suite", tags: ["hotel room", "king bed", "city view window", "minibar"], category: "Indoor", lighting: ["ambient mood lighting", "city lights through window"], mood: ["luxurious", "romantic", "decadent", "secretive", "adventurous"] },
  { id: "spa", name: "Spa", description: "Relaxing spa environment", tags: ["spa", "massage table", "candles", "bamboo", "incense"], category: "Indoor", lighting: ["soft candlelight", "diffused natural light"], mood: ["serene", "peaceful", "pampered", "tranquil", "zen"] },
  { id: "restaurant", name: "Restaurant", description: "Upscale dining", tags: ["restaurant", "table setting", "wine glasses", "candles"], category: "Indoor", lighting: ["candlelight", "chandelier"], mood: ["romantic", "elegant", "sophisticated", "convivial", "warm"] },
  { id: "warehouse", name: "Warehouse", description: "Industrial warehouse", tags: ["warehouse", "concrete floor", "shelving units", "industrial"], category: "Indoor", lighting: ["harsh overhead lights", "single bare bulb"], mood: ["gritty", "raw", "industrial", "abandoned", "ominous"] },
  { id: "casino", name: "Casino", description: "Glittering casino floor", tags: ["casino", "slot machines", "card table", "chips", "roulette"], category: "Indoor", lighting: ["bright casino lights", "colorful neon"], mood: ["exciting", "glamorous", "risky", "opulent", "tense"] },

  // ── Outdoor ──
  { id: "beach", name: "Beach", description: "Sandy beach at the ocean", tags: ["beach", "sand", "ocean waves", "palm trees", "tropical"], category: "Outdoor", lighting: ["golden hour", "sunrise", "sunset"], mood: ["relaxed", "tropical", "carefree", "summery", "breezy"] },
  { id: "forest", name: "Forest", description: "Dense woodland", tags: ["forest", "trees", "moss", "sunbeams through canopy", "fallen leaves"], category: "Outdoor", lighting: ["dappled sunlight", "ethereal forest light"], mood: ["mystical", "peaceful", "ancient", "enchanting", "earthy"] },
  { id: "mountain", name: "Mountain", description: "Mountain peak or trail", tags: ["mountain", "snow caps", "rocky terrain", "cliff edge", "clouds below"], category: "Outdoor", lighting: ["dramatic sunlight", "alpine glow"], mood: ["majestic", "adventurous", "awe-inspiring", "exhilarating", "solitary"] },
  { id: "park", name: "Park", description: "City or nature park", tags: ["park", "grass", "trees", "bench", "flower garden"], category: "Outdoor", lighting: ["afternoon sunlight", "soft overcast light"], mood: ["peaceful", "casual", "cheerful", "leisurely", "playful"] },
  { id: "rooftop", name: "Rooftop", description: "Building rooftop view", tags: ["rooftop", "city skyline", "helipad", "ledge", "urban view"], category: "Outdoor", lighting: ["golden hour city light", "twilight"], mood: ["dramatic", "urban", "liberating", "contemplative", "dangerous"] },
  { id: "garden", name: "Garden", description: "Lush garden setting", tags: ["garden", "flowers", "gazebo", "fountain", "hedges"], category: "Outdoor", lighting: ["soft garden light", "butterfly-lit sunlight"], mood: ["romantic", "serene", "whimsical", "lush", "fairy-tale"] },
  { id: "desert", name: "Desert", description: "Arid desert landscape", tags: ["desert", "sand dunes", "cacti", "hot sun", "mirage"], category: "Outdoor", lighting: ["harsh midday sun", "golden desert sunset"], mood: ["harsh", "vast", "isolated", "surreal", "blistering"] },
  { id: "field", name: "Open Field", description: "Wide open grassland", tags: ["field", "tall grass", "wildflowers", "blue sky", "rolling hills"], category: "Outdoor", lighting: ["golden hour backlight", "overcast soft light"], mood: ["free", "expansive", "idyllic", "peaceful", "dreamy"] },
  { id: "castle-exterior", name: "Castle Exterior", description: "Medieval castle grounds", tags: ["castle", "stone walls", "tower", "courtyard", "battlements"], category: "Outdoor", lighting: ["dramatic clouds", "torchlight at dusk"], mood: ["medieval", "grand", "imposing", "historic", "regal"] },
  { id: "vineyard", name: "Vineyard", description: "Wine country vineyard", tags: ["vineyard", "grapevines", "wine barrels", "rolling hills", "terrace"], category: "Outdoor", lighting: ["golden afternoon light", "warm sunset"], mood: ["romantic", "pastoral", "elegant", "intoxicating", "warm"] },
  { id: "snowscape", name: "Snowscape", description: "Snowy winter landscape", tags: ["snow", "snowflakes", "frozen lake", "pine trees covered in snow", "winter"], category: "Outdoor", lighting: ["cold blue-white light", "warm cabin light contrast"], mood: ["cold", "magical", "crisp", "silent", "ethereal"] },
  { id: "waterfall", name: "Waterfall", description: "Tropical or forest waterfall", tags: ["waterfall", "mist", "rocks", "pool below", "tropical foliage"], category: "Outdoor", lighting: ["mist-filtered sunlight", "rainbow light"], mood: ["refreshing", "powerful", "primal", "tropical", "invigorating"] },

  // ── Fantasy ──
  { id: "enchanted-forest", name: "Enchanted Forest", description: "Magical glowing forest", tags: ["enchanted forest", "glowing mushrooms", "fairy lights", "magical trees", "bioluminescence"], category: "Fantasy", lighting: ["ethereal bioluminescent glow", "magical particle light"], mood: ["magical", "wondrous", "mystical", "enchanted", "ethereal"] },
  { id: "crystal-cave", name: "Crystal Cave", description: "Cave filled with crystals", tags: ["crystal cave", "glowing crystals", "underground lake", "stalactites"], category: "Fantasy", lighting: ["crystal refraction glow", "prismatic light"], mood: ["mystical", "awe-inspiring", "otherworldly", "prismatic", "sacred"] },
  { id: "dragons-lair", name: "Dragon's Lair", description: "Lair filled with treasure", tags: ["dragon's lair", "gold treasure", "bones", "giant scales", "mountain cave"], category: "Fantasy", lighting: ["firelight", "golden glow from treasure"], mood: ["dangerous", "epic", "treacherous", "glittering", "forbidding"] },
  { id: "celestial-palace", name: "Celestial Palace", description: "Heavenly floating palace", tags: ["celestial palace", "floating in clouds", "golden gates", "marble pillars", "starlight"], category: "Fantasy", lighting: ["heavenly golden light", "starlight and moonlight"], mood: ["divine", "majestic", "transcendent", "luminous", "heavenly"] },
  { id: "underwater-kingdom", name: "Underwater Kingdom", description: "Submerged fantasy realm", tags: ["underwater kingdom", "coral palace", "merfolk architecture", "bubbles", "bioluminescent sea life"], category: "Fantasy", lighting: ["filtered underwater light", "bioluminescent glow"], mood: ["dreamy", "otherworldly", "serene", "surreal", "mesmerizing"] },
  { id: "floating-island", name: "Floating Island", description: "Sky island in the clouds", tags: ["floating island", "waterfalls from sky", "ancient ruins", "clouds below", "bridges"], category: "Fantasy", lighting: ["sunrise through clouds", "dramatic sunset clouds"], mood: ["breathtaking", "mythical", "ethereal", "majestic", "floating"] },
  { id: "fairy-garden", name: "Fairy Garden", description: "Miniature magical garden", tags: ["fairy garden", "oversized flowers", "tiny houses", "glowing fireflies", "mushrooms"], category: "Fantasy", lighting: ["soft fairy glow", "twilight sparkle"], mood: ["whimsical", "delicate", "enchanting", "playful", "tiny"] },
  { id: "dark-realm", name: "Dark Realm", description: "Shadowy demon world", tags: ["dark realm", "obsidian spires", "lava rivers", "dark sky", "thorny vines"], category: "Fantasy", lighting: ["crimson firelight", "eerie purple glow"], mood: ["ominous", "powerful", "malevolent", "infernal", "apocalyptic"] },

  // ── Sci-Fi ──
  { id: "space-station", name: "Space Station", description: "Orbital space station", tags: ["space station", "view of Earth", "holographic displays", "futuristic corridors"], category: "Sci-Fi", lighting: ["cold LED lighting", "holographic glow", "starlight through viewport"], mood: ["futuristic", "isolated", "sterile", "awe-inspiring", "weightless"] },
  { id: "cyberpunk-city", name: "Cyberpunk City", description: "Neon-lit futuristic city", tags: ["cyberpunk city", "neon signs", "flying cars", "holographic advertisements", "rain-soaked streets"], category: "Sci-Fi", lighting: ["neon pink and blue glow", "rain reflections", "holographic light"], mood: ["dystopian", "vibrant", "neon-lit", "gritty", "electric"] },
  { id: "alien-planet", name: "Alien Planet", description: "Extraterrestrial world", tags: ["alien planet", "multiple moons", "strange vegetation", "purple sky", "alien ruins"], category: "Sci-Fi", lighting: ["binary star light", "alien atmospheric glow"], mood: ["alien", "exploratory", "bizarre", "mysterious", "primordial"] },
  { id: "futuristic-lab", name: "Futuristic Lab", description: "High-tech laboratory", tags: ["laboratory", "holographic screens", "cryogenic pods", "advanced equipment", "clean room"], category: "Sci-Fi", lighting: ["sterile white light", "holographic blue glow"], mood: ["clinical", "high-tech", "experimental", "cold", "precise"] },
  { id: "starship-bridge", name: "Starship Bridge", description: "Starship command center", tags: ["starship bridge", "captain's chair", "viewscreen", "control panels", "star map"], category: "Sci-Fi", lighting: ["console glow", "strategic blue lighting"], mood: ["commanding", "epic", "strategic", "tense", "interstellar"] },
  { id: "mech-bay", name: "Mech Bay", description: "Giant robot maintenance hangar", tags: ["mech bay", "giant robot", "maintenance crane", "tool panels", "spare parts"], category: "Sci-Fi", lighting: ["industrial overhead lights", "spark glow"], mood: ["industrial", "powerful", "mechanical", "massive", "grease-stained"] },

  // ── Historical ──
  { id: "medieval-castle", name: "Medieval Castle", description: "Grand stone castle interior", tags: ["medieval castle", "stone walls", "tapestries", "great hall", "fireplace"], category: "Historical", lighting: ["fireplace glow", "candlelight", "torchlight"], mood: ["regal", "medieval", "somber", "feudal", "warm"] },
  { id: "ancient-temple", name: "Ancient Temple", description: "Ruins of ancient temple", tags: ["ancient temple", "stone pillars", "overgrown vines", "carvings", "sacrificial altar"], category: "Historical", lighting: ["sunlight through broken roof", "misty dawn"], mood: ["ancient", "sacred", "overgrown", "weathered", "spiritual"] },
  { id: "roman-bathhouse", name: "Roman Bathhouse", description: "Opulent Roman bath complex", tags: ["roman bathhouse", "marble columns", "warm pools", "mosaic floor", "arches"], category: "Historical", lighting: ["warm golden light", "steam-softened sunlight"], mood: ["luxurious", "classical", "decadent", "opulent", "relaxed"] },
  { id: "victorian-parlor", name: "Victorian Parlor", description: "19th century parlor", tags: ["victorian parlor", "velvet furniture", "oil paintings", "fireplace", "antique clock"], category: "Historical", lighting: ["gas lamp light", "warm firelight"], mood: ["elegant", "nostalgic", "proper", "ornate", "stuffy"] },
  { id: "feudal-japan", name: "Feudal Japan", description: "Traditional Japanese setting", tags: ["feudal japan", "tatami room", "shoji screens", "cherry blossoms", "torii gate"], category: "Historical", lighting: ["paper lantern light", "soft morning light"], mood: ["serene", "traditional", "harmonious", "minimalist", "zen"] },
  { id: "wild-west", name: "Wild West Saloon", description: "American frontier saloon", tags: ["wild west", "saloon", "swinging doors", "wooden bar", "wanted posters"], category: "Historical", lighting: ["dusty sunlight", "warm kerosene lamp light"], mood: ["rugged", "adventurous", "lawless", "rowdy", "dusty"] },
  { id: "egyptian-palace", name: "Egyptian Palace", description: "Ancient Egyptian grandeur", tags: ["egyptian palace", "gold ornaments", "hieroglyphs", "sphinx", "palm trees", "nile"], category: "Historical", lighting: ["harsh desert sun through columns", "golden torchlight"], mood: ["opulent", "exotic", "ancient", "golden", "regal"] },
  { id: "viking-longhouse", name: "Viking Longhouse", description: "Norse Viking hall", tags: ["viking longhouse", "wooden beams", "animal furs", "shield wall", "long fire pit"], category: "Historical", lighting: ["fire pit light", "smoky atmosphere"], mood: ["rugged", "communal", "fierce", "warm", "barbaric"] },
  { id: "renaissance-court", name: "Renaissance Court", description: "Italian Renaissance palace", tags: ["renaissance court", "frescoed ceilings", "marble floors", "oil paintings", "gilded frames"], category: "Historical", lighting: ["candlelit chandeliers", "large window daylight"], mood: ["refined", "artistic", "cultured", "lavish", "humanist"] },

  // ── Water ──
  { id: "pool", name: "Swimming Pool", description: "Swimming pool setting", tags: ["swimming pool", "pool water", "poolside", "lanai"], category: "Water", lighting: ["underwater pool lights", "sun reflections on water"], mood: ["refreshing", "luxurious", "summery", "cool", "inviting"] },
  { id: "lake", name: "Lake", description: "Serene lake setting", tags: ["lake", "dock", "rowboat", "misty morning", "surrounded by trees"], category: "Water", lighting: ["misty morning light", "golden lake reflection"], mood: ["tranquil", "reflective", "still", "melancholy", "peaceful"] },
  { id: "underwater", name: "Underwater", description: "Deep underwater scene", tags: ["underwater", "coral reef", "tropical fish", "sunbeams through water", "bubbles"], category: "Water", lighting: ["caustic light patterns", "deep blue ambient light"], mood: ["dreamy", "weightless", "surreal", "silent", "azure"] },
  { id: "hot-spring", name: "Hot Spring", description: "Natural hot spring", tags: ["hot spring", "onsen", "steaming water", "rocks", "surrounded by nature"], category: "Water", lighting: ["steam-softened light", "moonlight"], mood: ["relaxing", "natural", "steamy", "meditative", "warm"] },

  // ── Urban / TikTok-style ──
  { id: "city-street", name: "City Street", description: "Busy urban street", tags: ["city street", "skyscrapers", "traffic", "crosswalk", "neon signs"], category: "Urban", lighting: ["street lights", "neon reflections on wet pavement"], mood: ["bustling", "urban", "anonymous", "energetic", "nocturnal"] },
  { id: "alley", name: "Dark Alley", description: "Shadowy urban alley", tags: ["dark alley", "brick walls", "fire escape", "dumpster", "puddles"], category: "Urban", lighting: ["single overhead light", "neon sign reflection in puddles"], mood: ["gritty", "mysterious", "dangerous", "seedy", "noir"] },
  { id: "rooftop-party", name: "Rooftop Party", description: "Rooftop social gathering", tags: ["rooftop party", "string lights", "drinks", "city skyline backdrop", "lounge furniture"], category: "Urban", lighting: ["string lights", "city glow backdrop"], mood: ["lively", "social", "celebratory", "youthful", "vibrant"] },
  { id: "subway", name: "Subway Station", description: "Underground train station", tags: ["subway station", "train tracks", "tiled walls", "bench", "fluorescent lights"], category: "Urban", lighting: ["fluorescent tubes", "train headlight"], mood: ["gritty", "underground", "transient", "rushed", "claustrophobic"] },
  { id: "dorm-room", name: "Dorm Room", description: "College dorm room, TikTok mirror selfie style", tags: ["dorm room", "twin bed", "desk", "posters on wall", "string lights", "small space"], category: "Urban", lighting: ["string lights", "warm desk lamp", "ring light"], mood: ["casual", "cozy", "youthful", "cluttered", "nostalgic"] },
  { id: "coffee-shop", name: "Coffee Shop / Cafe", description: "Trendy coffee shop interior", tags: ["coffee shop", "cafe", "latte", "laptop", "wooden table", "exposed brick", "plants"], category: "Urban", lighting: ["warm ambient light", "window light", "overhead Edison bulbs"], mood: ["cozy", "aesthetic", "productive", "hip", "warm"] },
  { id: "car-interior", name: "Car Interior", description: "Inside a car, passenger or driver seat selfie", tags: ["car interior", "passenger seat", "steering wheel", "dashboard", "car window", "seatbelt"], category: "Urban", lighting: ["natural light through window", "golden hour through car window", "dashboard glow"], mood: ["casual", "on-the-go", "intimate", "confined", "road-trip"] },
  { id: "mall-fitting-room", name: "Fitting Room / Mall", description: "Department store fitting room mirror selfie", tags: ["fitting room", "mirror selfie", "department store", "changing room", "full-length mirror"], category: "Urban", lighting: ["bright fitting room lighting", "ring light", "overhead fluorescent"], mood: ["playful", "fashionable", "confident", "vain", "girly"] },
  { id: "bathroom-mirror", name: "Bathroom Mirror Selfie", description: "Bathroom mirror selfie, classic social media style", tags: ["bathroom mirror", "mirror selfie", "bathroom counter", "toothbrush", "skincare products", "vanity"], category: "Urban", lighting: ["bathroom lighting", "ring light reflection", "bright vanity light"], mood: ["confident", "casual", "intimate", "unguarded", "real"] },
  { id: "bedroom-selfie", name: "Bedroom Mirror Selfie", description: "Full-length mirror selfie in bedroom", tags: ["bedroom mirror", "mirror selfie", "full-length mirror", "bed in background", "clothes on floor", "vanity"], category: "Urban", lighting: ["natural window light", "ring light", "soft bedroom lighting"], mood: ["confident", "casual", "aesthetic", "flirty", "relaxed"] },
  { id: "laundromat", name: "Laundromat", description: "Coin laundromat aesthetic", tags: ["laundromat", "washing machines", "dryer", "folding table", "fluorescent lights", "vinyl floor"], category: "Urban", lighting: ["fluorescent overhead", "harsh clinical light"], mood: ["mundane", "aesthetic", "urban", "bored", "everyday"] },
  { id: "grocery-store", name: "Grocery Store", description: "Aisle of a grocery store", tags: ["grocery store", "supermarket aisle", "shopping cart", "products on shelves", "fluorescent lights"], category: "Urban", lighting: ["bright overhead fluorescent", "harsh retail lighting"], mood: ["everyday", "casual", "mundane", "bored", "normal"] },
  { id: "parking-garage", name: "Parking Garage", description: "Underground or rooftop parking structure", tags: ["parking garage", "concrete pillars", "parked cars", "painted lines", "dim lighting"], category: "Urban", lighting: ["overhead sodium lights", "dim garage lighting", "car headlights"], mood: ["gritty", "urban", "mysterious", "cold", "concrete"] },
  { id: "stairwell", name: "Stairwell", description: "Apartment or building stairwell", tags: ["stairwell", "concrete stairs", "metal railing", "bare walls", "geometric lines"], category: "Urban", lighting: ["harsh overhead", "window light from landing", "shadow patterns"], mood: ["gritty", "urban", "dramatic", "geometric", "echoing"] },

  // ── Intimate ──
  { id: "candlelit-room", name: "Candlelit Room", description: "Romantic candlelit setting", tags: ["candlelit room", "many candles", "rose petals", "silk sheets"], category: "Intimate", lighting: ["warm candlelight", "soft shadows"], mood: ["romantic", "intimate", "passionate", "sensual", "warm"] },
  { id: "jacuzzi", name: "Jacuzzi / Hot Tub", description: "Private hot tub setting", tags: ["jacuzzi", "hot tub", "bubbles", "steam", "outdoor deck"], category: "Intimate", lighting: ["underwater LED lights", "starlight"], mood: ["sensual", "relaxing", "decadent", "warm", "wet"] },
  { id: "four-poster-bed", name: "Four-Poster Bed", description: "Grand four-poster bed", tags: ["four-poster bed", "canopy", "silk curtains", "luxurious bedding", "antique furniture"], category: "Intimate", lighting: ["soft bedside lamp", "candlelight"], mood: ["opulent", "intimate", "regal", "sensual", "sumptuous"] },
  { id: "private-beach-cabin", name: "Private Beach Cabin", description: "Secluded beach cabin", tags: ["beach cabin", "wooden cabin", "ocean view", "hammock", "driftwood"], category: "Intimate", lighting: ["warm interior light", "ocean sunset through window"], mood: ["private", "cozy", "secluded", "peaceful", "rustic"] },
];

// ─── Mood Descriptors (for randomization) ──────

export const MOODS: string[] = [
  "romantic", "intimate", "sensual", "mysterious", "playful",
  "seductive", "dreamy", "melancholy", "euphoric", "serene",
  "dangerous", "powerful", "vulnerable", "confident", "shy",
  "wild", "elegant", "raw", "ethereal", "gritty",
  "nostalgic", "futuristic", "ancient", "dark", "innocent",
  "provocative", "submissive", "dominant", "carefree", "tense",
  "blissful", "haunting", "peaceful", "chaotic", "angelic",
  "devilish", "whimsical", "brooding", " radiant", "shadowy",
  "luminous", "stormy", "sunny", "moonlit", "sunrise",
  "twilight", "midnight", "golden-hour", "blue-hour", "dusty",
  "frosty", "steamy", "misty", "crisp", "hazy",
  "intoxicating", "intense", "soft", "hard", "electric",
  "magnetic", "enchanting", "forbidding", "inviting", "distant",
];

// ─── Character Attributes ─────────────────────

export interface AttributeOption {
  id: string;
  label: string;
  tags: string[];
  secondaryTags?: string[];
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
      { id: "gaunt", label: "Gaunt", tags: ["gaunt", "thin", "hollow cheeks", "bony"] },
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
      { id: "russian", label: "Russian", tags: ["russian", "slavic", "european"] },
      { id: "ukrainian", label: "Ukrainian", tags: ["ukrainian", "slavic", "european"] },
      { id: "american", label: "American", tags: ["american"] },
      { id: "german", label: "German", tags: ["german", "european"] },
      { id: "scandinavian", label: "Scandinavian", tags: ["scandinavian", "nordic", "swedish", "norwegian", "danish"] },
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
      { id: "y2k", label: "Y2K Fashion", tags: ["Y2K fashion", "low-rise jeans", "crop top", "butterfly clips", "velvet tracksuit", "metallic fabrics", "early 2000s fashion"] },
      { id: "alt-girl", label: "Alt Girl", tags: ["alt girl", "alternative fashion", "choker", "dark makeup", "band t-shirt", "plaid skirt", "platform boots"] },
      { id: "emo", label: "Emo", tags: ["emo fashion", "emo", "black hair with bangs", "tight jeans", "band merch", "studded belt", "converse shoes", "black eyeliner"] },
      { id: "streetwear", label: "Streetwear", tags: ["streetwear", "hoodie", "sneakers", "cargo pants", "oversized clothing", "bucket hat", "graphic tee"] },
      { id: "e-girl", label: "E-Girl", tags: ["e-girl", "egirl", "pastel hair", "heart makeup under eye", "chain jewelry", "collar", "striped long sleeves", "platform shoes"] },
      { id: "pajamas", label: "Pajamas", tags: ["pajamas", "sleepwear", "nightgown", "nightshirt", "silk pajamas", "cute pajamas"] },
      { id: "bikini", label: "Bikini", tags: ["bikini", "two-piece swimsuit", "string bikini", "triangle bikini top", "bikini bottom"] },
      { id: "thigh-high-socks", label: "Thigh-High Socks", tags: ["thigh-high socks", "over-knee socks", "knee-high socks", "long socks", "socks"] },
      { id: "cheerleader", label: "Cheerleader", tags: ["cheerleader uniform", "cheerleader", "pom-poms", "crop top", "pleated skirt", "sneakers", "letterman jacket"] },
      { id: "nurse", label: "Nurse", tags: ["nurse outfit", "nurse uniform", "white dress", "nurse cap", "stethoscope"] },
      { id: "cop", label: "Cop / Police", tags: ["police uniform", "cop outfit", "badge", "handcuffs", "police hat", "duty belt"] },
      { id: "student", label: "Student", tags: ["student", "schoolgirl", "schoolboy", "backpack", "textbooks", "sweater vest", "plaid skirt"] },
      { id: "crop-top-jeans", label: "Crop Top + Jeans", tags: ["crop top", "midriff", "jeans", "belly button", "casual cute"] },
      { id: "oversized-hoodie", label: "Oversized Hoodie", tags: ["oversized hoodie", "hoodie", "no pants", "thighs", "cozy", "comfortable"] },
      { id: "sundress", label: "Sundress", tags: ["sundress", "summer dress", "floral dress", "spaghetti straps", "light fabric"] },
      { id: "crop-tank-shorts", label: "Crop Tank + Shorts", tags: ["crop tank top", "short shorts", "midriff", "bare midriff", "summer outfit", "athletic shorts"] },
      { id: "off-shoulder", label: "Off-Shoulder Top", tags: ["off-shoulder", "bare shoulders", "one-shoulder", "shoulderless top"] },
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

// ─── SFW Action / Activity Tags (30+) ─────────

export const SFW_ACTIONS: { id: string; label: string; tags: string[] }[] = [
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
  { id: "selfie", label: "Taking Selfie", tags: ["taking selfie", "holding phone up", "duck face", "mirror selfie"] },
  { id: "blowing-bubblegum", label: "Blowing Bubblegum", tags: ["blowing bubblegum", "pink bubblegum", "playful expression"] },
  { id: "eating-ice-cream", label: "Eating Ice Cream", tags: ["eating ice cream", "ice cream cone", "licking ice cream", "playful"] },
  { id: "stretching-morning", label: "Morning Stretch", tags: ["morning stretch", "arms raised", "yawning", "waking up", "bed head"] },
  { id: "playing-with-hair", label: "Playing with Hair", tags: ["playing with hair", "twirling hair", "running fingers through hair"] },
  { id: "waving", label: "Waving Hello", tags: ["waving", "hand raised", "friendly smile", "greeting"] },
  { id: "holding-flower", label: "Holding Flower", tags: ["holding flower", "smelling flower", "flower crown", "romantic"] },
  { id: "walking-dog", label: "Walking a Dog", tags: ["walking dog", "holding leash", "golden retriever", "pet owner"] },
  { id: "taking-photos", label: "Taking Photos", tags: ["holding camera", "taking photos", "photographer", "vintage camera"] },
  { id: "climbing-stairs", label: "Climbing Stairs", tags: ["climbing stairs", "ascending staircase", "looking back over shoulder"] },
  { id: "opening-gift", label: "Opening a Gift", tags: ["opening gift", "surprised expression", "wrapping paper", "excited"] },
  { id: "blowing-dandelion", label: "Blowing Dandelion", tags: ["blowing dandelion seeds", "dandelion fluff floating", "wishing", "wind"] },
  { id: "carrying-groceries", label: "Carrying Groceries", tags: ["carrying grocery bags", "paper bags", "everyday life", "casual"] },
  { id: "feeding-birds", label: "Feeding Birds", tags: ["feeding pigeons", "park bench", "scattering seeds", "peaceful"] },
];

// ─── NSFW XXX Explicit Action Tags (55+) ──────

export const NSFW_ACTIONS: { id: string; label: string; tags: string[] }[] = [
  // ── Undressing / Exposure ──
  { id: "stripping", label: "Stripping", tags: ["stripping", "taking off clothes", "undressing", "removing bra", "pulling down panties"] },
  { id: "topless", label: "Topless", tags: ["topless", "bare breasts", "exposed breasts", "no shirt", "shirt pulled up"] },
  { id: "bottomless", label: "Bottomless", tags: ["bottomless", "no pants", "no underwear", "exposed lower body", "panties pulled down"] },
  { id: "naked", label: "Fully Naked", tags: ["naked", "nude", "fully nude", "no clothes", "bare skin"] },
  { id: "bathtub-nude", label: "Nude in Bathtub", tags: ["in bathtub", "nude", "naked in bath", "bathing nude", "wet skin", "soap suds on body"] },
  { id: "teasing-undress", label: "Teasing While Undressing", tags: ["teasing", "slowly undressing", "seductive undressing", "pulling down strap", "unzipping"] },
  { id: "lingerie-display", label: "Showing Off Lingerie", tags: ["showing lingerie", "posing in lingerie", "lingerie model pose", "adjusting bra strap", "sexy pose"] },
  { id: "nipple-exposure", label: "Nipple Exposure", tags: ["exposed nipples", "nipples visible", "see-through shirt", "nipple poke", "wardrobe malfunction"] },
  { id: "upskirt", label: "Upskirt", tags: ["upskirt", "looking up skirt", "panties visible", "under skirt view", "flashing panties"] },
  { id: "pulling-aside", label: "Pulling Clothing Aside", tags: ["pulling panties aside", "pulling bra aside", "clothing pulled to side", "shifted clothing", "accessible"] },
  { id: "titty-flash", label: "Flashing Breasts", tags: ["flashing breasts", "pulling up shirt", "lifting top", "revealing breasts", "sudden exposure"] },
  { id: "pussy-flash", label: "Flashing Pussy", tags: ["flashing pussy", "lifting skirt", "spreading pussy", "exposed pussy", "showing genitals"] },

  // ── Ass Focus ──
  { id: "bending-over", label: "Bending Over", tags: ["bending over", "from behind", "looking back over shoulder", "arched back", "butt visible"] },
  { id: "ass-spreading", label: "Spreading Ass", tags: ["spreading ass", "hands on butt cheeks", "ass spread", "anus visible", "bent over spreading"] },
  { id: "twerking", label: "Twerking", tags: ["twerking", "shaking ass", "booty bounce", "dance ass shake", "thick booty"] },
  { id: "spanking", label: "Spanking", tags: ["spanking", "being spanked", "hand on ass", "red ass cheeks", "spanked", "ass slap"] },
  { id: "ass-clap", label: "Ass Clapping", tags: ["ass clapping", "butt clapping", "booty clapping", "thick ass bouncing"] },

  // ── Pussy / Vaginal Focus ──
  { id: "spread-legs", label: "Spread Legs", tags: ["spread legs", "legs apart", "lying down spread legs", "inviting pose"] },
  { id: "pussy-closeup", label: "Pussy Close-Up", tags: ["pussy close-up", "vulva visible", "labia", "close-up vagina", "detailed pussy"] },
  { id: "cameltoe", label: "Cameltoe", tags: ["cameltoe", "tight pants cameltoe", "yoga pants tight", "visible pussy lips through clothing"] },
  { id: "wet-panties", label: "Wet Panties", tags: ["wet panties", "arousal stain", "damp underwear", "soaked panties", "pussy juice"] },

  // ── Masturbation ──
  { id: "fingering", label: "Fingering", tags: ["fingering", "fingers inside pussy", "masturbating", "hand in panties", "rubbing clit"] },
  { id: "touching-self", label: "Touching Self", tags: ["touching self", "masturbating", "hand between legs", "pleasuring self", "fingers inside"] },
  { id: "vibrator-use", label: "Using Vibrator", tags: ["using vibrator", "vibrating toy", "hitachi wand", "vibrator on clit", "buzzing toy"] },
  { id: "dildo-use", label: "Using Dildo", tags: ["using dildo", "riding dildo", "dildo inside", "sex toy insertion", "toy inside"] },
  { id: "humping-pillow", label: "Humping Pillow", tags: ["humping pillow", "grinding on pillow", "pillow humping", "thrusting on pillow"] },
  { id: "fingering-ass", label: "Anal Fingering", tags: ["anal fingering", "finger in ass", "anal masturbation", "fingering anus"] },

  // ── Breasts Focus ──
  { id: "titfuck", label: "Titfuck", tags: ["titfuck", "paizuri", "penis between breasts", "boob job", "cock between tits"] },
  { id: "breast-squeezing", label: "Squeezing Breasts", tags: ["squeezing own breasts", "pressing breasts together", "playing with boobs", "nipple pinch"] },
  { id: "sucking-own-nipples", label: "Sucking Own Nipples", tags: ["self nipple sucking", "licking own nipple", "auto-cunnilingus attempt", "flexible self suck"] },

  // ── Oral ──
  { id: "blowjob", label: "Blowjob", tags: ["blowjob", "sucking cock", "licking penis", "mouth on penis", "deepthroat", "giving head"] },
  { id: "deep-throat", label: "Deep Throat", tags: ["deep throat", "taking all of cock", "choking on cock", "throat bulge", "gagging"] },
  { id: "cunnilingus", label: "Cunnilingus", tags: ["cunnilingus", "eating pussy", "licking pussy", "face between thighs", "oral sex female"] },
  { id: "rimming", label: "Rimming", tags: ["rimming", "licking anus", "rim job", "tongue in ass", "analingus"] },
  { id: "face-sitting", label: "Facesitting", tags: ["facesitting", "sitting on face", "face under crotch", "smothering"] },
  { id: "ball-sucking", label: "Ball Sucking", tags: ["ball sucking", "licking testicles", "mouth on balls", "sucking scrotum"] },

  // ── Penetrative Sex ──
  { id: "cowgirl", label: "Cowgirl / Riding", tags: ["cowgirl", "riding cock", "woman on top", "straddling", "reverse cowgirl", "bouncing on cock"] },
  { id: "doggystyle", label: "Doggystyle", tags: ["doggystyle", "from behind sex", "doggy style", "taking from behind", "pounding from behind"] },
  { id: "missionary", label: "Missionary", tags: ["missionary", "missionary position", "man on top", "face to face sex", "legs wrapped around"] },
  { id: "standing-sex", label: "Standing Sex", tags: ["standing sex", "sex standing up", "lifted against wall", "pinned against wall", "wall sex"] },
  { id: "anal", label: "Anal Sex", tags: ["anal sex", "anal", "penetration from behind", "anal creampie", "butt sex"] },
  { id: "sixtynine", label: "69 Position", tags: ["69", "sixty-nine", "69 position", "simultaneous oral", "mutual oral sex"] },
  { id: "scissoring", label: "Scissoring / Tribbing", tags: ["tribbing", "scissoring", "girl on girl grinding", "pussy grinding"] },
  { id: "reverse-cowgirl", label: "Reverse Cowgirl", tags: ["reverse cowgirl", "riding facing away", "back view riding", "ass facing viewer during sex"] },
  { id: "spooning-sex", label: "Spooning Sex", tags: ["spooning sex", "sex from behind while lying down", "intimate position", "lazy sex"] },

  // ── BDSM / Bondage ──
  { id: "bondage", label: "Bondage / Tied Up", tags: ["bondage", "tied up", "handcuffed", "blindfolded", "restrained", "rope bondage", "submissive"] },
  { id: "dominant", label: "Dominant / Assertive", tags: ["dominant", "dominatrix", "assertive pose", "in control", "commanding", "goddess pose"] },
  { id: "submissive", label: "Submissive / Obedient", tags: ["submissive", "obedient", "on knees", "begging", "looking up submissively", "collar and leash"] },
  { id: "collar-leash", label: "Collar and Leash", tags: ["collar and leash", "pet play", "wearing collar", "being walked on leash", "dog collar"] },
  { id: "blindfolded", label: "Blindfolded", tags: ["blindfolded", "silk blindfold", "sensory deprivation", "darkness", "anticipation"] },

  // ── Body Part Focus ──
  { id: "armpits", label: "Armpit Focus", tags: ["armpit", "raised arms showing armpits", "smooth armpits", "armpit worship", "shaved armpits"] },
  { id: "feet-focus", label: "Feet / Soles Focus", tags: ["bare feet", "soles of feet", "toes", "foot fetish", "wrinkled soles", "pedicured toes"] },
  { id: "footjob", label: "Footjob", tags: ["footjob", "feet on penis", "toes on cock", "soles rubbing", "foot play"] },
  { id: "thigh-focus", label: "Thigh Focus", tags: ["thighs", "thick thighs", "thigh gap", "inner thighs", "squeezing thighs"] },
  { id: "navel-focus", label: "Navel / Belly Focus", tags: ["navel", "belly button", "midriff", "stomach", "bare stomach", "fingering navel"] },
  { id: "saliva-drool", label: "Saliva / Drool", tags: ["drooling", "saliva", "spit", "wet mouth", "excessive saliva", "drool on chin", "spit fetish"] },
  { id: "sweat-focus", label: "Sweat / Glistening", tags: ["sweaty body", "glistening with sweat", "sweat drops", "post-workout glow", "wet skin from heat"] },

  // ── Exhibitionism / Voyeur ──
  { id: "exhibitionism", label: "Exhibitionism", tags: ["exhibitionism", "public nudity", "flashing in public", "nude outdoors", "streaking", "daring public exposure"] },
  { id: "voyeur-candid", label: "Voyeur / Candid", tags: ["voyeur", "candid", "being watched", "peeping", "secretly watching", "caught changing"] },
  { id: "changing-room", label: "Changing Room", tags: ["changing room", "locker room", "getting undressed in locker room", "locker room mirror"] },

  // ── Climax / Finish ──
  { id: "orgasm", label: "Orgasm / Climax", tags: ["orgasm", "climax", "cumming", "ecstasy face", "eyes rolled back", "mouth open moaning", "squirming"] },
  { id: "creampie", label: "Creampie", tags: ["creampie", "cum inside", "internal cumshot", "cum leaking from pussy", "filled with cum"] },
  { id: "facial", label: "Facial", tags: ["facial", "cum on face", "cumshot on face", "face covered in cum", "cum in mouth"] },
  { id: "cumshot-body", label: "Cum on Body", tags: ["cum on body", "cum on stomach", "cum on chest", "cum on breasts", "cum on ass", "cum on back"] },
  { id: "cum-swallow", label: "Cum Swallowing", tags: ["swallowing cum", "cum in mouth", "drinking cum", "cum on tongue", "swallow"] },

  // ── Scene / Location Sex ──
  { id: "sex-on-bed", label: "Sex on Bed", tags: ["sex on bed", "fucking in bed", "sheets tangled", "pillows scattered", "passionate sex"] },
  { id: "sex-in-shower", label: "Sex in Shower", tags: ["sex in shower", "shower sex", "wet bodies", "water running", "steam", "glass shower wall"] },
  { id: "sex-on-couch", label: "Sex on Couch", tags: ["sex on couch", "fucking on sofa", "couch sex", "bent over couch", "spread on couch"] },
  { id: "sex-against-wall", label: "Pinned Against Wall", tags: ["pinned against wall", "lifted against wall", "wall slammed", "legs wrapped around partner", "passionate wall sex"] },

  // ── Sensual / Teasing ──
  { id: "kissing-passionate", label: "Passionate Kissing", tags: ["passionate kissing", "making out", "tongue kissing", "french kiss", "heavy kissing"] },
  { id: "oil-massage", label: "Oiled Up / Massage", tags: ["oiled body", "baby oil", "glistening skin", "body massage", "oiled breasts", "oiled ass", "massage oil"] },
  { id: "humping", label: "Grinding / Humping", tags: ["grinding", "dry humping", "lap dance", "writhing", "hip movements"] },
  { id: "groping", label: "Being Groped", tags: ["being groped", "hands on breasts", "hands on ass", "being touched", "grabbed"] },
  { id: "handjob", label: "Handjob", tags: ["handjob", "gripping penis", "stroking cock", "hand on dick", "wanking"] },
  { id: "bedroom-eyes", label: "Bedroom Eyes Pose", tags: ["bedroom eyes", "seductive gaze", "heavy-lidded eyes", "come-hither look", "lustful expression"] },
  { id: "threesome", label: "Threesome", tags: ["threesome", "two girls one guy", "FMF", "group sex", "three people", "spit roast"] },
  { id: "girl-on-girl", label: "Girl on Girl", tags: ["girl on girl", "lesbian sex", "two girls kissing", "tribbing", "scissoring", "lesbian"] },
  { id: "afterglow", label: "Sex Afterglow", tags: ["afterglow", "post-sex", "satisfied expression", "lying in bed after sex", "messy hair", "cum on body"] },
];

// ─── Legacy ACTIONS (kept for backward compatibility) ───
export const ACTIONS = [...SFW_ACTIONS] as { id: string; label: string; tags: string[] }[];

// ─── Art Style Tags ───────────────────────────

export const ART_STYLES: { id: string; label: string; tags: string[] }[] = [
  { id: "photorealistic", label: "Photorealistic", tags: ["photorealistic", "realistic", "raw photo", "DSLR photo"] },
  { id: "hyperrealistic", label: "Hyperrealistic", tags: ["hyperrealistic", "ultra realistic", "ultra detailed", "8k photo"] },
  { id: "cinematic", label: "Cinematic", tags: ["cinematic", "cinematic lighting", "movie still", "film grain"] },
  { id: "studio-photo", label: "Studio Photography", tags: ["studio photography", "professional photo shoot", "professional lighting", "model photoshoot"] },
  { id: "natural-photo", label: "Natural / Casual Photo", tags: ["natural photo", "candid photo", "everyday photography", "lifestyle photo"] },
  { id: "street-photo", label: "Street Photography", tags: ["street photography", "candid street shot", "urban photography"] },
  { id: "portrait-photo", label: "Portrait Photography", tags: ["portrait photography", "headshot", "beauty portrait", "professional portrait"] },
  { id: "noir", label: "Film Noir (Color)", tags: ["film noir style", "high contrast shadows", "dramatic shadows", "noir atmosphere", "chiaroscuro lighting"] },
  { id: "vintage", label: "Vintage / Retro Photo", tags: ["vintage photo", "retro style", "film photography", "aged photo"] },
  { id: "glamour", label: "Glamour Photography", tags: ["glamour photography", "glamour shot", "beauty shot", "fashion photography"] },
  { id: "editorial", label: "Editorial / Magazine", tags: ["editorial photography", "magazine cover", "fashion editorial", "vogue style"] },
];

// ─── Companion Themes ────────────────────────

export const COMPANION_THEMES: { id: string; label: string; tags: string[]; category: string }[] = [
  { id: "cheerleader", label: "Cheerleader", tags: ["cheerleader uniform", "pom-poms", "crop top", "pleated skirt", "sneakers"], category: "Roleplay" },
  { id: "nurse", label: "Nurse", tags: ["nurse outfit", "nurse uniform", "white dress", "nurse cap", "stethoscope"], category: "Roleplay" },
  { id: "cop", label: "Cop / Police", tags: ["police uniform", "cop outfit", "badge", "handcuffs", "police hat"], category: "Roleplay" },
  { id: "student", label: "Student", tags: ["schoolgirl", "backpack", "sweater vest", "plaid skirt", "knee-high socks"], category: "Roleplay" },
  { id: "maid", label: "Maid", tags: ["maid outfit", "frilly apron", "headband", "feather duster", "black dress"], category: "Roleplay" },
  { id: "secretary", label: "Secretary", tags: ["secretary", "blouse", "pencil skirt", "glasses", "office setting", "professional"], category: "Roleplay" },
  { id: "librarian", label: "Librarian", tags: ["librarian", "cardigan", "glasses on chain", "bookish", "prim", "bun hairstyle"], category: "Roleplay" },
  { id: "gym-trainer", label: "Gym Trainer", tags: ["gym trainer", "sports bra", "yoga pants", "sneakers", "athletic", "whistle"], category: "Roleplay" },
  { id: "bunny", label: "Bunny Girl", tags: ["bunny girl", "playboy bunny", "bunny ears", "leotard", "bunny tail", "high heels", "fishnet stockings"], category: "Roleplay" },
  { id: "catgirl", label: "Catgirl", tags: ["catgirl", "cat ears", "cat tail", "collar with bell", "paw gloves"], category: "Roleplay" },
  { id: "witch", label: "Witch", tags: ["witch", "witch hat", "pointy hat", "dark robes", "magic wand", "broomstick"], category: "Fantasy" },
  { id: "elf", label: "Elf", tags: ["elf", "pointy ears", "elven armor", "flowing robes", "bow and arrow", "ethereal"], category: "Fantasy" },
  { id: "pirate", label: "Pirate", tags: ["pirate", "tricorn hat", "eye patch", "corset", "leather boots", "sword belt"], category: "Fantasy" },
  { id: "y2k", label: "Y2K", tags: ["Y2K fashion", "low-rise jeans", "crop top", "butterfly clips", "velvet tracksuit", "metallic fabrics"], category: "Fashion" },
  { id: "alt", label: "Alt Girl", tags: ["alt girl", "alternative fashion", "choker", "dark makeup", "band t-shirt", "platform boots"], category: "Fashion" },
  { id: "emo", label: "Emo", tags: ["emo fashion", "emo", "black hair with bangs", "tight jeans", "studded belt", "converse shoes", "black eyeliner"], category: "Fashion" },
  { id: "e-girl", label: "E-Girl", tags: ["e-girl", "pastel hair", "heart makeup under eye", "chain jewelry", "striped long sleeves", "platform shoes"], category: "Fashion" },
  { id: "streetwear", label: "Streetwear", tags: ["streetwear", "hoodie", "sneakers", "cargo pants", "oversized clothing", "bucket hat"], category: "Fashion" },
  { id: "coquette", label: "Coquette", tags: ["coquette", "ribbon bows", "lace trim", "floral patterns", "soft pink", "victorian-inspired", "delicate"], category: "Fashion" },
  { id: "grunge", label: "Grunge", tags: ["grunge fashion", "flannel shirt", "ripped jeans", "combat boots", "beanie", "90s fashion"], category: "Fashion" },
  { id: "cottagecore", label: "Cottagecore", tags: ["cottagecore", "floral dress", "straw hat", "wicker basket", "meadow", "prairie dress", "flowing fabric"], category: "Fashion" },
  { id: "pajamas", label: "Pajamas", tags: ["pajamas", "sleepwear", "silk pajamas", "cute pajamas", "sleep mask"], category: "Casual" },
  { id: "oversized-hoodie", label: "Oversized Hoodie", tags: ["oversized hoodie", "no pants", "thighs exposed", "cozy", "comfortable", "knee socks"], category: "Casual" },
  { id: "bikini-beach", label: "Bikini", tags: ["bikini", "two-piece swimsuit", "string bikini", "beach setting"], category: "Casual" },
  { id: "crop-top-jeans", label: "Crop Top + Jeans", tags: ["crop top", "midriff", "jeans", "belly button", "casual cute"], category: "Casual" },
  { id: "sundress", label: "Sundress", tags: ["sundress", "summer dress", "floral dress", "spaghetti straps", "light fabric"], category: "Casual" },
  { id: "tank-shorts", label: "Tank + Shorts", tags: ["crop tank top", "short shorts", "midriff", "summer outfit", "athletic shorts"], category: "Casual" },
  { id: "off-shoulder", label: "Off-Shoulder Top", tags: ["off-shoulder", "bare shoulders", "one-shoulder top", "fitted jeans"], category: "Casual" },
  { id: "thigh-high-socks", label: "Thigh-High Socks", tags: ["thigh-high socks", "over-knee socks", "long socks", "loose socks"], category: "Casual" },
];

// ─── Lighting Options ─────────────────────────

export const LIGHTING_OPTIONS: { id: string; label: string; tags: string[] }[] = [
  { id: "golden-hour", label: "Golden Hour", tags: ["golden hour lighting", "warm golden light", "sunset glow", "warm tones"] },
  { id: "blue-hour", label: "Blue Hour", tags: ["blue hour", "twilight", "cool blue tones", "dusk lighting"] },
  { id: "natural", label: "Natural Daylight", tags: ["natural lighting", "soft daylight", "overcast light", "cloudy day"] },
  { id: "harsh-sun", label: "Harsh Sunlight", tags: ["harsh sunlight", "direct sunlight", "strong shadows", "high contrast"] },
  { id: "overcast", label: "Overcast / Soft", tags: ["overcast lighting", "soft diffused light", "cloudy", "even lighting", "no harsh shadows"] },
  { id: "studio", label: "Studio Lighting", tags: ["studio lighting", "three-point lighting", "key light", "fill light", "rim light", "professional lighting"] },
  { id: "rembrandt", label: "Rembrandt Lighting", tags: ["rembrandt lighting", "triangle of light", "dramatic shadow", "classic portrait lighting"] },
  { id: "butterfly", label: "Butterfly / Paramount Lighting", tags: ["butterfly lighting", "paramount lighting", "overhead light", "shadow under nose", "glamour lighting"] },
  { id: "split", label: "Split Lighting", tags: ["split lighting", "half face lit", "half face in shadow", "dramatic contrast"] },
  { id: "rim", label: "Rim / Back Lighting", tags: ["rim lighting", "backlighting", "hair light", "silhouette rim", "edge lighting"] },
  { id: "neon", label: "Neon Lighting", tags: ["neon lighting", "neon glow", "colored light", "neon signs", "cyberpunk lighting"] },
  { id: "candlelight", label: "Candlelight", tags: ["candlelight", "warm flickering light", "romantic lighting", "soft amber glow"] },
  { id: "firelight", label: "Firelight", tags: ["firelight", "campfire glow", "warm orange light", "dancing shadows"] },
  { id: "moonlight", label: "Moonlight", tags: ["moonlight", "cool moon glow", "night lighting", "silver light", "lunar light"] },
  { id: "volumetric", label: "Volumetric / God Rays", tags: ["volumetric lighting", "god rays", "light beams", "atmospheric haze", "crepuscular rays"] },
  { id: "backlit", label: "Backlit / Silhouette", tags: ["backlit", "silhouette", "contre-jour", "light behind subject"] },
  { id: "fluorescent", label: "Fluorescent / Cold", tags: ["fluorescent lighting", "cold white light", "institutional lighting", "harsh overhead"] },
  { id: "warm-interior", label: "Warm Interior", tags: ["warm interior lighting", "lamp light", "tungsten", "incandescent", "cozy warm glow"] },
  { id: "dramatic", label: "Dramatic / Chiaroscuro", tags: ["dramatic lighting", "chiaroscuro", "strong contrast", "light and shadow", "moody lighting"] },
  { id: "soft-box", label: "Softbox / Diffused", tags: ["softbox lighting", "diffused light", "soft shadows", "even illumination", "beauty lighting"] },
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
  "monochrome", "black and white", "grayscale", "desaturated",
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
