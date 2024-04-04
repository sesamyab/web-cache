# @sesamy/web-cache

Efficiently cache HTTP requests in your web applications with `@sesamy/web-cache`, a TypeScript-based caching solution that leverages the Cache API with a fallback to in-memory storage for environments where the Cache API is not available. Designed for simplicity and effectiveness, `@sesamy/web-cache` provides a seamless caching mechanism with automatic fallback, ensuring your application remains fast and responsive, even offline.

## Features

- **Cache API Integration**: Utilizes the modern Cache API for efficient, network-aware caching.
- **Automatic Fallback**: In environments where the Cache API is not available, falls back to an in-memory storage solution.
- **Customizable TTL**: Set a default time-to-live (TTL) for cached items, with the option to customize TTL on a per-item basis.
- **Simplicity**: Offers a simple and intuitive API, making caching easy to integrate into your project.

## Installation

```sh
npm install @sesamy/web-cache
```

Or using Yarn:

```sh
yarn add @sesamy/web-cache
```

## Quick Start

### Importing the Package

First, import `WebCache` from the package:

```typescript
import WebCache from '@sesamy/web-cache';
```

### Creating an Instance

Create an instance of `WebCache`, specifying a cache name and optionally a default TTL (in milliseconds):

```typescript
const myCache = new WebCache<any>('myCacheName', 60000); // Default TTL of 60 seconds
```

### Caching Requests

Use the `put` method to cache your data:

```typescript
const myData = { hello: 'world' };
const requestInfo = 'https://api.example.com/data';

await myCache.put(requestInfo, myData, { ttl: 120000 }); // Custom TTL of 120 seconds
```

### Retrieving Cached Data

Retrieve your data with the `get` method:

```typescript
const cachedData = await myCache.get(requestInfo);
if (cachedData) {
  console.log('Retrieved from cache:', cachedData);
} else {
  console.log('Data not in cache');
}
```

### Deleting Cached Data

Delete cached data using the `delete` method:

```typescript
const isDeleted = await myCache.delete(requestInfo);
console.log('Deleted:', isDeleted);
```

## API Documentation

- **constructor(cacheName: string, defaultTTL?: number)**: Initializes a new instance of `WebCache`.
- **async get(requestInfo: RequestInfo): Promise<T | undefined>**: Retrieves cached data.
- **async put(requestInfo: RequestInfo, value: T, options?: { ttl?: number }): Promise<void>**: Caches data.
- **async delete(requestInfo: RequestInfo): Promise<boolean>**: Deletes cached data.

`RequestInfo` can be a URL string or a `Request` object.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements or suggestions.

## License

This project is licensed under the [MIT License](LICENSE.md). Feel free to use and modify the code as you wish.
