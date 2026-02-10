'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

interface DifficultySelectorProps {
  difficulty: number
  onDifficultyChange: (difficulty: number) => void
  isMining: boolean
}

const difficultyLevels = [
  { value: 1, label: 'Easy', description: 'Fast mining', color: 'from-green-600 to-green-500' },
  {
    value: 2,
    label: 'Medium',
    description: 'Balanced',
    color: 'from-blue-600 to-blue-500',
  },
  {
    value: 3,
    label: 'Hard',
    description: 'Slower mining',
    color: 'from-orange-600 to-orange-500',
  },
  { value: 4, label: 'Very Hard', description: 'Very slow', color: 'from-red-600 to-red-500' },
]

export default function DifficultySelector({
  difficulty,
  onDifficultyChange,
  isMining,
}: DifficultySelectorProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">Difficulty</h2>
      </div>

      <div className="space-y-3">
        {difficultyLevels.map((level) => (
          <Button
            key={level.value}
            onClick={() => onDifficultyChange(level.value)}
            disabled={isMining}
            className={`w-full justify-start p-4 h-auto transition-all ${
              difficulty === level.value
                ? `bg-gradient-to-r ${level.color} text-white border-2 border-white/30`
                : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'
            }`}
          >
            <div className="text-left flex-1">
              <p className="font-semibold">{level.label}</p>
              <p className="text-xs opacity-75">{level.description}</p>
            </div>

            {difficulty === level.value && (
              <span className="text-sm font-bold">({level.value} zero{"s"})</span>
            )}
          </Button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
        <p className="text-slate-300 text-xs">
          <span className="font-semibold">Current difficulty:</span> Block hash must start with{' '}
          <span className="font-mono bg-slate-900 px-2 py-1 rounded">
            {'0'.repeat(difficulty)}
          </span>
        </p>
      </div>
    </Card>
  )
}
