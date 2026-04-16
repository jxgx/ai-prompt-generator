// ──────────────────────────────────────────────
// Prompt Generation Engine v4.0
// Director style weights, pool-based diversity, per-prompt randomization
// No repeats within a batch: scene, action, camera, lighting, art style
// ──────────────────────────────────────────────

import {
  MODELS,
  SCENES,
  CHARACTER_ATTRIBUTES,
  SFW_ACTIONS,
  NSFW_ACTIONS,
  ART_STYLES,
  CAMERA_ANGLES,
  LIGHTING_OPTIONS,
  COMPANION_THEMES,
  EXTRA_QUALITY_TAGS,
  EXTRA_NEGATIVE_TAGS,
  DIRECTOR_STYLES,
  MOODS,
  pickRandom,
  pickOne,
  shuffleArray,
  type ModelConfig,
  type Scene,
  type CharacterAttribute,
} from "./prompt-data";

// ─── Types ────────────────────────────────────

export type GeneratorMode = "companion" | "custom";

export interface CharacterConfig {
  gender?: string;
  age?: string;
  bodyType?: string[];
  ethnicity?: string;
  hairColor?: string;
  hairStyle?: string[];
  eyeColor?: string;
  skinTone?: string;
  clothing?: string[];
  expression?: string;
  pose?: string[];
  accessories?: string[];
}

export interface GeneratorConfig {
  model: string;
  mode: GeneratorMode;
  scene: string;
  character: CharacterConfig;
  companionTheme?: string;
  companionLighting?: string;
  includeAction: boolean;
  includeArtStyle: boolean;
  includeCameraAngle: boolean;
  includeLighting: boolean;
  includeExtraQuality: boolean;
  nsfwLevel: "safe" | "suggestive" | "explicit";
  customSubject?: string;
  promptCount: number;
  directorStyle?: string;
}

export interface GeneratedPrompt {
  id: string;
  positive: string;
  negative: string;
  model: string;
  modelName: string;
  scene: string;
  steps: number;
  cfg: number;
  sampler: string;
  seed?: number;
  isNsfw: boolean;
  actionLabel?: string;
}

// ─── Pool Helper: creates a no-repeat pool ────

function createPool<T>(arr: T[], count: number): T[] {
  // Shuffle the array and take `count` items, cycling if needed
  const shuffled = shuffleArray(arr);
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result;
}

// ─── Helper: resolve tags from attribute IDs ──

function resolveAttributeTags(
  attrId: string,
  optionIds: string | string[] | undefined
): string[] {
  if (!optionIds) return [];
  const attr = CHARACTER_ATTRIBUTES.find((a) => a.id === attrId);
  if (!attr) return [];
  const ids = Array.isArray(optionIds) ? optionIds : [optionIds];
  return ids.flatMap((id) => {
    const opt = attr.options.find((o) => o.id === id);
    return opt ? opt.tags : [];
  });
}

// ─── Resolve director style tags ─────────────

function getDirectorStyleTags(directorStyleId: string | undefined): string[] {
  if (!directorStyleId || directorStyleId === "none") return [];
  const style = DIRECTOR_STYLES.find((s) => s.id === directorStyleId);
  return style?.tags || [];
}

// ─── Core Generator with Diversity Engine ─────

export function generatePrompts(config: GeneratorConfig): GeneratedPrompt[] {
  const model = MODELS.find((m) => m.id === config.model);
  if (!model) throw new Error(`Model not found: ${config.model}`);

  const count = config.promptCount;

  // Calculate SFW/NSFW split (3:7 ratio for >= 5 prompts)
  let sfwCount: number;
  let nsfwCount: number;

  if (count >= 5) {
    sfwCount = 3;
    nsfwCount = count - 3;
  } else if (count >= 3) {
    sfwCount = 1;
    nsfwCount = count - 1;
  } else {
    sfwCount = 1;
    nsfwCount = Math.max(0, count - 1);
  }

  // Director style tags (injected into every prompt if set)
  const directorTags = getDirectorStyleTags(config.directorStyle);

  // ── POOL-BASED DIVERSITY ──
  // Create shuffled pools so each prompt gets a unique item (no repeats within batch)

  // Scene: use the selected scene (in generate mode, scene is fixed by user)
  const scene = SCENES.find((s) => s.id === config.scene);
  if (!scene) throw new Error(`Scene not found: ${config.scene}`);

  // SFW actions pool — unique per prompt
  const sfwActionPool = createPool(SFW_ACTIONS, sfwCount);
  // NSFW actions pool — unique per prompt
  const nsfwActionPool = createPool(NSFW_ACTIONS, nsfwCount);

  // Camera angle pool — unique across all prompts
  const cameraPool = createPool(CAMERA_ANGLES, count);
  // Lighting pool — unique across all prompts (but leave room for companion override)
  const lightingPool = createPool(LIGHTING_OPTIONS, count);
  // Art style pool — unique across all prompts
  const artStylePool = createPool(ART_STYLES, count);
  // Mood pool — unique across all prompts
  const moodPool = createPool(MOODS, count);

  const prompts: GeneratedPrompt[] = [];
  let poolIndex = 0;

  // Generate SFW prompts — ONE focal action per prompt, unique camera/lighting/art
  for (let i = 0; i < sfwCount; i++) {
    const sfwAction = sfwActionPool[i];
    const camera = cameraPool[poolIndex];
    const lighting = lightingPool[poolIndex];
    const artStyle = artStylePool[poolIndex];
    const mood = moodPool[poolIndex];
    poolIndex++;

    const positive = buildPositivePrompt(
      config, model, scene, false, sfwAction,
      camera, lighting, artStyle, mood, directorTags
    );
    const negative = buildNegativePrompt(config, model);

    prompts.push({
      id: `prompt-${Date.now()}-${i}`,
      positive,
      negative,
      model: model.id,
      modelName: model.name,
      scene: scene.name,
      steps: model.defaultSteps,
      cfg: model.defaultCfg,
      sampler: model.defaultSampler,
      seed: Math.floor(Math.random() * 2147483647),
      isNsfw: false,
      actionLabel: config.includeAction ? sfwAction.label : undefined,
    });
  }

  // Generate NSFW prompts — ONE explicit action per prompt, unique everything
  for (let i = 0; i < nsfwCount; i++) {
    const nsfwAction = nsfwActionPool[i];
    const camera = cameraPool[poolIndex];
    const lighting = lightingPool[poolIndex];
    const artStyle = artStylePool[poolIndex];
    const mood = moodPool[poolIndex];
    poolIndex++;

    const positive = buildPositivePrompt(
      config, model, scene, true, nsfwAction,
      camera, lighting, artStyle, mood, directorTags
    );
    const negative = buildNegativePrompt(config, model);

    prompts.push({
      id: `prompt-${Date.now()}-${sfwCount + i}`,
      positive,
      negative,
      model: model.id,
      modelName: model.name,
      scene: scene.name,
      steps: model.defaultSteps,
      cfg: model.defaultCfg,
      sampler: model.defaultSampler,
      seed: Math.floor(Math.random() * 2147483647),
      isNsfw: true,
      actionLabel: config.includeAction ? nsfwAction.label : undefined,
    });
  }

  // Shuffle the final array so SFW/NSFW are mixed
  return shuffleArray(prompts);
}

// ─── Build Positive Prompt (ONE focal purpose) ──

function buildPositivePrompt(
  config: GeneratorConfig,
  model: ModelConfig,
  scene: Scene,
  nsfw: boolean,
  focalAction: { id: string; label: string; tags: string[] } | null,
  camera: { id: string; label: string; tags: string[] },
  lighting: { id: string; label: string; tags: string[] },
  artStyle: { id: string; label: string; tags: string[] },
  mood: string,
  directorTags: string[],
): string {
  const tags: string[] = [];

  // 1. Quality tags (prepend if model requires)
  if (model.prependQuality) {
    tags.push(...model.qualityTags);
  }

  // 2. Subject / Character tags
  if (config.mode === "companion") {
    tags.push(...buildCompanionSubjectTags(config, nsfw, focalAction));
  } else {
    tags.push(...buildCustomCharacterTags(config, model));
  }

  // 3. Scene tags
  tags.push(...scene.tags);
  if (scene.lighting && scene.lighting.length > 0) {
    tags.push(pickOne(scene.lighting));
  }

  // 4. Mood — from pool, ensuring diversity
  tags.push(mood);

  // 5. Companion theme tags
  if (config.mode === "companion" && config.companionTheme) {
    const theme = COMPANION_THEMES.find((t) => t.id === config.companionTheme);
    if (theme) {
      tags.push(...theme.tags);
    }
  }

  // 6. ONE focal action — the core purpose of the prompt
  if (config.includeAction && focalAction) {
    tags.push(...focalAction.tags);
  }

  // 7. Director style — injected into EVERY prompt when selected
  if (directorTags.length > 0) {
    tags.push(...directorTags);
  }

  // 8. Art style — unique per prompt from pool
  if (config.includeArtStyle) {
    if (model.promptStyle !== "pony" && model.promptStyle !== "illustrious") {
      tags.push("photorealistic", "realistic");
    }
    tags.push(...artStyle.tags);
  }

  // 9. Camera angle — unique per prompt from pool
  if (config.includeCameraAngle) {
    tags.push(...camera.tags);
  }

  // 10. Lighting — unique per prompt from pool (or user override in companion mode)
  if (config.includeLighting && config.companionLighting) {
    const userLight = LIGHTING_OPTIONS.find((l) => l.id === config.companionLighting);
    if (userLight) {
      tags.push(...userLight.tags);
    }
  } else if (config.includeLighting) {
    tags.push(...lighting.tags);
  }

  // 11. Extra quality tags
  if (config.includeExtraQuality) {
    tags.push(...pickRandom(EXTRA_QUALITY_TAGS, 4));
  }

  // 12. Quality tags (append if model doesn't prepend)
  if (!model.prependQuality) {
    tags.push(...model.qualityTags);
  }

  // Format based on model style
  return formatPromptForModel(tags, model);
}

// ─── Model-Tailored Prompt Formatting ──────────

function formatPromptForModel(tags: string[], model: ModelConfig): string {
  const unique = Array.from(new Set(tags));
  const clean = unique.filter((t) => t.trim().length > 0);

  switch (model.promptStyle) {
    case "danbooru":
      return clean.join(", ");
    case "pony":
      return clean.join(", ");
    case "illustrious":
      return clean.join(", ");
    case "chroma":
      return clean.join(", ");
    case "zimage":
      return clean.join(", ");
    case "natural":
    default:
      return formatAsNaturalLanguage(clean, model);
  }
}

function formatAsNaturalLanguage(tags: string[], model: ModelConfig): string {
  const qualityMeta = new Set([
    "masterpiece", "best quality", "highly detailed", "8k resolution",
    "professional photography", "sharp focus", "cinematic lighting",
    "depth of field", "bokeh", "highres", "ultra-detailed", "absurdres",
    "intricate detail", "realistic", "photorealistic", "8k", "raw photo",
    "professional photography", "detailed skin texture", "natural lighting",
    "high resolution", "detailed", "professional", "sharp",
    "photorealistic", "realistic", "DSLR photo", "ultra realistic",
    "ultra detailed", "8k photo", "cinematic", "movie still", "film grain",
    "studio photography", "professional photo shoot", "professional lighting",
    "model photoshoot", "natural photo", "candid photo", "everyday photography",
    "lifestyle photo", "street photography", "candid street shot",
    "urban photography", "portrait photography", "headshot",
    "beauty portrait", "professional portrait", "film noir",
    "high contrast black and white", "dramatic shadows", "vintage photo",
    "retro style", "film photography", "aged photo", "glamour photography",
    "glamour shot", "beauty shot", "fashion photography",
    "editorial photography", "magazine cover", "fashion editorial",
    "vogue style",
    "perfect anatomy", "correct anatomy", "proper proportions",
    "detailed face", "detailed eyes", "detailed skin",
    "symmetrical face", "beautiful detailed eyes",
    "no artifacts", "clean image", "professional quality",
    "vibrant colors", "rich colors", "colorful",
    // Director style meta tags
    "Helmut Newton style", "Terry Richardson style", "Nicholas Winding Refn style",
  ]);

  const qualityTags: string[] = [];
  const descriptiveTags: string[] = [];

  for (const tag of tags) {
    if (qualityMeta.has(tag)) {
      qualityTags.push(tag);
    } else {
      descriptiveTags.push(tag);
    }
  }

  const prefix = qualityTags.join(", ");
  const description = descriptiveTags.join(", ");

  if (description) {
    return prefix ? `${prefix}, ${description}` : description;
  }
  return prefix;
}

function buildCompanionSubjectTags(
  config: GeneratorConfig,
  nsfw: boolean,
  focalAction: { id: string; label: string; tags: string[] } | null
): string[] {
  const tags: string[] = [];
  tags.push("POV");

  if (config.character.expression) {
    tags.push(...resolveAttributeTags("expression", config.character.expression));
  }

  if (config.character.pose && config.character.pose.length > 0) {
    tags.push(...resolveAttributeTags("pose", config.character.pose));
  }

  if (focalAction) {
    tags.push(...focalAction.tags);
  }

  return tags;
}

function buildCustomCharacterTags(
  config: GeneratorConfig,
  model: ModelConfig
): string[] {
  const tags: string[] = [];
  const char = config.character;

  if (char.gender) tags.push(...resolveAttributeTags("gender", char.gender));
  if (char.age) tags.push(...resolveAttributeTags("age", char.age));
  if (char.ethnicity) tags.push(...resolveAttributeTags("ethnicity", char.ethnicity));
  if (char.skinTone) tags.push(...resolveAttributeTags("skin-tone", char.skinTone));
  if (char.bodyType && char.bodyType.length > 0) tags.push(...resolveAttributeTags("body-type", char.bodyType));
  if (char.hairColor) tags.push(...resolveAttributeTags("hair-color", char.hairColor));
  if (char.hairStyle && char.hairStyle.length > 0) tags.push(...resolveAttributeTags("hair-style", char.hairStyle));
  if (char.eyeColor) tags.push(...resolveAttributeTags("eye-color", char.eyeColor));
  if (char.expression) tags.push(...resolveAttributeTags("expression", char.expression));
  if (char.pose && char.pose.length > 0) tags.push(...resolveAttributeTags("pose", char.pose));
  if (char.clothing && char.clothing.length > 0) tags.push(...resolveAttributeTags("clothing", char.clothing));
  if (char.accessories && char.accessories?.length) tags.push(...resolveAttributeTags("accessories", char.accessories));

  return tags;
}

function buildNegativePrompt(
  config: GeneratorConfig,
  model: ModelConfig
): string {
  const negatives: string[] = [...model.negativePrompts];
  negatives.push(...pickRandom(EXTRA_NEGATIVE_TAGS, 8));
  const unique = Array.from(new Set(negatives));
  return unique.join(", ");
}

// ─── Export All Prompts as Text ───────────────

export function exportPromptsAsText(prompts: GeneratedPrompt[]): string {
  return prompts
    .map((p, i) => {
      let text = `--- Prompt ${i + 1} ---\n`;
      text += `Model: ${p.modelName}\n`;
      text += `Scene: ${p.scene}\n`;
      text += `Rating: ${p.isNsfw ? "NSFW" : "SFW"}\n`;
      if (p.actionLabel) text += `Action: ${p.actionLabel}\n`;
      text += `Steps: ${p.steps} | CFG: ${p.cfg} | Sampler: ${p.sampler}\n`;
      text += `Seed: ${p.seed}\n\n`;
      text += `Positive:\n${p.positive}\n\n`;
      text += `Negative:\n${p.negative}`;
      return text;
    })
    .join("\n\n");
}

// ─── Quick Generate (FULL DIVERSITY PER PROMPT) ──
// Each prompt in the batch gets a DIFFERENT:
//   - scene
//   - action (SFW or NSFW)
//   - camera angle
//   - lighting
//   - art style
//   - mood
// The ONLY constant is the user's character attributes.

export function quickGenerate(
  modelId: string,
  count: number = 10,
  existingCharacter?: CharacterConfig,
  directorStyle?: string,
): GeneratedPrompt[] {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) throw new Error(`Model not found: ${modelId}`);

  // Use existing character config if provided, otherwise randomize
  const character: CharacterConfig = existingCharacter
    ? { ...existingCharacter }
    : {
        gender: pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "gender")!.options).id,
        age: pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "age")!.options).id,
        bodyType: pickRandom(CHARACTER_ATTRIBUTES.find((a) => a.id === "body-type")!.options, 2).map((o) => o.id),
        ethnicity: pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "ethnicity")!.options).id,
        hairColor: pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "hair-color")!.options).id,
        hairStyle: [pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "hair-style")!.options).id],
        eyeColor: pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "eye-color")!.options).id,
        skinTone: pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "skin-tone")!.options).id,
        expression: pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "expression")!.options).id,
        pose: [pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "pose")!.options).id],
        clothing: pickRandom(CHARACTER_ATTRIBUTES.find((a) => a.id === "clothing")!.options, 2).map((o) => o.id),
        accessories: pickRandom(CHARACTER_ATTRIBUTES.find((a) => a.id === "accessories")!.options, 2).map((o) => o.id),
      };

  // Calculate SFW/NSFW split
  let sfwCount: number;
  let nsfwCount: number;
  if (count >= 5) {
    sfwCount = 3;
    nsfwCount = count - 3;
  } else if (count >= 3) {
    sfwCount = 1;
    nsfwCount = count - 1;
  } else {
    sfwCount = 1;
    nsfwCount = Math.max(0, count - 1);
  }

  // Director style tags
  const directorTags = getDirectorStyleTags(directorStyle);

  // ── POOL-BASED: each prompt gets a UNIQUE everything ──
  const scenePool = createPool(SCENES, count);
  const sfwActionPool = createPool(SFW_ACTIONS, sfwCount);
  const nsfwActionPool = createPool(NSFW_ACTIONS, nsfwCount);
  const cameraPool = createPool(CAMERA_ANGLES, count);
  const lightingPool = createPool(LIGHTING_OPTIONS, count);
  const artStylePool = createPool(ART_STYLES, count);
  const moodPool = createPool(MOODS, count);

  const config: GeneratorConfig = {
    model: modelId,
    mode: "custom",
    scene: "", // not used — we build per-prompt
    character,
    includeAction: true,
    includeArtStyle: true,
    includeCameraAngle: true,
    includeLighting: true,
    includeExtraQuality: true,
    nsfwLevel: "explicit",
    promptCount: count,
    directorStyle,
  };

  const prompts: GeneratedPrompt[] = [];
  let poolIndex = 0;

  // Generate SFW prompts
  for (let i = 0; i < sfwCount; i++) {
    const scene = scenePool[poolIndex];
    const action = sfwActionPool[i];
    const camera = cameraPool[poolIndex];
    const lighting = lightingPool[poolIndex];
    const artStyle = artStylePool[poolIndex];
    const mood = moodPool[poolIndex];
    poolIndex++;

    const positive = buildPositivePrompt(
      { ...config, scene: scene.id }, model, scene, false, action,
      camera, lighting, artStyle, mood, directorTags
    );
    const negative = buildNegativePrompt(config, model);

    prompts.push({
      id: `prompt-${Date.now()}-${i}`,
      positive,
      negative,
      model: model.id,
      modelName: model.name,
      scene: scene.name,
      steps: model.defaultSteps,
      cfg: model.defaultCfg,
      sampler: model.defaultSampler,
      seed: Math.floor(Math.random() * 2147483647),
      isNsfw: false,
      actionLabel: action.label,
    });
  }

  // Generate NSFW prompts
  for (let i = 0; i < nsfwCount; i++) {
    const scene = scenePool[poolIndex];
    const action = nsfwActionPool[i];
    const camera = cameraPool[poolIndex];
    const lighting = lightingPool[poolIndex];
    const artStyle = artStylePool[poolIndex];
    const mood = moodPool[poolIndex];
    poolIndex++;

    const positive = buildPositivePrompt(
      { ...config, scene: scene.id }, model, scene, true, action,
      camera, lighting, artStyle, mood, directorTags
    );
    const negative = buildNegativePrompt(config, model);

    prompts.push({
      id: `prompt-${Date.now()}-${sfwCount + i}`,
      positive,
      negative,
      model: model.id,
      modelName: model.name,
      scene: scene.name,
      steps: model.defaultSteps,
      cfg: model.defaultCfg,
      sampler: model.defaultSampler,
      seed: Math.floor(Math.random() * 2147483647),
      isNsfw: true,
      actionLabel: action.label,
    });
  }

  // Shuffle the final array
  return shuffleArray(prompts);
}
