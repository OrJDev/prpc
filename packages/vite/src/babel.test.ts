import { transform } from '@babel/core'
import { expect, test } from 'vitest'
import { transformpRPC$ } from '.'

const inputCode = `
export const add = query$(
  ({ payload, request$ }) => {
    const result = payload.a + payload.b
    console.log(isServer /* true */)
    console.log('add', result)
    console.log(request$.headers.get('user-agent'))
    return result
  },
  'add',
  z.object({
    a: z.number(),
    b: z.number(),
  })
)
export const addM = mutation$(
  ({ payload, request$ }) => {
    const result = payload.a + payload.b
    console.log(isServer /* true */)
    console.log('add', result)
    console.log(request$.headers.get('user-agent'))
    return result
  },
  'add',
  z.object({
    a: z.number(),
    b: z.number(),
  })
)

export const decrease = query$(
  ({ payload }) => {
    const result = payload.a - payload.b
    console.log(isServer)
    console.log('add', result)
    return result
  }, 'decrease')
  
export const decreaseM = mutation$(
  ({ payload }) => {
    const result = payload.a - payload.b
    console.log(isServer)
    console.log('add', result)
    return result
  }, 'decrease')`

const transformedCode = `
import server$ from "solid-start/server";
export const add = query$(server$(async ({
  payload,
  request$
}) => {
  const schema = z.object({
    a: z.number(),
    b: z.number()
  });
  await schema.parseAsync(payload);
  const result = payload.a + payload.b;
  console.log(isServer /* true */);
  console.log('add', result);
  console.log(server$.request.headers.get('user-agent'));
  return result;
}), 'add');
export const addM = mutation$(server$(async ({
  payload,
  request$
}) => {
  const schema = z.object({
    a: z.number(),
    b: z.number()
  });
  await schema.parseAsync(payload);
  const result = payload.a + payload.b;
  console.log(isServer /* true */);
  console.log('add', result);
  console.log(server$.request.headers.get('user-agent'));
  return result;
}), 'add');
export const decrease = query$(server$(async ({
  payload
}) => {
  const result = payload.a - payload.b;
  console.log(isServer);
  console.log('add', result);
  return result;
}), 'decrease');
export const decreaseM = mutation$(server$(async ({
  payload
}) => {
  const result = payload.a - payload.b;
  console.log(isServer);
  console.log('add', result);
  return result;
}), 'decrease');
`

test('transformpRPC$ transformations', () => {
  const output = transform(inputCode.trim(), {
    presets: ['@babel/preset-typescript'],
    plugins: [transformpRPC$],
    filename: 'testing',
  })
  expect(output).not.toBeNull()
  // eslint-disable-next-line
  expect(output!.code).toEqual(transformedCode.trim())
})
