import { error$, middleware$, pipe$, reuseable$ } from '@prpc/solid'

const reuseMw = middleware$(() => {
  console.log(`reuseMw called on ${typeof window}`)
  return {
    reuse: 'reuse' as const,
  }
})

export const myProcedure = reuseable$(reuseMw)

export const myMiddleware1 = middleware$(({ request$ }) => {
  console.log('ua', request$.headers.get('user-agent'))
  return { test: 'test' }
})

const middleWare2 = pipe$(myMiddleware1, (ctx) => {
  if (!ctx.test || ctx.test === 'tes') {
    return error$(`Expected test to be "test" but got ${ctx.test}`)
  }
  return {
    test: ctx.test,
    o: 1,
  }
})

export const middleware3 = pipe$(middleWare2, (ctx) => {
  return {
    ...ctx,
    b: 2,
  }
})
