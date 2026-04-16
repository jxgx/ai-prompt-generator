---
Task ID: 1
Agent: Main Agent
Task: Prompt Forge v3.0 — Remove illustration styles, add TikTok scenes, fix prompts, carry character

Work Log:
- Read all existing source files: prompt-data.ts (799 lines), prompt-generator.ts (416 lines), prompt-generator.tsx (887 lines), globals.css
- Identified all accumulated requirements from previous conversation context
- Removed illustration-based art styles from ART_STYLES (pixel art, retro pixel, anime, oil painting, watercolor, comic/manga, pastel, fantasy art)
- Replaced with 11 realism-focused styles (photorealistic, hyperrealistic, cinematic, studio photo, natural photo, street photo, portrait, noir, vintage, glamour, editorial)
- Added 10 new TikTok-style scenes to Urban category: dorm room, coffee shop, car interior, mall fitting room, bathroom mirror selfie, bedroom mirror selfie, laundromat, grocery store, parking garage, stairwell
- Rewrote prompt-generator.ts (v3.0):
  - Each prompt now has ONE focal action -- if NSFW, one explicit sexual expression; if SFW, one main activity/pose
  - Model-tailored prompt formatting: danbooru tags for SD 1.5, pony score system for FluxPony, natural language for SDXL/XL Porn/Z-Image
  - quickGenerate() now accepts optional CharacterConfig parameter -- user's custom physical attributes persist through random generations
  - Natural language models separate quality meta tags from descriptive tags for cleaner prompts
- Updated prompt-generator.tsx:
  - handleQuickRandom now passes character to quickGenerate so attributes carry over
  - Updated tooltip text to reflect character persistence
- Updated globals.css with solid background rules for all Radix dropdown/popover components
- Build verified: clean compile, no errors

Stage Summary:
- All illustration/art styles removed; default is now realism/photorealism
- 10 new TikTok-style everyday scenes added
- Each prompt is hyper-focused on ONE main purpose
- Custom character attributes persist through fully_random() generation
- Prompt formatting tailored per model base
- Solid dropdown backgrounds enforced via CSS
