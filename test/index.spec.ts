import { describe, expect, it, beforeEach } from 'vitest';
import WebCache from '../src';

describe('WebCache', () => {
  const testKey = 'testKey';
  const testValue = { data: 'testData' };
  const defaultTTL = 1000; // 1 second for testing

  let cacheWrapper: WebCache<typeof testValue>;

  beforeEach(() => {
    cacheWrapper = new WebCache<typeof testValue>('testCache', defaultTTL);
  });

  it('should put and get a value', async () => {
    await cacheWrapper.put(testKey, testValue);
    const value = await cacheWrapper.get(testKey);
    expect(value).toEqual(testValue);
  });

  it('should respect TTL and return undefined for expired items', async () => {
    await cacheWrapper.put(testKey, testValue, { ttl: 100 }); // Set a short TTL

    await new Promise(resolve => setTimeout(resolve, 150)); // Wait longer than the TTL

    const value = await cacheWrapper.get(testKey);
    expect(value).toBeUndefined();
  });

  it('should delete a value', async () => {
    await cacheWrapper.put(testKey, testValue);
    let value = await cacheWrapper.get(testKey);
    expect(value).toEqual(testValue);
    await cacheWrapper.delete(testKey);
    value = await cacheWrapper.get(testKey);
    expect(value).toBeUndefined();
  });
});
