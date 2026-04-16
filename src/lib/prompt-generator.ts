// ──────────────────────────────────────────────
// Prompt Generation Engine v2.0
// SFW/NSFW split + XXX explicit actions for infatuated.ai
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

  // Calculate SFW/NSFW split (3 SFW + rest NSFW for counts >= 5)
  // For counts < 5: use proportional split (30% SFW, 70% NSFW, min 1 each)
  let sfwCount: number;
  let nsfwCount: number;

  if (count >= 5) {
    // Standard split: 3 SFW + (count - 3) NSFW
    sfwCount = 3;
    nsfwCount = count - 3;
  } else if (count >= 3) {
    sfwCount = 1;
    nsfwCount = count - 1;
  } else {
    sfwCount = 1;
    nsfwCount = count - 1;
  }

  // Generate SFW prompts
  for (let i = 0; i < sfwCount; i++) {
    const positive = buildPositivePrompt(config, model, scene, false);
    const negative = buildNegativePrompt(config, model);
    const action = config.includeAction ? pickOne(SFW_ACTIONS) : null;

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
      actionLabel: action?.label || undefined,
    });
  }

  // Generate NSFW prompts
  for (let i = 0; i < nsfwCount; i++) {
    const positive = buildPositivePrompt(config, model, scene, true);
    const negative = buildNegativePrompt(config, model);
    const action = config.includeAction ? pickOne(NSFW_ACTIONS) : null;

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
      actionLabel: action?.label || undefined,
    });
  }

  // Shuffle the final array so SFW/NSFW are mixed
  return shuffleArray(prompts);
}

function buildPositivePrompt(
  config: GeneratorConfig,
  model: ModelConfig,
  scene: Scene,
  nsfw: boolean
): string {
  const tags: string[] = [];

  // 1. Quality tags (prepend if model requires)
  if (model.prependQuality) {
    tags.push(...model.qualityTags);
  }

  // 2. Subject / Character tags
  if (config.mode === "companion") {
    tags.push(...buildCompanionSubjectTags(config, nsfw));
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

  // 4. Companion theme tags (clothing/roleplay)
  if (config.mode === "companion" && config.companionTheme) {
    const theme = COMPANION_THEMES.find((t) => t.id === config.companionTheme);
    if (theme) {
      tags.push(...theme.tags);
    }
  }

  // 5. Action — use NSFW or SFW based on flag
  if (config.includeAction) {
    if (nsfw) {
      const action = pickOne(NSFW_ACTIONS);
      tags.push(...action.tags);
    } else {
      const action = pickOne(SFW_ACTIONS);
      tags.push(...action.tags);
    }
  }

  // 6. Art style
  if (config.includeArtStyle) {
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

  // Format based on model style
  return formatPrompt(tags, model);
}

function buildCompanionSubjectTags(config: GeneratorConfig, nsfw: boolean): string[] {
  const tags: string[] = [];

  // In companion mode, the "subject" is the user ("you")
  tags.push("POV");

  if (config.character.expression) {
    tags.push(...resolveAttributeTags("expression", config.character.expression));
  }

  if (config.character.pose && config.character.pose.length > 0) {
    tags.push(...resolveAttributeTags("pose", config.character.pose));
  }

  // Companion interaction actions (context-appropriate)
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
    tags.push(pickOne(nsfwCompanionActions));
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
    tags.push(pickOne(sfwCompanionActions));
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
  if (char.accessories && config.character.accessories?.length) tags.push(...resolveAttributeTags("accessories", config.character.accessories));

  return tags;
}

function buildNegativePrompt(
  config: GeneratorConfig,
  model: ModelConfig
): string {
  const negatives: string[] = [...model.negativePrompts];
  negatives.push(...pickRandom(EXTRA_NEGATIVE_TAGS, 8));
  const unique = [...new Set(negatives)];
  return unique.join(", ");
}

function formatPrompt(tags: string[], model: ModelConfig): string {
  const unique = [...new Set(tags)];
  const clean = unique.filter((t) => t.trim().length > 0);
  return clean.join(model.tagSeparator);
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

// ─── Quick Generate (Random Everything) ───────

export function quickGenerate(modelId: string, count: number = 10): GeneratedPrompt[] {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) throw new Error(`Model not found: ${modelId}`);

  const randomScene = pickOne(SCENES);
  const randomGender = pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "gender")!.options);
  const randomAge = pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "age")!.options);
  const randomBodyType = pickRandom(CHARACTER_ATTRIBUTES.find((a) => a.id === "body-type")!.options, 2);
  const randomEthnicity = pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "ethnicity")!.options);
  const randomHairColor = pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "hair-color")!.options);
  const randomHairStyle = pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "hair-style")!.options);
  const randomEyeColor = pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "eye-color")!.options);
  const randomSkinTone = pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "skin-tone")!.options);
  const randomExpression = pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "expression")!.options);
  const randomPose = pickOne(CHARACTER_ATTRIBUTES.find((a) => a.id === "pose")!.options);
  const randomClothing = pickRandom(CHARACTER_ATTRIBUTES.find((a) => a.id === "clothing")!.options, 2);
  const randomAccessories = pickRandom(CHARACTER_ATTRIBUTES.find((a) => a.id === "accessories")!.options, 2);

  return generatePrompts({
    model: modelId,
    mode: "custom",
    scene: randomScene.id,
    character: {
      gender: randomGender.id,
      age: randomAge.id,
      bodyType: randomBodyType.map((o) => o.id),
      ethnicity: randomEthnicity.id,
      hairColor: randomHairColor.id,
      hairStyle: [randomHairStyle.id],
      eyeColor: randomEyeColor.id,
      skinTone: randomSkinTone.id,
      expression: randomExpression.id,
      pose: [randomPose.id],
      clothing: randomClothing.map((o) => o.id),
      accessories: randomAccessories.map((o) => o.id),
    },
    includeAction: true,
    includeArtStyle: true,
    includeCameraAngle: true,
    includeLighting: true,
    includeExtraQuality: true,
    nsfwLevel: "explicit",
    promptCount: count,
  });
}
