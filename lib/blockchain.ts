import CryptoJS from 'crypto-js'

const SHA256 = CryptoJS.SHA256

export interface Block {
  index: number
  timestamp: string
  data: string
  previousHash: string
  hash: string
  nonce: number
}

export interface BlockchainState {
  blocks: Block[]
  difficulty: number
  isValid: boolean
}

export class Blockchain {
  blocks: Block[] = []
  difficulty: number = 2

  constructor(difficulty: number = 2) {
    this.difficulty = difficulty
    this.createGenesisBlock()
  }

  private createGenesisBlock() {
    const genesisBlock: Block = {
      index: 0,
      timestamp: new Date().toISOString(),
      data: 'Genesis Block',
      previousHash: '0',
      hash: '',
      nonce: 0,
    }
    genesisBlock.hash = this.calculateHash(genesisBlock)
    this.blocks.push(genesisBlock)
  }

  calculateHash(block: Block): string {
    const blockString = JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
      nonce: block.nonce,
    })
    return SHA256(blockString).toString()
  }

  mineBlock(block: Block): Block {
    const target = '0'.repeat(this.difficulty)

    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++
      block.hash = this.calculateHash(block)
    }

    return block
  }

  addBlock(data: string): Block {
    const newBlock: Block = {
      index: this.blocks.length,
      timestamp: new Date().toISOString(),
      data,
      previousHash: this.blocks[this.blocks.length - 1].hash,
      hash: '',
      nonce: 0,
    }

    this.mineBlock(newBlock)
    this.blocks.push(newBlock)

    return newBlock
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]

      const calculatedHash = this.calculateHash(currentBlock)
      if (currentBlock.hash !== calculatedHash) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }

      const target = '0'.repeat(this.difficulty)
      if (currentBlock.hash.substring(0, this.difficulty) !== target) {
        return false
      }
    }

    return true
  }

  setDifficulty(difficulty: number) {
    this.difficulty = Math.max(1, Math.min(difficulty, 4))
  }

  getBlocks(): Block[] {
    return this.blocks
  }

  getTotalBlocks(): number {
    return this.blocks.length
  }
}
