'use client'

import React, { useState, useCallback, useMemo } from 'react'
import {
  MODELS,
  SCENES,
  SCENE_CATEGORIES,
  CHARACTER_ATTRIBUTES,
  COMPANION_THEMES,
  LIGHTING_OPTIONS,
  DIRECTOR_STYLES,
  SFW_ACTIONS,
  NSFW_ACTIONS,
  pickRandom,
  pickOne,
  type Scene,
  type CharacterAttribute,
} from '@/lib/prompt-data'
import {
  generatePrompts,
  exportPromptsAsText,
  quickGenerate,
  type GeneratorMode,
  type CharacterConfig,
  type GeneratedPrompt,
  type GeneratorConfig,
} from '@/lib/prompt-generator'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dices,
  Copy,
  Check,
  Download,
  Sparkles,
  User,
  Users,
  Settings2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Dice5,
  Zap,
  Eye,
  Shuffle,
  Palette,
  Shield,
  ShieldAlert,
  Flame,
  ChevronsUpDown,
  Clapperboard,
} from 'lucide-react'

// ─── Sub-Components ───────────────────────────

function MultiSelectDropdown({
  attribute,
  selected,
  onChange,
}: {
  attribute: CharacterAttribute
  selected: string[]
  onChange: (ids: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }
  const clear = () => onChange([])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between w-full bg-white border border-gray-300 rounded px-3 h-9 text-gray-800 font-mono text-xs hover:bg-gray-50 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-500 cursor-pointer">
          <span className="truncate">
            {selected.length > 0
              ? `${attribute.label}: ${selected.length} selected`
              : `-- ${attribute.label.toLowerCase()} --`
            }
          </span>
          <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 ml-2 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2 bg-white border-gray-300 rounded-lg shadow-lg solid" align="start" sideOffset={4}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">
            {attribute.label} <span className="text-gray-400 normal-case tracking-normal font-normal">[multi]</span>
          </span>
          {selected.length > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); clear() }}
              className="text-[10px] text-gray-400 hover:text-red-500 font-mono transition-colors cursor-pointer"
            >
              clear
            </button>
          )}
        </div>
        <ScrollArea className="max-h-48">
          <div className="space-y-0.5">
            {attribute.options.map(opt => (
              <label
                key={opt.id}
                className="flex items-center gap-2.5 px-1.5 py-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selected.includes(opt.id)}
                  onCheckedChange={() => toggle(opt.id)}
                  className="w-3.5 h-3.5 border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                />
                <span className="text-xs font-mono text-gray-700 select-none">{opt.label}</span>
              </label>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function SingleSelectDropdown({
  attribute,
  selected,
  onChange,
}: {
  attribute: CharacterAttribute
  selected: string
  onChange: (id: string) => void
}) {
  // Allow unsetting by clicking the already-selected value
  const handleValueChange = (value: string) => {
    // Radix Select fires onValueChange even when clicking the same value.
    // We detect re-click of the same value and clear it.
    if (value === selected && selected !== '') {
      onChange('')
    } else {
      onChange(value)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between w-full bg-white border border-gray-300 rounded px-3 h-9 text-gray-800 font-mono text-xs hover:bg-gray-50 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-500 cursor-pointer">
          <span className="truncate">
            {selected
              ? attribute.options.find(o => o.id === selected)?.label || selected
              : `-- random --`
            }
          </span>
          <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 ml-2 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1 bg-white border-gray-300 rounded-lg shadow-lg solid" align="start" sideOffset={4}>
        <div
          onClick={() => onChange('')}
          className={`flex items-center px-2.5 py-2 rounded cursor-pointer transition-colors text-xs font-mono ${!selected ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          -- random --
        </div>
        <Separator className="my-1" />
        <ScrollArea className="max-h-48">
          <div className="space-y-0.5">
            {attribute.options.map(opt => (
              <div
                key={opt.id}
                onClick={() => handleValueChange(opt.id)}
                className={`flex items-center px-2.5 py-2 rounded cursor-pointer transition-colors text-xs font-mono ${selected === opt.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function PromptCard({ prompt, index }: { prompt: GeneratedPrompt; index: number }) {
  const [copiedPos, setCopiedPos] = useState(false)
  const [copiedNeg, setCopiedNeg] = useState(false)
  const [showNegative, setShowNegative] = useState(false)

  const copyPositive = async () => {
    await navigator.clipboard.writeText(prompt.positive)
    setCopiedPos(true)
    setTimeout(() => setCopiedPos(false), 2000)
  }

  const copyNegative = async () => {
    await navigator.clipboard.writeText(prompt.negative)
    setCopiedNeg(true)
    setTimeout(() => setCopiedNeg(false), 2000)
  }

  const copyAll = async () => {
    const all = `${prompt.positive}\n\nNegative prompt: ${prompt.negative}\n\nSteps: ${prompt.steps}, CFG: ${prompt.cfg}, Sampler: ${prompt.sampler}, Seed: ${prompt.seed}`
    await navigator.clipboard.writeText(all)
    setCopiedPos(true)
    setTimeout(() => setCopiedPos(false), 2000)
  }

  return (
    <Card className={`border shadow-none hover:shadow-sm transition-shadow ${prompt.isNsfw ? 'bg-red-50/30 border-red-200/60' : 'bg-white border-gray-300'}`}>
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`flex items-center justify-center w-7 h-7 rounded font-mono font-bold text-[11px] ${prompt.isNsfw ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}>
              {index + 1}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xs font-bold text-gray-900 font-mono">
                  PROMPT_{String(index + 1).padStart(3, '0')}
                </CardTitle>
                {prompt.isNsfw ? (
                  <Badge className="bg-red-600 text-white text-[9px] font-mono px-1.5 py-0 hover:bg-red-700 border-0">
                    <ShieldAlert className="w-2.5 h-2.5 mr-0.5" />
                    NSFW
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-600 text-white text-[9px] font-mono px-1.5 py-0 hover:bg-emerald-700 border-0">
                    <Shield className="w-2.5 h-2.5 mr-0.5" />
                    SFW
                  </Badge>
                )}
              </div>
              <CardDescription className="text-[10px] text-gray-500 font-mono mt-0.5">
                {prompt.modelName}{" // "}{prompt.scene}{prompt.actionLabel ? `{" // "}${prompt.actionLabel}` : ''}{" // seed:"}{prompt.seed}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
              {prompt.steps} steps
            </Badge>
            <Badge variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
              cfg {prompt.cfg}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-3">
        {/* Positive Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">$ positive</span>
            <button onClick={copyPositive} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-800 transition-colors font-mono cursor-pointer">
              {copiedPos ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedPos ? 'ok' : 'copy'}
            </button>
          </div>
          <div className={`rounded border p-2.5 text-[11px] leading-relaxed font-mono break-words whitespace-pre-wrap max-h-36 overflow-y-auto custom-scrollbar ${prompt.isNsfw ? 'bg-red-50/50 border-red-100 text-gray-800' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>
            {prompt.positive}
          </div>
        </div>

        {/* Negative Prompt (collapsible) */}
        <div>
          <button onClick={() => setShowNegative(!showNegative)} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors font-mono cursor-pointer">
            {showNegative ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            $ negative
          </button>
          {showNegative && (
            <div className="mt-1.5 relative">
              <button onClick={copyNegative} className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-800 transition-colors font-mono z-10 bg-gray-50 rounded px-1 cursor-pointer">
                {copiedNeg ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedNeg ? 'ok' : 'copy'}
              </button>
              <div className="rounded bg-gray-50 border border-gray-200 p-2.5 text-[10px] text-gray-500 leading-relaxed font-mono break-words pr-14 max-h-28 overflow-y-auto custom-scrollbar">
                {prompt.negative}
              </div>
            </div>
          )}
        </div>

        {/* Copy All Button */}
        <button onClick={copyAll} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 transition-colors font-mono pt-0.5 cursor-pointer">
          <Copy className="w-3 h-3" />
          copy full prompt + settings
        </button>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ───────────────────────────

export default function PromptGenerator() {
  // State
  const [model, setModel] = useState('sdxl')
  const [mode, setMode] = useState<GeneratorMode>('custom')
  const [scene, setScene] = useState<string>('')
  const [promptCount, setPromptCount] = useState(10)
  const [directorStyle, setDirectorStyle] = useState<string>('none')
  const [companionTheme, setCompanionTheme] = useState<string>('')
  const [companionLighting, setCompanionLighting] = useState<string>('')
  const [character, setCharacter] = useState<CharacterConfig>({
    gender: 'female',
    age: '20-25',
    bodyType: [],
    ethnicity: 'caucasian',
    hairColor: 'blonde',
    hairStyle: ['long-wavy'],
    eyeColor: 'blue',
    skinTone: 'light',
    clothing: [],
    expression: '',
    pose: ['standing'],
    accessories: [],
  })
  const [includeAction, setIncludeAction] = useState(true)
  const [includeArtStyle, setIncludeArtStyle] = useState(true)
  const [includeCameraAngle, setIncludeCameraAngle] = useState(true)
  const [includeLighting, setIncludeLighting] = useState(true)
  const [includeExtraQuality, setIncludeExtraQuality] = useState(true)
  const [showAllNegatives, setShowAllNegatives] = useState(false)
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const currentModel = useMemo(() => MODELS.find((m) => m.id === model)!, [model])

  // Scene stats for header
  const sfwCount = prompts.filter((p) => !p.isNsfw).length
  const nsfwCount = prompts.filter((p) => p.isNsfw).length

  // Scenes grouped by category
  const scenesByCategory = useMemo(() => {
    const grouped: Record<string, Scene[]> = {}
    for (const cat of SCENE_CATEGORIES) {
      grouped[cat] = SCENES.filter((s) => s.category === cat)
    }
    return grouped
  }, [])

  // Companion themes grouped by category
  const themesByCategory = useMemo(() => {
    const grouped: Record<string, typeof COMPANION_THEMES> = {}
    for (const theme of COMPANION_THEMES) {
      if (!grouped[theme.category]) grouped[theme.category] = []
      grouped[theme.category].push(theme)
    }
    return grouped
  }, [])

  // Character attribute helpers
  const getAttr = (id: string) => CHARACTER_ATTRIBUTES.find((a) => a.id === id)!

  const toggleMultiAttr = (attrId: string, optId: string) => {
    setCharacter((prev) => {
      const key = attrIdToKey(attrId)
      const current = (prev[key] as string[]) || []
      const updated = current.includes(optId) ? current.filter((s) => s !== optId) : [...current, optId]
      return { ...prev, [key]: updated }
    })
  }

  const setSingleAttr = (attrId: string, value: string) => {
    setCharacter((prev) => {
      const key = attrIdToKey(attrId)
      return { ...prev, [key]: value }
    })
  }

  function attrIdToKey(id: string): keyof CharacterConfig {
    const map: Record<string, keyof CharacterConfig> = {
      gender: 'gender', age: 'age', 'body-type': 'bodyType',
      ethnicity: 'ethnicity', 'hair-color': 'hairColor', 'hair-style': 'hairStyle',
      'eye-color': 'eyeColor', 'skin-tone': 'skinTone', clothing: 'clothing',
      expression: 'expression', pose: 'pose', accessories: 'accessories',
    }
    return map[id] || id as keyof CharacterConfig
  }

  // Generate
  const handleGenerate = useCallback(() => {
    if (!scene) return
    setIsGenerating(true)
    setTimeout(() => {
      try {
        const config: GeneratorConfig = {
          model, mode, scene, character,
          companionTheme: mode === 'companion' ? companionTheme : undefined,
          companionLighting: includeLighting ? companionLighting : undefined,
          includeAction, includeArtStyle, includeCameraAngle,
          includeLighting, includeExtraQuality,
          nsfwLevel: 'explicit', promptCount,
          directorStyle: directorStyle !== 'none' ? directorStyle : undefined,
        }
        const result = generatePrompts(config)
        setPrompts(result)
      } catch (err) {
        console.error('Generation error:', err)
      } finally {
        setIsGenerating(false)
      }
    }, 150)
  }, [model, mode, scene, character, companionTheme, companionLighting, includeAction, includeArtStyle, includeCameraAngle, includeLighting, includeExtraQuality, promptCount, directorStyle])

  const handleQuickRandom = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => {
      try {
        const result = quickGenerate(
          model,
          promptCount,
          character,
          directorStyle !== 'none' ? directorStyle : undefined,
        )
        setPrompts(result)
        const lastScene = result[0]?.scene
        const sceneObj = SCENES.find((s) => s.name === lastScene)
        if (sceneObj) setScene(sceneObj.id)
      } catch (err) {
        console.error('Quick generate error:', err)
      } finally {
        setIsGenerating(false)
      }
    }, 150)
  }, [model, promptCount, character, directorStyle])

  const handleExport = useCallback(() => {
    if (prompts.length === 0) return
    const text = exportPromptsAsText(prompts)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompts-${model}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [prompts, model])

  const copyAllPrompts = useCallback(async () => {
    const text = prompts
      .map((p, i) => `[${p.isNsfw ? 'NSFW' : 'SFW'}] Prompt ${i + 1}:\n${p.positive}\nNegative: ${p.negative}`)
      .join('\n\n')
    await navigator.clipboard.writeText(text)
  }, [prompts])

  const currentDirector = DIRECTOR_STYLES.find(s => s.id === directorStyle)

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        {/* ── Sticky Header ── */}
        <header className="border-b-2 border-gray-900 bg-white sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-900">
                <Dices className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 font-mono tracking-tight uppercase">
                  prompt_forge<span className="text-gray-400">.exe</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-mono">v3.0 // infatuated.ai</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-400 font-mono">
              <span>{MODELS.length} models</span>
              <span className="text-gray-300">|</span>
              <span>{SCENES.length} scenes</span>
              <span className="text-gray-300">|</span>
              <span>{DIRECTOR_STYLES.length - 1} directors</span>
            </div>
          </div>
        </header>

        {/* ── Main Content (single column, top to bottom) ── */}
        <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">

          {/* ── Row 1: Model + Mode + Count ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Model Selector */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-9 focus:ring-1 focus:ring-gray-400 focus:border-gray-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-gray-800 font-mono text-xs focus:bg-gray-100 focus:text-black">
                      <span className="flex flex-col">
                        <span className="font-bold">{m.name}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{m.description}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mode Toggle */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">mode</Label>
              <Tabs value={mode} onValueChange={(v) => setMode(v as GeneratorMode)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 h-9 border border-gray-200">
                  <TabsTrigger value="companion" className="text-[11px] font-mono data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-none">
                    companion
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="text-[11px] font-mono data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-none">
                    custom
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Prompt Count */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">count</Label>
              <div className="flex gap-1 h-9">
                {[5, 10, 20, 50].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPromptCount(n)}
                    className={`
                      flex-1 rounded text-[11px] font-mono font-bold transition-all border cursor-pointer
                      ${promptCount === n
                        ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                        : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                      }
                    `}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Model info strip */}
          <div className="rounded bg-gray-50 border border-gray-200 px-3 py-2 flex flex-wrap items-center gap-2">
            <span className="text-[9px] text-gray-400 font-mono">{"// "}{currentModel.specialNotes}</span>
            <span className="hidden sm:inline text-gray-300">--</span>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
                {currentModel.defaultSteps} steps
              </Badge>
              <Badge variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
                cfg {currentModel.defaultCfg}
              </Badge>
              <Badge variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
                {currentModel.defaultSampler}
              </Badge>
            </div>
          </div>

          {/* ── Scene Selector ── */}
          <div className="flex items-center gap-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono shrink-0 w-14">scene</Label>
            <Select value={scene} onValueChange={setScene}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-9 focus:ring-1 focus:ring-gray-400 focus:border-gray-500">
                <SelectValue placeholder="-- choose scene --" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 max-h-80">
                {Object.entries(scenesByCategory).map(([category, scenes]) => (
                  <SelectGroup key={category}>
                    <SelectLabel className="text-[10px] text-gray-900 uppercase tracking-widest font-bold px-2 py-1 font-mono">
                      {"// "}{category}
                    </SelectLabel>
                    {scenes.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-gray-700 font-mono text-xs focus:bg-gray-100 focus:text-black">
                        {s.name}{" "}<span className="text-gray-400">{"-- "}{s.description}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scene tags preview */}
          {scene && (
            <div className="rounded bg-gray-50 border border-gray-200 px-3 py-2 flex flex-wrap gap-1 -mt-2">
              {SCENES.find((s) => s.id === scene)?.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* ── Director Style Selector ── */}
          <div className="flex items-center gap-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono shrink-0 w-14">
              <span className="flex items-center gap-1"><Clapperboard className="w-3 h-3" /> director</span>
            </Label>
            <Select value={directorStyle} onValueChange={setDirectorStyle}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-9 focus:ring-1 focus:ring-gray-400 focus:border-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 max-h-60">
                {DIRECTOR_STYLES.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-gray-700 font-mono text-xs focus:bg-gray-100 focus:text-black">
                    <span className="flex flex-col">
                      <span className="font-bold">{s.label}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{s.description}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Director style tags preview */}
          {directorStyle && directorStyle !== 'none' && currentDirector && (
            <div className="rounded bg-gray-50 border border-gray-200 px-3 py-2 flex flex-wrap gap-1 -mt-2">
              {currentDirector.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* ── Companion Mode Config ── */}
          {mode === 'companion' && (
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                companion config
              </div>

              {/* Companion Theme */}
              <div className="flex items-center gap-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono shrink-0 w-14">theme</Label>
                <Select value={companionTheme} onValueChange={setCompanionTheme}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-9 focus:ring-1 focus:ring-gray-400 focus:border-gray-500 flex-1">
                    <SelectValue placeholder="-- choose theme --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 max-h-80">
                    {Object.entries(themesByCategory).map(([category, themes]) => (
                      <SelectGroup key={category}>
                        <SelectLabel className="text-[10px] text-gray-900 uppercase tracking-widest font-bold px-2 py-1 font-mono">
                          {"// "}{category}
                        </SelectLabel>
                        {themes.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="text-gray-700 font-mono text-xs focus:bg-gray-100 focus:text-black">
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {companionTheme && (
                <div className="rounded bg-gray-50 border border-gray-200 px-3 py-2 flex flex-wrap gap-1">
                  {COMPANION_THEMES.find((t) => t.id === companionTheme)?.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Lighting */}
              <div className="flex items-center gap-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono shrink-0 w-14">lighting</Label>
                <Select value={companionLighting} onValueChange={setCompanionLighting}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-9 focus:ring-1 focus:ring-gray-400 focus:border-gray-500 flex-1">
                    <SelectValue placeholder="-- random --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 max-h-60">
                    {LIGHTING_OPTIONS.map((l) => (
                      <SelectItem key={l.id} value={l.id} className="text-gray-700 font-mono text-xs focus:bg-gray-100 focus:text-black">
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Expression */}
              <div className="flex items-center gap-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono shrink-0 w-14">expression</Label>
                <div className="flex-1">
                  <SingleSelectDropdown
                    attribute={getAttr('expression')}
                    selected={character.expression || ''}
                    onChange={(v) => setSingleAttr('expression', v)}
                  />
                </div>
              </div>

              {/* Pose (multi-select dropdown) */}
              <div className="flex items-center gap-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono shrink-0 w-14">pose</Label>
                <div className="flex-1">
                  <MultiSelectDropdown
                    attribute={getAttr('pose')}
                    selected={character.pose || []}
                    onChange={(ids) => setCharacter((prev) => ({ ...prev, pose: ids }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Custom Mode: Character Attributes ── */}
          {mode === 'custom' && (
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                character attributes
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Single-select attributes */}
                {['gender', 'age', 'ethnicity', 'hair-color', 'eye-color', 'skin-tone', 'expression'].map((attrId) => (
                  <div key={attrId} className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                      {getAttr(attrId).label}
                    </Label>
                    <SingleSelectDropdown
                      attribute={getAttr(attrId)}
                      selected={(character[attrIdToKey(attrId)] as string) || ''}
                      onChange={(v) => setSingleAttr(attrId, v)}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                multi-select attributes
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Multi-select attributes as popover dropdowns */}
                {['body-type', 'hair-style', 'clothing', 'pose', 'accessories'].map((attrId) => (
                  <div key={attrId} className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                      {getAttr(attrId).label} <span className="text-gray-300 normal-case tracking-normal font-normal">[multi]</span>
                    </Label>
                    <MultiSelectDropdown
                      attribute={getAttr(attrId)}
                      selected={(character[attrIdToKey(attrId)] as string[]) || []}
                      onChange={(ids) => {
                        const key = attrIdToKey(attrId)
                        setCharacter((prev) => ({ ...prev, [key]: ids }))
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Randomize character button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[11px] font-mono border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 h-8 cursor-pointer"
                onClick={() => {
                  setCharacter({
                    gender: pickOne(getAttr('gender').options).id,
                    age: pickOne(getAttr('age').options).id,
                    bodyType: pickRandom(getAttr('body-type').options, 2).map((o) => o.id),
                    ethnicity: pickOne(getAttr('ethnicity').options).id,
                    hairColor: pickOne(getAttr('hair-color').options).id,
                    hairStyle: [pickOne(getAttr('hair-style').options).id],
                    eyeColor: pickOne(getAttr('eye-color').options).id,
                    skinTone: pickOne(getAttr('skin-tone').options).id,
                    clothing: pickRandom(getAttr('clothing').options, 2).map((o) => o.id),
                    expression: pickOne(getAttr('expression').options).id,
                    pose: [pickOne(getAttr('pose').options).id],
                    accessories: pickRandom(getAttr('accessories').options, 2).map((o) => o.id),
                  })
                }}
              >
                <Shuffle className="w-3 h-3 mr-1.5" />
                randomize_character()
              </Button>
            </div>
          )}

          <Separator />

          {/* ── Advanced Options (collapsible) ── */}
          <div>
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono hover:text-gray-800 transition-colors cursor-pointer"
            >
              <Zap className="w-3 h-3" />
              generation options
              {advancedOpen ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
            </button>

            {advancedOpen && (
              <div className="mt-3 space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                {/* SFW/NSFW split info */}
                <div className="rounded bg-white border border-gray-200 p-2.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-gray-700 uppercase tracking-wider">
                    <Flame className="w-3 h-3" />
                    sfw / nsfw split
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                    When generating {promptCount} prompts: <span className="text-emerald-700 font-bold">{promptCount >= 5 ? 3 : 1} SFW</span> + <span className="text-red-700 font-bold">{promptCount >= 5 ? promptCount - 3 : promptCount - 1} NSFW</span> (XXX explicit actions for infatuated.ai)
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono leading-relaxed mt-1">
                    {"// each prompt gets unique: scene, action, camera angle, lighting, art style, mood — no repeats within batch"}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] text-gray-600 font-mono">random action (sfw/nsfw)</Label>
                    <Switch checked={includeAction} onCheckedChange={setIncludeAction} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] text-gray-600 font-mono">random art style</Label>
                    <Switch checked={includeArtStyle} onCheckedChange={setIncludeArtStyle} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] text-gray-600 font-mono">random camera angle</Label>
                    <Switch checked={includeCameraAngle} onCheckedChange={setIncludeCameraAngle} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] text-gray-600 font-mono">random lighting</Label>
                    <Switch checked={includeLighting} onCheckedChange={setIncludeLighting} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] text-gray-600 font-mono">quality boost</Label>
                    <Switch checked={includeExtraQuality} onCheckedChange={setIncludeExtraQuality} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* ── Generate Buttons ── */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={!scene || isGenerating}
              className="flex-1 bg-gray-900 hover:bg-black text-white font-mono font-bold text-xs h-10 uppercase tracking-wider cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                  generating...
                </>
              ) : (
                <>
                  <Dices className="w-3.5 h-3.5 mr-2" />
                  generate {promptCount} prompts
                </>
              )}
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleQuickRandom}
                  disabled={isGenerating}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 h-10 font-mono text-xs cursor-pointer"
                >
                  <Dice5 className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">fully_random()</span>
                  <span className="sm:hidden">random</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-900 text-gray-100 border-gray-700 text-[10px] font-mono max-w-[260px] solid">
                {"// randomizes scene + actions + camera + lighting per prompt. your character attributes stay locked in."}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* ── Results ── */}
          {prompts.length > 0 && (
            <div className="space-y-3">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">
                    output [{prompts.length} prompts]
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-mono px-1.5 py-0 border-0">
                    {sfwCount} sfw
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 text-[9px] font-mono px-1.5 py-0 border-0">
                    {nsfwCount} nsfw
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
                  <button onClick={() => setShowAllNegatives(!showAllNegatives)} className="hover:text-gray-700 transition-colors cursor-pointer">
                    {showAllNegatives ? '[hide negatives]' : '[show negatives]'}
                  </button>
                  <button onClick={copyAllPrompts} className="hover:text-gray-700 transition-colors cursor-pointer">
                    [copy all]
                  </button>
                  <button onClick={handleExport} className="hover:text-gray-700 transition-colors cursor-pointer">
                    [export.txt]
                  </button>
                </div>
              </div>

              {/* Prompt Cards */}
              <div className="space-y-2.5">
                {prompts.map((p, i) => (
                  <PromptCard key={p.id} prompt={p} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {prompts.length === 0 && (
            <Card className="bg-white border-gray-300 border-dashed shadow-none">
              <CardContent className="py-14 text-center">
                <Dices className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-mono font-bold text-gray-400 mb-1">no prompts generated</p>
                <p className="text-[11px] text-gray-400 font-mono max-w-md mx-auto leading-relaxed">
                  {"// select a model + scene, configure your character,"}
                  <br />{"// then hit generate. or use fully_random() to roll everything."}
                </p>
                <div className="flex items-center justify-center gap-3 mt-4 text-[10px] font-mono text-gray-400">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500" /> 3 SFW prompts</span>
                  <span>+</span>
                  <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-red-500" /> 7 NSFW (XXX) prompts</span>
                </div>
                <div className="flex items-center justify-center gap-3 mt-2 text-[10px] font-mono text-gray-400">
                  <span className="flex items-center gap-1"><Clapperboard className="w-3 h-3 text-gray-400" /> each prompt is unique: scene, action, camera, lighting, mood</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Footer ── */}
        <footer className="border-t-2 border-gray-900 mt-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-[10px] text-gray-400 font-mono">
                prompt_forge.exe v3.0 // infatuated.ai
              </p>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                <span>{MODELS.length} models</span>
                <span className="text-gray-300">|</span>
                <span>{SCENES.length} scenes</span>
                <span className="text-gray-300">|</span>
                <span>{NSFW_ACTIONS.length} nsfw actions</span>
                <span className="text-gray-300">|</span>
                <span>{SFW_ACTIONS.length} sfw actions</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
