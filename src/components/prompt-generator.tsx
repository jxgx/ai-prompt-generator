'use client'

import React, { useState, useCallback, useMemo } from 'react'
import {
  MODELS,
  SCENES,
  SCENE_CATEGORIES,
  CHARACTER_ATTRIBUTES,
  ART_STYLES,
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
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {attribute.label}
        {attribute.allowMultiple && (
          <span className="ml-1 text-zinc-500 normal-case tracking-normal">(multi-select)</span>
        )}
      </Label>
      <div className="flex flex-wrap gap-1.5">
        {attribute.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`
              inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-all
              ${
                selected.includes(opt.id)
                  ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700 hover:bg-zinc-700 hover:text-zinc-200'
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
    <Select value={selected} onValueChange={onChange}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
        {attribute.label}
      </Label>
      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-200">
        <SelectValue placeholder={`Select ${attribute.label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 border-zinc-700">
        {attribute.options.map((opt) => (
          <SelectItem key={opt.id} value={opt.id} className="text-zinc-200 focus:bg-zinc-700 focus:text-white">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold">
              {index + 1}
            </span>
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-200">Prompt {index + 1}</CardTitle>
              <CardDescription className="text-xs text-zinc-500 mt-0.5">
                {prompt.modelName} &middot; {prompt.scene} &middot; Seed: {prompt.seed}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-700 bg-zinc-800">
              {prompt.steps} steps
            </Badge>
            <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-700 bg-zinc-800">
              CFG {prompt.cfg}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Positive Prompt */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Positive Prompt</span>
            <button
              onClick={copyPositive}
              className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {copiedPos ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedPos ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="rounded-md bg-zinc-950 p-3 text-xs text-zinc-300 leading-relaxed font-mono break-words whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
            {prompt.positive}
          </div>
        </div>

        {/* Negative Prompt (collapsible) */}
        <div>
          <button
            onClick={() => setShowNegative(!showNegative)}
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
          >
            {showNegative ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            Negative Prompt
          </button>
          {showNegative && (
            <div className="mt-2 relative">
              <button
                onClick={copyNegative}
                className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {copiedNeg ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedNeg ? 'Copied' : 'Copy'}
              </button>
              <div className="rounded-md bg-zinc-950 p-3 text-xs text-zinc-400 leading-relaxed font-mono break-words pr-16 max-h-32 overflow-y-auto custom-scrollbar">
                {prompt.negative}
              </div>
            </div>
          )}
        </div>

        {/* Copy All Button */}
        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-rose-400 transition-colors pt-1"
        >
          <Copy className="w-3 h-3" />
          Copy full prompt with settings
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
      gender: 'gender',
      age: 'age',
      'body-type': 'bodyType',
      ethnicity: 'ethnicity',
      'hair-color': 'hairColor',
      'hair-style': 'hairStyle',
      'eye-color': 'eyeColor',
      'skin-tone': 'skinTone',
      clothing: 'clothing',
      expression: 'expression',
      pose: 'pose',
      accessories: 'accessories',
    }
    return map[id] || id as keyof CharacterConfig
  }

  // Generate
  const handleGenerate = useCallback(() => {
    if (!scene) return
    setIsGenerating(true)

    // Small delay for visual feedback
    setTimeout(() => {
      try {
        const config: GeneratorConfig = {
          model,
          mode,
          scene,
          character,
          includeAction,
          includeArtStyle,
          includeCameraAngle,
          includeExtraQuality,
          nsfwLevel: 'suggestive',
          promptCount,
        }
        const result = generatePrompts(config)
        setPrompts(result)
      } catch (err) {
        console.error('Generation error:', err)
      } finally {
        setIsGenerating(false)
      }
    }, 150)
  }, [model, mode, scene, character, includeAction, includeArtStyle, includeCameraAngle, includeExtraQuality, promptCount])

  const handleQuickRandom = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => {
      try {
        const result = quickGenerate(model, promptCount)
        setPrompts(result)
        // Also set the scene that was randomly picked
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
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* Header */}
        <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-600 shadow-lg shadow-rose-500/20">
                <Dices className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-zinc-100 tracking-tight">Prompt Forge</h1>
                <p className="text-xs text-zinc-500">AI Image Prompt Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-700 bg-zinc-900 hidden sm:flex">
                {MODELS.length} Models &middot; {SCENES.length} Scenes &middot; {CHARACTER_ATTRIBUTES.length} Attributes
              </Badge>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ── Left Panel: Controls ── */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">
              {/* Model Selector */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-rose-400" />
                    Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {MODELS.map((m) => (
                        <SelectItem key={m.id} value={m.id} className="text-zinc-200 focus:bg-zinc-700 focus:text-white">
                          <span className="flex flex-col">
                            <span className="font-medium">{m.name}</span>
                            <span className="text-[10px] text-zinc-500">{m.description}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Model Info */}
                  <div className="rounded-md bg-zinc-950 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <Info className="w-3 h-3" />
                      <span className="uppercase font-semibold tracking-wider">Model Info</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{currentModel.specialNotes}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-[9px] text-zinc-500 border-zinc-800 bg-zinc-900">
                        {currentModel.defaultSteps} steps
                      </Badge>
                      <Badge variant="outline" className="text-[9px] text-zinc-500 border-zinc-800 bg-zinc-900">
                        CFG {currentModel.defaultCfg}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] text-zinc-500 border-zinc-800 bg-zinc-900">
                        {currentModel.defaultSampler}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mode Toggle */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-rose-400" />
                    Mode
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    {mode === 'companion'
                      ? 'Generic "you" subject for AI companion platforms'
                      : 'Fully customizable character attributes'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={mode} onValueChange={(v) => setMode(v as GeneratorMode)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-800 h-10">
                      <TabsTrigger value="companion" className="text-xs data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-300 data-[state=active]:shadow-none">
                        <Users className="w-3.5 h-3.5 mr-1.5" />
                        Companion
                      </TabsTrigger>
                      <TabsTrigger value="custom" className="text-xs data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-300 data-[state=active]:shadow-none">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Custom
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Scene / Theme Selector */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Eye className="w-4 h-4 text-rose-400" />
                    Scene / Theme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={scene} onValueChange={setScene}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-200">
                      <SelectValue placeholder="Choose a scene..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 max-h-80">
                      {Object.entries(scenesByCategory).map(([category, scenes]) => (
                        <SelectGroup key={category}>
                          <SelectLabel className="text-[10px] text-rose-400 uppercase tracking-wider font-bold px-2 py-1.5">
                            {category}
                          </SelectLabel>
                          {scenes.map((s) => (
                            <SelectItem key={s.id} value={s.id} className="text-zinc-200 focus:bg-zinc-700 focus:text-white">
                              <span className="flex items-center gap-2">
                                <span className="font-medium text-xs">{s.name}</span>
                                <span className="text-[10px] text-zinc-500">{s.description}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  {scene && (
                    <div className="rounded-md bg-zinc-950 p-2.5 flex flex-wrap gap-1">
                      {SCENES.find((s) => s.id === scene)?.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[9px] text-zinc-500 border-zinc-800 bg-zinc-900">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Character Customization (Custom Mode only) */}
              {mode === 'custom' && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader
                    className="pb-3 cursor-pointer"
                    onClick={() => setCharacterSectionOpen(!characterSectionOpen)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-400" />
                        Character
                      </CardTitle>
                      {characterSectionOpen ? (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                    <CardDescription className="text-xs text-zinc-500">
                      {characterSectionOpen
                        ? 'Configure character attributes for generation'
                        : 'Click to expand character settings'}
                    </CardDescription>
                  </CardHeader>
                  {characterSectionOpen && (
                    <CardContent className="space-y-4">
                      <ScrollArea className="max-h-[500px] pr-3 custom-scrollbar">
                        <div className="space-y-4 pb-2">
                          {/* Single selects */}
                          {['gender', 'age', 'ethnicity', 'hair-color', 'eye-color', 'skin-tone', 'expression'].map(
                            (attrId) => (
                              <SingleSelect
                                key={attrId}
                                attribute={getAttr(attrId)}
                                selected={(character[attrIdToKey(attrId)] as string) || ''}
                                onChange={(v) => setSingleAttr(attrId, v)}
                              />
                            )
                          )}

                          <Separator className="bg-zinc-800" />

                          {/* Multi selects */}
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

                          {/* Quick randomize character */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-zinc-700 text-zinc-400 hover:text-rose-300 hover:border-rose-500/40"
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
                            <Shuffle className="w-3.5 h-3.5 mr-1.5" />
                            Randomize Character
                          </Button>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Companion Mode Expression + Pose */}
              {mode === 'companion' && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4 text-rose-400" />
                      Companion Settings
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-500">
                      Minimal config — the AI handles the subject. Set expression and pose optionally.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

              {/* Advanced Options */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader
                  className="pb-3 cursor-pointer"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-rose-400" />
                      Generation Options
                    </CardTitle>
                    {advancedOpen ? (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                </CardHeader>
                {advancedOpen && (
                  <CardContent className="space-y-4">
                    {/* Toggles */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-zinc-300">Include Random Action</Label>
                        <Switch checked={includeAction} onCheckedChange={setIncludeAction} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-zinc-300">Include Random Art Style</Label>
                        <Switch checked={includeArtStyle} onCheckedChange={setIncludeArtStyle} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-zinc-300">Include Camera Angle</Label>
                        <Switch checked={includeCameraAngle} onCheckedChange={setIncludeCameraAngle} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-zinc-300">Extra Quality Boost</Label>
                        <Switch checked={includeExtraQuality} onCheckedChange={setIncludeExtraQuality} />
                      </div>
                    </div>

                    <Separator className="bg-zinc-800" />

                    {/* Prompt Count */}
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-300">Number of Prompts</Label>
                      <div className="flex gap-2">
                        {[5, 10, 20, 50].map((n) => (
                          <button
                            key={n}
                            onClick={() => setPromptCount(n)}
                            className={`
                              flex-1 rounded-md py-1.5 text-xs font-medium transition-all
                              ${
                                promptCount === n
                                  ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
                                  : 'bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700 hover:bg-zinc-700'
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
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={!scene || isGenerating}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-semibold shadow-lg shadow-rose-500/20 h-12 text-sm"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Dices className="w-4 h-4 mr-2" />
                      Generate {promptCount} Random Prompts
                    </>
                  )}
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleQuickRandom}
                      disabled={isGenerating}
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:text-rose-300 hover:border-rose-500/40 h-12"
                    >
                      <Dice5 className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Fully Random</span>
                      <span className="sm:hidden">Random</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-zinc-800 text-zinc-200 border-zinc-700 text-xs max-w-[240px]">
                    Randomizes everything: model, scene, character, and all options
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Results Header */}
              {prompts.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-zinc-200">
                      Generated Prompts
                    </h2>
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-[10px]">
                      {prompts.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAllNegatives(!showAllNegatives)}
                      className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showAllNegatives ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showAllNegatives ? 'Hide' : 'Show'} All Negatives
                    </button>
                    <button
                      onClick={copyAllPrompts}
                      className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy All
                    </button>
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Export
                    </button>
                  </div>
                </div>
              )}

              {/* Prompt Cards */}
              {prompts.length > 0 ? (
                <div className="space-y-3">
                  {prompts.map((p, i) => (
                    <PromptCard key={p.id} prompt={p} index={i} />
                  ))}
                </div>
              ) : (
                <Card className="bg-zinc-900 border-zinc-800 border-dashed">
                  <CardContent className="py-20 text-center">
                    <Dices className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-zinc-500 mb-2">No prompts yet</h3>
                    <p className="text-sm text-zinc-600 max-w-md mx-auto">
                      Select a model and scene, configure your character, then hit generate.
                      Or use <span className="text-rose-400 font-medium">Fully Random</span> to roll everything at once.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-zinc-600">
                Prompt Forge &mdash; AI Image Prompt Generator
              </p>
              <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                <span>Models: {MODELS.map((m) => m.name).join(', ')}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

// ─── Need to import pick helpers for randomize button ───
function pickOne<T>(arr: { id: string }[]): T & { id: string } {
  return arr[Math.floor(Math.random() * arr.length)] as T & { id: string }
}

function pickRandom<T>(arr: { id: string }[], count: number): (T & { id: string })[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count) as (T & { id: string })[]
}
