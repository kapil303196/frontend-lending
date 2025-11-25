# 🚀 Quick Start Guide

Get the Fund Direct verification portal up and running in 3 minutes!

## Prerequisites Check

```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
```

## Step 1: Install Dependencies

```bash
cd frontend-lending
npm install
```

## Step 2: Configure API Endpoint

**Option A: Using environment variable (Recommended)**

Create a `.env` file:
```bash
echo "NUXT_PUBLIC_API_BASE_URL=http://localhost:3000" > .env
```

**Option B: Edit config directly**

Edit `nuxt.config.ts` and update the `apiBaseUrl` value.

## Step 3: Start Development Server

```bash
npm run dev
```

✅ Application will be running at: `http://localhost:8080`

## Step 4: Test the Application

1. **Get a Unique ID** from your backend:
   ```bash
   curl http://localhost:3000/api/mca?limit=1
   ```
   Copy the `uniqueId` value from the response.

2. **Access the verification page**:
   ```
   http://localhost:8080/verify/YOUR-UNIQUE-ID
   ```

3. **Navigate through the form**:
   - Step 1: Business Information
   - Step 2: Business Funding
   - Step 3: Owner Information
   - Step 4: Upload Documents
   - Step 5: Review & Sign

## Common URLs

| URL | Description |
|-----|-------------|
| `http://localhost:8080` | Landing page |
| `http://localhost:8080/verify/:uniqueId` | Verification form |

## Testing Different Screen Sizes

### Mobile View
Open Chrome DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)

### Tablet View
Set viewport to 768px width

### Desktop View
Full browser width

## Next Steps

- ✅ Customize branding (logo, colors)
- ✅ Test all form validations
- ✅ Test file uploads
- ✅ Test signature pad
- ✅ Submit a test application
- ✅ Check backend receives data correctly

## Production Build

When ready for production:

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Troubleshooting

### "Port already in use"
The frontend is configured to run on port 8080 (backend uses port 3000).

### "Cannot connect to API"
1. Check backend is running: `curl http://localhost:3000/health`
2. Verify `.env` file exists with correct URL
3. Check CORS settings in backend

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
rm -rf .nuxt .output
npm run dev
```

## Support

Need help? Contact us at sales@funddirect.us or call (800) 641-2609

---

**That's it! You're ready to go! 🎉**

