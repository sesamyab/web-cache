function getUrl(requestInfo: RequestInfo): string {
  if (typeof requestInfo === 'string') return requestInfo;
  return requestInfo.url;
}

function getKey(requestInfo: RequestInfo): string {
  const url = getUrl(requestInfo);

  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch (error) {
    return `http://localhost/${url}`;
  }
}

export default class WebCache<T> {
  private cacheName: string;
  private fallbackStorage: Map<string, { value: T; expires: number }>;
  private defaultTTL: number; // TTL in milliseconds

  constructor(cacheName: string, defaultTTL: number = 60000) {
    // Default TTL of 60 seconds
    this.cacheName = cacheName;
    this.defaultTTL = defaultTTL;
    this.fallbackStorage = new Map();
  }

  private async isCacheAPIAvailable(): Promise<boolean> {
    return typeof caches !== 'undefined';
  }

  private setFallbackItem(key: string, value: T, ttl: number): void {
    const expires = Date.now() + ttl;
    this.fallbackStorage.set(key, { value, expires });
  }

  private getFallbackItem(key: string): T | undefined {
    const item = this.fallbackStorage.get(key);
    if (!item) return undefined;
    if (Date.now() > item.expires) {
      this.fallbackStorage.delete(key);
      return undefined;
    }
    return item.value;
  }

  async get(requestInfo: RequestInfo): Promise<T | undefined> {
    const isCacheAvailable = await this.isCacheAPIAvailable();
    if (isCacheAvailable) {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(getKey(requestInfo));
      if (!response) {
        return undefined;
      }

      return response.json();
    } else {
      return this.getFallbackItem(getKey(requestInfo));
    }
  }

  async put(requestInfo: RequestInfo, value: T, options?: { ttl?: number }): Promise<void> {
    const ttl = options?.ttl ?? this.defaultTTL;
    const isCacheAvailable = await this.isCacheAPIAvailable();
    if (isCacheAvailable) {
      const cache = await caches.open(this.cacheName);
      // Create headers to include TTL info
      const headers = new Headers({ 'Cache-Control': `max-age=${ttl / 1000}` });
      const response = new Response(JSON.stringify(value), { headers });
      const key = getKey(requestInfo);
      await cache.put(key, response);
    } else {
      this.setFallbackItem(getKey(requestInfo), value, ttl);
    }
  }

  async delete(requestInfo: RequestInfo): Promise<boolean> {
    const isCacheAvailable = await this.isCacheAPIAvailable();
    if (isCacheAvailable) {
      const cache = await caches.open(this.cacheName);
      return cache.delete(getKey(requestInfo));
    } else {
      return this.fallbackStorage.delete(getKey(requestInfo));
    }
  }
}
