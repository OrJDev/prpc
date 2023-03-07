export class PRPCClientError extends Error {
  constructor(message: string, cause?: Error) {
    super(message)
    this.name = 'PRPCClientError'
    this.stack = cause?.stack
  }
}
