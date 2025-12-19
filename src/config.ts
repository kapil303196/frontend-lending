export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.DEV ? 'https://backend-lending.vercel.app' : 'https://backend-lending.vercel.app'),
  apiUrl: import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? 'https://backend-lending.vercel.app/api' : 'https://backend-lending.vercel.app/api')
}

