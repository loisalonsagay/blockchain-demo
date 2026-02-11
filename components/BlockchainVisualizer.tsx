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
  const [blockchain] = useState<Blockchain>(() => new Blockchain(2))
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
          const newBlock = blockchain.addBlock(inputData)
          setBlocks([...blockchain.getBlocks()])

          const endTime = Date.now()
          setMiningTime(endTime - startTime)
          setInputData('')

          resolve(newBlock)
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
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-3">
                Blockchain Visualizer
              </h1>
              <p className="text-lg text-gray-400">
                Explore how blockchain mining and validation work in real-time
              </p>
            </div>
            <div className="w-full">
              <ValidationIndicator isValid={isValid} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Mining */}
          <div className="lg:col-span-2 flex">
            <div className="flex-1 bg-black border-2 border-fuchsia-500/60 rounded-2xl p-10 hover:border-fuchsia-400 hover:shadow-lg hover:shadow-fuchsia-500/30 transition-all duration-300">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold">⛏</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Mine New Block</h2>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Enter block data (e.g., 'Alice sends 10 BTC to Bob')"
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isMining}
                    className="h-16 border-2 px-4 text-lg bg-purple-950/60 border-fuchsia-500/40 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                  />
                  <Button
                    onClick={handleMineBlock}
                    disabled={isMining || !inputData.trim()}
                    className="h-16 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold px-8 rounded-xl disabled:opacity-50 transition-all duration-300"
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
                  <div className="p-4 bg-black border-2 border-fuchsia-500/50 rounded-xl">
                    <p className="text-fuchsia-300 font-semibold text-center">
                      ⚡ Mined in <span className="text-fuchsia-400 font-bold">{miningTime}ms</span>
                    </p>
                  </div>
                )}

                {/* Mining Steps */}
                <div className="mt-8 border-t border-fuchsia-500/30 pt-6">
                  <h3 className="text-lg font-semibold text-fuchsia-400 mb-3">
                    How Mining Works
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Step 1: Enter transaction data.</li>
                    <li>• Step 2: Click "Mine" to start solving the hash.</li>
                    <li>• Step 3: The system finds a hash with required zeros and adds the block.</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="bg-black border-2 border-fuchsia-500/60 rounded-2xl p-8 hover:border-fuchsia-400 hover:shadow-lg hover:shadow-fuchsia-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold">⚡</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Difficulty</h2>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  disabled={isMining}
                  className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 text-left ${
                    difficulty === level
                      ? 'bg-black text-fuchsia-400 border-2 border-fuchsia-500 shadow-lg shadow-fuchsia-500/40'
                      : 'bg-black text-gray-300 border-2 border-gray-700 hover:border-fuchsia-500/50 hover:text-fuchsia-300'
                  } disabled:opacity-50`}
                >
                  <div className="flex items-center justify-between">
                    <span>Level {level}</span>
                    <span className="text-xs bg-black/30 px-3 py-1 rounded-lg">
                      {'0'.repeat(level)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black border-2 border-fuchsia-500/50 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Total Blocks</p>
            <p className="text-4xl font-bold text-fuchsia-400">{blocks.length}</p>
          </div>

          <div className="bg-black border-2 border-fuchsia-500/50 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Difficulty</p>
            <p className="text-4xl font-bold text-fuchsia-400">{difficulty}</p>
          </div>

          <div className="bg-black border-2 border-fuchsia-500/50 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Chain Status</p>
            <p className={`text-3xl font-bold ${isValid ? 'text-fuchsia-400' : 'text-red-400'}`}>
              {isValid ? '✓ Valid' : '✗ Invalid'}
            </p>
          </div>

          <div className="bg-black border-2 border-fuchsia-500/50 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Last Mine</p>
            <p className="text-3xl font-bold text-fuchsia-400">
              {miningTime ? `${miningTime}ms` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Blockchain */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-fuchsia-500 to-pink-500 rounded-full"></span>
            Blockchain
          </h2>
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
    </div>
  )
}
