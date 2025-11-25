# API Configuration

## Overview

The frontend automatically switches between local and production API endpoints based on the environment.

## Automatic Configuration

### Development (localhost)
- **API URL**: `http://localhost:3000`
- Automatically used when running `npm run dev`

### Production (deployed)
- **API URL**: `https://backend-lending-earamf6ve-kapils-projects-43e4d3b3.vercel.app`
- Automatically used when building for production (`npm run build`)

## How It Works

The API URL is configured in `nuxt.config.ts` using the `runtimeConfig`:

```typescript
runtimeConfig: {
  public: {
    apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 
      (process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://backend-lending-earamf6ve-kapils-projects-43e4d3b3.vercel.app')
  }
}
```

## Using the API in Components

All API calls should use the `useApi()` composable, which automatically uses the correct base URL:

```typescript
<script setup>
const api = useApi()

// The baseUrl is automatically set based on the environment
console.log(api.baseUrl)

// Use any of the API methods
const data = await api.fetchMCAData(uniqueId)
await api.uploadFiles(files)
const addresses = await api.searchAddress(input)
const details = await api.getAddressDetails(placeId)
await api.submitResponse(formData)
</script>
```

## Environment Variable Override

You can override the API URL for specific environments by setting the `NUXT_PUBLIC_API_BASE_URL` environment variable:

```bash
# .env file
NUXT_PUBLIC_API_BASE_URL=https://custom-api-url.com
```

## Testing

1. **Local Development**: Run `npm run dev` and verify API calls go to `http://localhost:3000`
2. **Production Build**: Run `npm run build` and verify the build uses the Vercel URL
3. **Check the API URL**: Add this to any page temporarily to verify:
   ```vue
   <script setup>
   const config = useRuntimeConfig()
   console.log('API URL:', config.public.apiBaseUrl)
   </script>
   ```
