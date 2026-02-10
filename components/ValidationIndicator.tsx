'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface ValidationIndicatorProps {
  isValid: boolean
}

export default function ValidationIndicator({
  isValid,
}: ValidationIndicatorProps) {
  return (
    <div
      className={`border-2 p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
        isValid
          ? 'bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/20'
          : 'bg-gradient-to-br from-red-950/40 to-pink-950/40 border-red-600/60 shadow-lg shadow-red-500/20'
      }`}
    >
      <div className="flex items-center gap-4">
        {isValid ? (
          <>
            <div className="flex-shrink-0">
              <div className="relative">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-300 font-semibold uppercase tracking-wide">Chain Status</p>
              <p className="text-3xl font-bold text-emerald-300">✓ Valid</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex-shrink-0">
              <div className="relative">
                <AlertCircle className="w-10 h-10 text-red-400 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-300 font-semibold uppercase tracking-wide">Chain Status</p>
              <p className="text-3xl font-bold text-red-400">✗ Invalid</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
