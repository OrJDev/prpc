export * from './QueryProvider'
export * from './mutation'
export * from './query'
export * from './types'
export * from './utils'

export class PRPCClientError extends Error {
  constructor(message: string, cause?: Error) {
    super(message)
    this.name = 'PRPCClientError'
    this.stack = cause?.stack
  }
}
