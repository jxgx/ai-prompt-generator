// ──────────────────────────────────────────────
// Prompt Generation Engine v3.0
// Model-tailored styles, one focal purpose, character persistence
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

// ─── Core Generator with SFW/NSFW Split ──────

export function generatePrompts(config: GeneratorConfig): GeneratedPrompt[] {
  const model = MODELS.find((m) => m.id === config.model);
  if (!model) throw new Error(`Model not found: ${config.model}`);

  const scene = SCENES.find((s) => s.id === config.scene);
  if (!scene) throw new Error(`Scene not found: ${config.scene}`);

  const prompts: GeneratedPrompt[] = [];
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
    nsfwCount = count - 1;
  }

  // Generate SFW prompts — ONE focal action per prompt
  for (let i = 0; i < sfwCount; i++) {
    const sfwAction = pickOne(SFW_ACTIONS);
    const positive = buildPositivePrompt(config, model, scene, false, sfwAction);
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

  // Generate NSFW prompts — ONE explicit action per prompt
  for (let i = 0; i < nsfwCount; i++) {
    const nsfwAction = pickOne(NSFW_ACTIONS);
    const positive = buildPositivePrompt(config, model, scene, true, nsfwAction);
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
  focalAction: { id: string; label: string; tags: string[] } | null
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
  if (scene.mood && scene.mood.length > 0) {
    tags.push(pickOne(scene.mood));
  }

  // 4. Companion theme tags
  if (config.mode === "companion" && config.companionTheme) {
    const theme = COMPANION_THEMES.find((t) => t.id === config.companionTheme);
    if (theme) {
      tags.push(...theme.tags);
    }
  }

  // 5. ONE focal action — the core purpose of the prompt
  // This is the single focused expression: one NSFW act OR one SFW activity
  if (config.includeAction && focalAction) {
    tags.push(...focalAction.tags);
  }

  // 6. Art style — always realism-focused (no illustration styles)
  if (config.includeArtStyle) {
    // Default: always add realism base for non-anime models
    if (model.promptStyle !== "pony" && model.promptStyle !== "illustrious") {
      tags.push("photorealistic", "realistic");
    }
    const style = pickOne(ART_STYLES);
    tags.push(...style.tags);
  }

  // 7. Camera angle
  if (config.includeCameraAngle) {
    const cam = pickOne(CAMERA_ANGLES);
    tags.push(...cam.tags);
  }

  // 8. Lighting
  if (config.includeLighting && config.companionLighting) {
    const light = LIGHTING_OPTIONS.find((l) => l.id === config.companionLighting);
    if (light) {
      tags.push(...light.tags);
    }
  } else if (config.includeLighting) {
    const light = pickOne(LIGHTING_OPTIONS);
    tags.push(...light.tags);
  }

  // 9. Extra quality tags
  if (config.includeExtraQuality) {
    tags.push(...pickRandom(EXTRA_QUALITY_TAGS, 4));
  }

  // 10. Quality tags (append if model doesn't prepend)
  if (!model.prependQuality) {
    tags.push(...model.qualityTags);
  }

  // Format based on model style — this is the key differentiator
  return formatPromptForModel(tags, model);
}

// ─── Model-Tailored Prompt Formatting ──────────

function formatPromptForModel(tags: string[], model: ModelConfig): string {
  const unique = Array.from(new Set(tags));
  const clean = unique.filter((t) => t.trim().length > 0);

  switch (model.promptStyle) {
    case "danbooru":
      // SD 1.5 — Danbooru tags: comma-separated, weighted emphasis on character and quality
      return clean.join(", ");

    case "pony":
      // Pony V6 XL — score system + anime tags, comma-separated
      return clean.join(", ");

    case "illustrious":
      // Illustrious XL — detailed anime tags, comma-separated, long descriptions work
      return clean.join(", ");

    case "chroma":
      // Chroma — vibrant tags, comma-separated
      return clean.join(", ");

    case "zimage":
      // Z-Image — natural language descriptions, more flowing
      return clean.join(", ");

    case "natural":
    default:
      // SDXL, XL Porn — natural language, flowing descriptive sentences
      // Format: quality tags first, then a natural-language description of the scene
      return formatAsNaturalLanguage(clean, model);

    // For SDXL and XL Porn, we build more sentence-like prompts
  }
}

function formatAsNaturalLanguage(tags: string[], model: ModelConfig): string {
  // Separate quality/meta tags from descriptive tags
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

  // Build: quality prefix, then descriptive tags joined naturally
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

  // ONE focal companion interaction — driven by the action passed in
  if (nsfw) {
    const nsfwCompanionActions = [
      "kissing viewer passionately",
      "pressing body against viewer",
      "straddling viewer",
      "whispering seductively to viewer",
      "looking at viewer with bedroom eyes",
      "sitting on viewer's lap",
      "crawling toward viewer on bed",
      "pulling viewer close",
      "taking viewer's hand and placing it on body",
      "undressing in front of viewer",
      "lying in bed inviting viewer",
      "biting lip while looking at viewer",
      "giving viewer a lap dance",
      "pinning viewer against wall",
    ];
    // Use focal action tags if available, otherwise pick one
    if (focalAction) {
      tags.push(...focalAction.tags);
    } else {
      tags.push(pickOne(nsfwCompanionActions));
    }
  } else {
    const sfwCompanionActions = [
      "talking to viewer",
      "making eye contact with viewer",
      "interacting with viewer",
      "leaning toward viewer",
      "reaching out to viewer",
      "embracing viewer",
      "whispering to viewer",
      "looking lovingly at viewer",
      "smiling at viewer",
      "kissing viewer on cheek",
      "holding hands with viewer",
      "cuddling with viewer",
      "sitting next to viewer",
      "leaning head on viewer's shoulder",
    ];
    if (focalAction) {
      tags.push(...focalAction.tags);
    } else {
      tags.push(pickOne(sfwCompanionActions));
    }
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

// ─── Quick Generate (Random Everything BUT keeps character) ───────
// User's custom physical attributes carry over to all random prompts

export function quickGenerate(
  modelId: string,
  count: number = 10,
  existingCharacter?: CharacterConfig
): GeneratedPrompt[] {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) throw new Error(`Model not found: ${modelId}`);

  const randomScene = pickOne(SCENES);

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

  return generatePrompts({
    model: modelId,
    mode: "custom",
    scene: randomScene.id,
    character,
    includeAction: true,
    includeArtStyle: true,
    includeCameraAngle: true,
    includeLighting: true,
    includeExtraQuality: true,
    nsfwLevel: "explicit",
    promptCount: count,
  });
}
