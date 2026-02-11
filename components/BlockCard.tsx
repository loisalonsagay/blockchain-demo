'use client'

import { useState, useEffect } from 'react'
import { type Block } from '@/lib/blockchain'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, Edit2, X, Check } from 'lucide-react'

interface BlockCardProps {
  block: Block
  isValid: boolean
  canTamper: boolean
  onTamper: (newData: string) => void
}

export default function BlockCard({
  block,
  isValid,
  canTamper,
  onTamper,
}: BlockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(block.data)
  const [formattedDate, setFormattedDate] = useState('') // ✅ Client-only formatted date

  useEffect(() => {
    setFormattedDate(new Date(block.timestamp).toLocaleString())
  }, [block.timestamp])

  const handleSaveEdit = () => {
    onTamper(editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(block.data)
    setIsEditing(false)
  }

  const truncateHash = (hash: string, length: number = 10) => {
    return hash.substring(0, length) + '...'
  }

  return (
    <div
      className={`border-2 rounded-2xl transition-all duration-300 ${
        isValid
          ? 'bg-black border-fuchsia-500/60 hover:border-fuchsia-400 hover:shadow-lg hover:shadow-fuchsia-500/30'
          : 'bg-black border-red-600/60 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/30'
      }`}
    >
      {/* Header */}
      <div
        className="p-6 md:p-7 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-fuchsia-500/40">
                #{block.index}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-lg truncate">
                {isEditing ? (
                  <Input
                    value={editedData}
                    onChange={(e) => setEditedData(e.target.value)}
                    className="bg-purple-950/60 border-fuchsia-500/30 text-white text-sm h-9 focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  block.data
                )}
              </p>
              <p className="text-gray-400 text-sm">
                {formattedDate || 'Loading...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveEdit()
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancel()
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                {canTamper && !isEditing && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                <button className="p-2 text-gray-400 hover:text-fuchsia-300 transition-colors rounded-lg hover:bg-white/5">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-fuchsia-500/20 p-6 md:p-7 bg-black/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <p className="text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Block Number
                </p>
                <p className="text-white font-mono text-2xl font-bold">{block.index}</p>
              </div>

              <div>
                <p className="text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Timestamp
                </p>
                <p className="text-gray-200 font-mono text-sm">
                  {block.timestamp}
                </p>
              </div>

              <div>
                <p className="text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Nonce (attempts)
                </p>
                <p className="text-white font-mono text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {block.nonce.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <p className="text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Previous Hash
                </p>
                <div className="bg-black rounded-xl p-4 border-2 border-fuchsia-500/40 hover:border-fuchsia-400 transition-colors">
                  <p className="text-gray-200 font-mono text-xs break-all font-semibold">
                    {block.previousHash === '0'
                      ? '0'
                      : truncateHash(block.previousHash, 16)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Block Hash
                </p>
                <div
                  className={`rounded-xl p-4 border-2 transition-all ${
                    isValid
                      ? 'bg-black border-fuchsia-500/40 hover:border-fuchsia-400'
                      : 'bg-black border-red-600/40 hover:border-red-500'
                  }`}
                >
                  <p className={`font-mono text-xs break-all font-semibold ${isValid ? 'text-fuchsia-300' : 'text-red-300'}`}>
                    {truncateHash(block.hash, 16)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Hash Display */}
          <div className="mt-8 pt-8 border-t border-fuchsia-500/20">
            <p className="text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-3">
              Full Block Hash
            </p>
            <div
              className={`rounded-xl p-5 border-2 font-mono text-xs overflow-auto max-h-24 transition-all ${
                isValid
                  ? 'bg-black border-fuchsia-500/40 text-fuchsia-300'
                  : 'bg-black border-red-600/40 text-red-300'
              }`}
            >
              {block.hash}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
