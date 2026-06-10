import { collections } from '../database/collections'

export interface Favicon {
  contentType: string
  body: Buffer
}

const successTtl = 60 * 60 * 1000 // 1 hour
const failureTtl = 60 * 1000 // retry failed fetches sooner

const cache = new Map<string, { favicon: Favicon | null; fetchedAt: number }>()

/**
 * Fetches the favicon of a registered instance, so it can be served same-origin.
 * Instances send cross-origin-resource-policy: same-origin, which makes browsers
 * refuse to embed their favicons directly.
 */
export async function getFavicon(url: string): Promise<Favicon | null> {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.fetchedAt < (cached.favicon ? successTtl : failureTtl)) {
    return cached.favicon
  }

  const instance = await collections.instances.findOne({ url })
  if (!instance) {
    return null
  }

  const favicon = await fetchFavicon(url)
  cache.set(url, { favicon, fetchedAt: Date.now() })
  return favicon
}

async function fetchFavicon(url: string): Promise<Favicon | null> {
  try {
    const response = await fetch(new URL('/favicon.ico', url), {
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      return null
    }

    return {
      contentType: response.headers.get('content-type') ?? 'image/x-icon',
      body: Buffer.from(await response.arrayBuffer()),
    }
  } catch {
    return null
  }
}
