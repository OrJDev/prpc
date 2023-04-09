export const SITE = {
  title: 'pRPC',
  description: 'pRPC documentation and examples',
  defaultLanguage: 'en-us',
} as const

// export const OPEN_GRAPH = {
//   image: {
//     src: 'https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true',
//     alt:
//       'astro logo on a starry expanse of space,' +
//       ' with a purple saturn-like planet floating in the right foreground',
//   },
//   twitter: 'astrodotbuild',
// }

export const KNOWN_LANGUAGES = {
  English: 'en',
} as const
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES)

export const GITHUB_EDIT_URL = `https://github.com/OrJDev/prpc/tree/main/docs`

export const COMMUNITY_INVITE_URL = `https://github.com/OrJDev/prpc`

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'XXXXXXXXXX',
  appId: 'XXXXXXXXXX',
  apiKey: 'XXXXXXXXXX',
}

export type Sidebar = Record<string, { text: string; link: string }[]>

export const SIDEBAR: Sidebar = {
  Overview: [
    { text: 'Introduction', link: 'introduction' },
    { text: 'Install', link: 'install' },
    { text: 'Examples', link: 'examples' },
  ],
  '@prpc/solid': [
    { text: 'Install', link: 'solid/install' },
    { text: 'query$', link: 'solid/query' },
    { text: 'mutation$', link: 'solid/mutation' },
    { text: 'reuseable$', link: 'solid/reuseable' },
    {
      text: 'QueryProvider',
      link: 'solid/query-provider',
    },
  ],
  '@prpc/react-bling': [
    { text: 'Install', link: 'react/install' },
    { text: 'query$', link: 'react/query' },
    { text: 'mutation$', link: 'react/mutation' },
  ],
  API: [
    { text: 'middleware$', link: 'middleware' },
    { text: 'pipe$', link: 'pipe' },
    {
      text: 'response$',
      link: 'response',
    },
    {
      text: 'error$',
      link: 'error',
    },
    {
      text: 'PRPCClientError',
      link: 'prpc-client-error',
    },
    {
      text: 'hideRequest',
      link: 'hideRequest',
    },
  ],
  References: [
    { text: 'Contributors', link: 'contributors' },
    { text: 'Sponsors', link: 'sponsors' },
  ],
}
