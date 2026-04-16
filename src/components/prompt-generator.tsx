'use client'

import React, { useState, useCallback, useMemo } from 'react'
import {
  MODELS,
  SCENES,
  SCENE_CATEGORIES,
  CHARACTER_ATTRIBUTES,
  COMPANION_THEMES,
  LIGHTING_OPTIONS,
  CAMERA_ANGLES,
  type ModelConfig,
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
  Info,
  Eye,
  EyeOff,
  Shuffle,
  Palette,
} from 'lucide-react'

// ─── Sub-Components ───────────────────────────

function MultiSelect({
  attribute,
  selected,
  onChange,
}: {
  attribute: CharacterAttribute
  selected: string[]
  onChange: (ids: string[]) => void
}) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">
        {attribute.label}
        {attribute.allowMultiple && (
          <span className="ml-1 text-gray-400 normal-case tracking-normal font-normal">[multi]</span>
        )}
      </Label>
      <div className="flex flex-wrap gap-1">
        {attribute.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`
              inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-mono transition-all border
              ${
                selected.includes(opt.id)
                  ? 'bg-gray-900 text-white border-gray-900 hover:bg-black'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400'
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SingleSelect({
  attribute,
  selected,
  onChange,
}: {
  attribute: CharacterAttribute
  selected: string
  onChange: (id: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono block">
        {attribute.label}
      </Label>
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-8 focus:ring-gray-400 focus:border-gray-500">
          <SelectValue placeholder={`-- select --`} />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          {attribute.options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id} className="text-gray-800 font-mono text-xs focus:bg-gray-100 focus:text-black">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
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
    <Card className="bg-white border-gray-300 shadow-none hover:shadow-sm transition-shadow">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-sm bg-gray-900 text-white text-[10px] font-mono font-bold">
              {index + 1}
            </span>
            <div>
              <CardTitle className="text-xs font-bold text-gray-900 font-mono">PROMPT_{String(index + 1).padStart(3, '0')}</CardTitle>
              <CardDescription className="text-[10px] text-gray-500 font-mono mt-0">
                {prompt.modelName}{" // "}{prompt.scene}{" // seed:"}{prompt.seed}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-[9px] text-gray-500 border-gray-300 font-mono">
              {prompt.steps} steps
            </Badge>
            <Badge variant="outline" className="text-[9px] text-gray-500 border-gray-300 font-mono">
              cfg {prompt.cfg}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-3">
        {/* Positive Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">$ positive</span>
            <button onClick={copyPositive} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-800 transition-colors font-mono">
              {copiedPos ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedPos ? 'ok' : 'copy'}
            </button>
          </div>
          <div className="rounded-sm bg-gray-50 border border-gray-200 p-2.5 text-[11px] text-gray-800 leading-relaxed font-mono break-words whitespace-pre-wrap max-h-36 overflow-y-auto custom-scrollbar">
            {prompt.positive}
          </div>
        </div>

        {/* Negative Prompt (collapsible) */}
        <div>
          <button onClick={() => setShowNegative(!showNegative)} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors font-mono">
            {showNegative ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            $ negative
          </button>
          {showNegative && (
            <div className="mt-1.5 relative">
              <button onClick={copyNegative} className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-800 transition-colors font-mono z-10 bg-gray-50 rounded-sm px-1">
                {copiedNeg ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedNeg ? 'ok' : 'copy'}
              </button>
              <div className="rounded-sm bg-gray-50 border border-gray-200 p-2.5 text-[10px] text-gray-500 leading-relaxed font-mono break-words pr-14 max-h-28 overflow-y-auto custom-scrollbar">
                {prompt.negative}
              </div>
            </div>
          )}
        </div>

        {/* Copy All Button */}
        <button onClick={copyAll} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 transition-colors font-mono pt-0.5">
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
    expression: 'happy',
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
  const [characterSectionOpen, setCharacterSectionOpen] = useState(true)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const currentModel = useMemo(() => MODELS.find((m) => m.id === model)!, [model])

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
          nsfwLevel: 'suggestive', promptCount,
        }
        const result = generatePrompts(config)
        setPrompts(result)
      } catch (err) {
        console.error('Generation error:', err)
      } finally {
        setIsGenerating(false)
      }
    }, 150)
  }, [model, mode, scene, character, companionTheme, companionLighting, includeAction, includeArtStyle, includeCameraAngle, includeLighting, includeExtraQuality, promptCount])

  const handleQuickRandom = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => {
      try {
        const result = quickGenerate(model, promptCount)
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
  }, [model, promptCount])

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
      .map((p, i) => `Prompt ${i + 1}:\n${p.positive}\nNegative: ${p.negative}`)
      .join('\n\n')
    await navigator.clipboard.writeText(text)
  }, [prompts])

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <header className="border-b-2 border-gray-900 bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-gray-900">
                <Dices className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 font-mono tracking-tight uppercase">
                  prompt_forge<span className="text-gray-400">.exe</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-mono">AI Image Prompt Generator v2.0</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400 font-mono">
              <span>[{MODELS.length} models]</span>
              <span>[{SCENES.length} scenes]</span>
              <span>[{COMPANION_THEMES.length} themes]</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* ── Left Panel: Controls ── */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-3">
              {/* Model Selector */}
              <Card className="bg-white border-gray-300 shadow-none">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono flex items-center gap-1.5">
                    <Settings2 className="w-3 h-3" />
                    model
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 px-4 pb-3">
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-8 focus:ring-gray-400">
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
                  <div className="rounded-sm bg-gray-50 border border-gray-200 p-2.5 space-y-1.5">
                    <span className="text-[9px] text-gray-400 font-mono">{"// "}{currentModel.specialNotes}</span>
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
                </CardContent>
              </Card>

              {/* Mode Toggle */}
              <Card className="bg-white border-gray-300 shadow-none">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono flex items-center gap-1.5">
                    <User className="w-3 h-3" />
                    mode
                  </CardTitle>
                  <CardDescription className="text-[10px] text-gray-400 font-mono">
                    {mode === 'companion'
                      ? '// generic "you" subject for AI companion platforms'
                      : '// full character attribute control'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <Tabs value={mode} onValueChange={(v) => setMode(v as GeneratorMode)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 h-8 border border-gray-200">
                      <TabsTrigger value="companion" className="text-[11px] font-mono data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-none">
                        companion
                      </TabsTrigger>
                      <TabsTrigger value="custom" className="text-[11px] font-mono data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-none">
                        custom
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Scene / Theme Selector */}
              <Card className="bg-white border-gray-300 shadow-none">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono flex items-center gap-1.5">
                    <Eye className="w-3 h-3" />
                    scene / theme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 px-4 pb-3">
                  <Select value={scene} onValueChange={setScene}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-8 focus:ring-gray-400">
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
                  {scene && (
                    <div className="rounded-sm bg-gray-50 border border-gray-200 p-2 flex flex-wrap gap-1">
                      {SCENES.find((s) => s.id === scene)?.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Companion Mode: Theme + Lighting + Expression + Pose */}
              {mode === 'companion' && (
                <Card className="bg-white border-gray-300 shadow-none">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      companion config
                    </CardTitle>
                    <CardDescription className="text-[10px] text-gray-400 font-mono">
                      {"// set companion appearance theme + lighting"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 pb-3">
                    {/* Companion Theme */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono block">
                        <Palette className="w-3 h-3 inline mr-1" />
                        companion theme
                      </Label>
                      <Select value={companionTheme} onValueChange={setCompanionTheme}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-8 focus:ring-gray-400">
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
                      {companionTheme && (
                        <div className="rounded-sm bg-gray-50 border border-gray-200 p-2 flex flex-wrap gap-1">
                          {COMPANION_THEMES.find((t) => t.id === companionTheme)?.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[9px] text-gray-500 border-gray-300 bg-white font-mono">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Lighting Selector */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono block">
                        lighting
                      </Label>
                      <Select value={companionLighting} onValueChange={setCompanionLighting}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-800 font-mono text-xs h-8 focus:ring-gray-400">
                          <SelectValue placeholder="-- random lighting --" />
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

                    <Separator className="bg-gray-200" />

                    {/* Expression + Pose (minimal) */}
                    <SingleSelect
                      attribute={getAttr('expression')}
                      selected={character.expression || ''}
                      onChange={(v) => setSingleAttr('expression', v)}
                    />
                    <MultiSelect
                      attribute={getAttr('pose')}
                      selected={character.pose || []}
                      onChange={(ids) => setCharacter((prev) => ({ ...prev, pose: ids }))}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Custom Mode: Full Character Customization */}
              {mode === 'custom' && (
                <Card className="bg-white border-gray-300 shadow-none">
                  <CardHeader
                    className="pb-2 pt-3 px-4 cursor-pointer"
                    onClick={() => setCharacterSectionOpen(!characterSectionOpen)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        character attributes
                      </CardTitle>
                      {characterSectionOpen ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
                    </div>
                  </CardHeader>
                  {characterSectionOpen && (
                    <CardContent className="space-y-3 px-4 pb-3">
                      <ScrollArea className="max-h-[500px] pr-2 custom-scrollbar">
                        <div className="space-y-3 pb-2">
                          {['gender', 'age', 'ethnicity', 'hair-color', 'eye-color', 'skin-tone', 'expression'].map((attrId) => (
                            <SingleSelect
                              key={attrId}
                              attribute={getAttr(attrId)}
                              selected={(character[attrIdToKey(attrId)] as string) || ''}
                              onChange={(v) => setSingleAttr(attrId, v)}
                            />
                          ))}
                          <Separator className="bg-gray-200" />
                          {['body-type', 'hair-style', 'clothing', 'pose', 'accessories'].map((attrId) => (
                            <MultiSelect
                              key={attrId}
                              attribute={getAttr(attrId)}
                              selected={(character[attrIdToKey(attrId)] as string[]) || []}
                              onChange={(ids) => {
                                const key = attrIdToKey(attrId)
                                setCharacter((prev) => ({ ...prev, [key]: ids }))
                              }}
                            />
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-[11px] font-mono border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 h-7"
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
                      </ScrollArea>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Advanced Options */}
              <Card className="bg-white border-gray-300 shadow-none">
                <CardHeader
                  className="pb-2 pt-3 px-4 cursor-pointer"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono flex items-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      generation options
                    </CardTitle>
                    {advancedOpen ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
                  </div>
                </CardHeader>
                {advancedOpen && (
                  <CardContent className="space-y-3 px-4 pb-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] text-gray-600 font-mono">random action</Label>
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
                    <Separator className="bg-gray-200" />
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">prompt count</Label>
                      <div className="flex gap-1.5">
                        {[5, 10, 20, 50].map((n) => (
                          <button
                            key={n}
                            onClick={() => setPromptCount(n)}
                            className={`
                              flex-1 rounded-sm py-1 text-[11px] font-mono font-bold transition-all border
                              ${promptCount === n
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-800'
                              }
                            `}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* ── Right Panel: Results ── */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-3">
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={!scene || isGenerating}
                  className="flex-1 bg-gray-900 hover:bg-black text-white font-mono font-bold text-xs h-10 uppercase tracking-wider"
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
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 h-10 font-mono text-xs"
                    >
                      <Dice5 className="w-3.5 h-3.5 mr-1.5" />
                      <span className="hidden sm:inline">fully_random()</span>
                      <span className="sm:hidden">random</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-900 text-gray-100 border-gray-700 text-[10px] font-mono max-w-[240px]">
                    {"// randomizes everything: model, scene, character, all options"}
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Results Header */}
              {prompts.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">
                      output [{prompts.length} prompts]
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
                    <button onClick={() => setShowAllNegatives(!showAllNegatives)} className="hover:text-gray-700 transition-colors">
                      {showAllNegatives ? '[hide negatives]' : '[show negatives]'}
                    </button>
                    <button onClick={copyAllPrompts} className="hover:text-gray-700 transition-colors">
                      [copy all]
                    </button>
                    <button onClick={handleExport} className="hover:text-gray-700 transition-colors">
                      [export.txt]
                    </button>
                  </div>
                </div>
              )}

              {/* Prompt Cards */}
              {prompts.length > 0 ? (
                <div className="space-y-2">
                  {prompts.map((p, i) => (
                    <PromptCard key={p.id} prompt={p} index={i} />
                  ))}
                </div>
              ) : (
                <Card className="bg-white border-gray-300 border-dashed shadow-none">
                  <CardContent className="py-16 text-center">
                    <Dices className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-mono font-bold text-gray-400 mb-1">no prompts generated</p>
                    <p className="text-[11px] text-gray-400 font-mono max-w-md mx-auto leading-relaxed">
                      {"// select a model + scene, configure your character,"}
                      <br />{"// then hit generate. or use fully_random() to roll everything."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t-2 border-gray-900 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5">
              <p className="text-[10px] text-gray-400 font-mono">
                prompt_forge.exe v2.0 -- AI Image Prompt Generator
              </p>
              <p className="text-[9px] text-gray-400 font-mono">
                models: {MODELS.map((m) => m.name).join(' | ')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

// ─── local helpers for randomize button ───
function pickOne<T>(arr: { id: string }[]): T & { id: string } {
  return arr[Math.floor(Math.random() * arr.length)] as T & { id: string }
}
function pickRandom<T>(arr: { id: string }[], count: number): (T & { id: string })[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count) as (T & { id: string })[]
}
