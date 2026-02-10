'use client'

import React from "react"
import { useState, useCallback, useEffect } from 'react'
import { Blockchain, type Block } from '@/lib/blockchain'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import BlockCard from '@/components/BlockCard'
import ValidationIndicator from '@/components/ValidationIndicator'
import { Loader2 } from 'lucide-react'

export default function BlockchainVisualizer() {
  const [blockchain, setBlockchain] = useState<Blockchain>(() => new Blockchain(2))
  const [blocks, setBlocks] = useState<Block[]>(blockchain.getBlocks())
  const [isValid, setIsValid] = useState(true)
  const [inputData, setInputData] = useState('')
  const [isMining, setIsMining] = useState(false)
  const [miningTime, setMiningTime] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState(2)

  useEffect(() => {
    setIsValid(blockchain.isChainValid())
  }, [blocks, blockchain])

  const handleMineBlock = useCallback(async () => {
    if (!inputData.trim()) {
      alert('Please enter block data')
      return
    }

    setIsMining(true)
    setMiningTime(null)
    const startTime = Date.now()

    try {
      await new Promise((resolve) => {
        const mineAsync = () => {
          blockchain.addBlock(inputData)
          setBlocks([...blockchain.getBlocks()])

          const endTime = Date.now()
          setMiningTime(endTime - startTime)
          setInputData('')
          resolve(true)
        }

        if ('requestIdleCallback' in window) {
          requestIdleCallback(mineAsync as IdleRequestCallback)
        } else {
          setTimeout(mineAsync, 0)
        }
      })
    } finally {
      setIsMining(false)
    }
  }, [blockchain, inputData])

  const handleDifficultyChange = useCallback((newDifficulty: number) => {
    setDifficulty(newDifficulty)
    blockchain.setDifficulty(newDifficulty)
  }, [blockchain])

  const handleTamperBlock = (index: number, newData: string) => {
    if (index === 0) return

    const updatedBlocks = [...blocks]
    updatedBlocks[index] = { ...updatedBlocks[index], data: newData }

    blockchain.blocks = updatedBlocks
    setBlocks(updatedBlocks)
    setIsValid(blockchain.isChainValid())
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isMining) {
      handleMineBlock()
    }
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-3">
            Blockchain Visualizer
          </h1>
          <p className="text-lg text-gray-400 mb-4">
            Explore how blockchain mining and validation work in real-time
          </p>
          <ValidationIndicator isValid={isValid} />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Mining */}
          <div className="lg:col-span-2 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-fuchsia-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">⛏ Mine New Block</h2>

            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter block data"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isMining}
                className="bg-purple-950/60 border-fuchsia-500/30 text-white"
              />
              <Button
                onClick={handleMineBlock}
                disabled={isMining || !inputData.trim()}
                className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-8"
              >
                {isMining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mining...
                  </>
                ) : (
                  'Mine'
                )}
              </Button>
            </div>

            {miningTime !== null && (
              <p className="mt-4 text-emerald-400 font-semibold">
                ⚡ Mined in {miningTime}ms
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-fuchsia-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">⚡ Difficulty</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  disabled={isMining}
                  className={`w-full p-4 rounded-xl font-semibold ${
                    difficulty === level
                      ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white'
                      : 'bg-purple-800/30 text-gray-300'
                  }`}
                >
                  Level {level} ({'0'.repeat(level)})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 text-center bg-purple-900/40 rounded-xl text-white">
            <p>Total Blocks</p>
            <p className="text-3xl font-bold">{blocks.length}</p>
          </div>
          <div className="p-6 text-center bg-indigo-900/40 rounded-xl text-white">
            <p>Difficulty</p>
            <p className="text-3xl font-bold">{difficulty}</p>
          </div>
          <div className="p-6 text-center bg-emerald-900/40 rounded-xl">
            <p>Chain Status</p>
            <p className={`text-2xl font-bold ${isValid ? 'text-emerald-400' : 'text-red-400'}`}>
              {isValid ? 'Valid' : 'Invalid'}
            </p>
          </div>
          <div className="p-6 text-center bg-cyan-900/40 rounded-xl text-cyan-400">
            <p>Last Mine</p>
            <p className="text-2xl font-bold">{miningTime ? `${miningTime}ms` : 'N/A'}</p>
          </div>
        </div>

        {/* Blockchain */}
        <h2 className="text-3xl font-bold text-white mb-6">Blockchain</h2>
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <BlockCard
              key={index}
              block={block}
              isValid={isValid}
              canTamper={index !== 0}
              onTamper={(newData) => handleTamperBlock(index, newData)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
