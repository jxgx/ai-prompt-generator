# PromptForge v3.0 — Worklog

## Build Status: ✅ PASSED

```
Route (app)
┌ ○ /
├ ○ /_not-found
└ ƒ /api
```

## Changes Summary

### File 1: `/home/z/my-project/src/lib/prompt-data.ts`
**Major rewrite — data layer overhaul**

| Feature | Before | After |
|---------|--------|-------|
| Director Styles | None | 4 options: Default, Helmut Newton, Terry Richardson, N.W. Refn |
| NSFW Actions | ~50 | 55+ specific acts across 10+ body-focus categories |
| SFW Actions | ~30 | 35+ diverse everyday activities |
| Scene Moods | 2 per scene | 5 per scene (across all 60+ scenes) |
| MOODS array | None | 55 unique mood descriptors for randomization |
| Director Style Interface | N/A | `DirectorStyle` interface with `id`, `label`, `description`, `tags` |
| Director Style Tags | N/A | 15-17 style-specific tags per director |

**New NSFW categories added:**
- Undressing/Exposure (12 acts)
- Ass Focus (5 acts)
- Pussy/Vaginal Focus (4 acts)
- Masturbation (6 acts)
- Breasts Focus (3 acts)
- Oral (6 acts)
- Penetrative Sex (9 acts)
- BDSM/Bondage (5 acts)
- Body Part Focus (7 acts: armpits, feet, thighs, navel, saliva, sweat)
- Exhibitionism/Voyeur (3 acts)
- Climax/Finish (5 acts)
- Scene/Location Sex (4 acts)
- Sensual/Teasing (5 acts)

### File 2: `/home/z/my-project/src/lib/prompt-generator.ts`
**Major rewrite — diversity engine + director style injection**

| Feature | Before | After |
|---------|--------|-------|
| Per-prompt diversity | Same scene for all prompts | Each prompt gets unique scene, action, camera, lighting, art style, mood |
| Pool-based approach | N/A (random with repeats) | `createPool()` shuffles arrays, picks sequentially — no duplicates within batch |
| Director Style | Not supported | `directorStyle` field on `GeneratorConfig`, tags injected into every prompt |
| quickGenerate() | ONE scene for ALL prompts | EACH prompt gets different scene, action, camera, lighting, art style, mood |
| quickGenerate() signature | `(modelId, count, character?)` | `(modelId, count, character?, directorStyle?)` |
| Camera angle per prompt | Random (could repeat) | Pooled — unique per prompt |
| Lighting per prompt | Random (could repeat) | Pooled — unique per prompt |
| Art style per prompt | Random (could repeat) | Pooled — unique per prompt |
| Mood per prompt | N/A | Pooled — 55 moods, unique per prompt |
| Director tag injection | N/A | Tags appended to every prompt when director style is selected |
| 3:7 SFW/NSFW ratio | ✅ Kept | ✅ Kept |
| Single focal action | ✅ Kept | ✅ Kept |
| Character persistence | ✅ Kept | ✅ Kept |

### File 3: `/home/z/my-project/src/components/prompt-generator.tsx`
**Major rewrite — UI enhancements**

| Feature | Before | After |
|---------|--------|-------|
| Director Style Dropdown | None | New dropdown between scene and separator, with Clapperboard icon |
| Director style tag preview | None | Shows tags below dropdown when a director is selected |
| SingleSelectDropdown | Radix Select (can't unset) | Custom Popover with "-- random --" first option, re-click to clear |
| MultiSelectDropdown | Unchanged | Unchanged (already had clear button) |
| quickGenerate() call | `quickGenerate(model, count, character)` | `quickGenerate(model, count, character, directorStyle)` |
| handleGenerate() config | No directorStyle | Passes `directorStyle` to GeneratorConfig |
| Director count in header | `COMPANION_THEMES.length themes` | `DIRECTOR_STYLES.length - 1 directors` |
| Footer stats | `3 SFW + 7 NSFW` | Adds `NSFW_ACTIONS.length nsfw actions` and `SFW_ACTIONS.length sfw actions` |
| Empty state text | Basic | Adds "each prompt is unique" note |
| Version number | v2.0 | v3.0 |
| Unset expression default | `expression: 'happy'` | `expression: ''` (random by default) |

### SingleSelectDropdown Reset Mechanism
- Replaced Radix Select with custom Popover implementation
- First option is always "-- random --" (value = empty string)
- Clicking the currently selected value clears it (resets to random)
- Visual: highlighted option with `bg-gray-900 text-white` styling
- Identical visual style to the MultiSelectDropdown for consistency

### Director Style Implementation
- **Helmut Newton**: 15 tags — high contrast, dramatic shadows, powerful women, voyeuristic framing, B&W with selective color, fashion photography
- **Terry Richardson**: 15 tags — harsh direct flash, washed-out colors, raw/unedited, snapshot feel, white background, intimate
- **N.W. Refn**: 15 tags — neon-drenched, extreme color grading, atmospheric haze, slow-motion cinematic, hyper-stylized, noir

### Diversity Guarantee
The pool-based approach ensures that within a batch of N prompts:
- Each prompt gets a different scene (from pool of 60+)
- Each prompt gets a different action (from pool of 55+ NSFW or 35+ SFW)
- Each prompt gets a different camera angle (from pool of 10)
- Each prompt gets a different lighting setup (from pool of 20)
- Each prompt gets a different art style (from pool of 11)
- Each prompt gets a different mood (from pool of 55)
- Character attributes remain constant across all prompts
