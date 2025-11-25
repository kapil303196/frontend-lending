# Fund Direct - Business Loan Verification Portal

A modern, production-ready Nuxt 3 application for business loan application verification with a beautiful multi-step form interface.

## ✨ Features

- **Multi-Step Form**: Intuitive 5-step process for loan application verification
- **Data Pre-population**: Automatically fills form fields from API data
- **Mobile Responsive**: Fully responsive design that works on all devices
- **Beautiful UI/UX**: Modern gradient designs with smooth animations
- **Real-time Validation**: Client-side validation for better UX
- **Signature Pad**: Digital signature capture with touch and mouse support
- **File Upload**: Drag-and-drop bank statement uploads
- **Progress Tracking**: Visual progress indicator throughout the form
- **SSL Secured**: Security-first approach with encrypted data transmission

## 🚀 Tech Stack

- **Framework**: Nuxt 3
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Heroicons (via inline SVG)
- **API**: RESTful API integration

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend-lending folder)

## 🛠️ Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd frontend-lending
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
   ```
   
   Or update the value in `nuxt.config.ts` if you want to hardcode it.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Production Build

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Generate Static Site

```bash
npm run generate
```

## 📁 Project Structure

```
frontend-lending/
├── app/
│   └── app.vue                 # Root component
├── components/
│   ├── MultiStepForm.vue       # Main form component with step navigation
│   └── steps/
│       ├── StepBusinessInfo.vue    # Step 1: Business information
│       ├── StepBusinessFunding.vue # Step 2: Funding details
│       ├── StepOwnerInfo.vue       # Step 3: Owner information
│       ├── StepDocuments.vue       # Step 4: Document uploads
│       └── StepReview.vue          # Step 5: Review & signature
├── composables/
│   └── useApi.ts               # API integration composable
├── pages/
│   ├── index.vue               # Landing page
│   └── verify/
│       └── [uniqueId].vue      # Dynamic verification page
├── types/
│   └── index.ts                # TypeScript type definitions
├── public/                     # Static assets
├── nuxt.config.ts              # Nuxt configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🔗 API Integration

The application integrates with the backend API:

### Endpoints Used

1. **Fetch MCA Data**
   ```
   GET /api/mca/:uniqueId?includeResponses=true
   ```
   Retrieves loan application data to pre-populate the form

2. **Submit Response**
   ```
   POST /api/responses
   ```
   Submits the verified and completed application

### Configuration

Update the API base URL in one of these ways:

1. **Environment Variable** (Recommended for production)
   ```bash
   NUXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
   ```

2. **nuxt.config.ts** (For development)
   ```typescript
   runtimeConfig: {
     public: {
       apiBaseUrl: 'http://localhost:3000'
     }
   }
   ```

## 🎨 Customization

### Colors

The application uses a blue/indigo color scheme. To customize:

1. Update gradient classes in components:
   - `from-blue-600 to-indigo-600`
   - `from-blue-50 to-indigo-50`

2. Or configure Tailwind theme in `nuxt.config.ts`

### Branding

Update branding elements in:
- `pages/verify/[uniqueId].vue` - Header logo and company name
- `pages/index.vue` - Landing page content
- `public/favicon.ico` - Browser icon

## 🔒 Security Features

- SSL/TLS encryption for data transmission
- Password-masked sensitive fields (SSN)
- Secure file upload validation
- CORS configuration for API requests
- Input sanitization and validation

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🧪 Testing the Application

1. **Start the backend API** (in backend-lending folder)
   ```bash
   cd ../backend-lending
   npm start
   ```

2. **Start the frontend** (in this folder)
   ```bash
   npm run dev
   ```

3. **Access a verification link**
   ```
   http://localhost:8080/verify/YOUR-UNIQUE-ID
   ```
   
   Replace `YOUR-UNIQUE-ID` with an actual uniqueId from your MCA collection.

4. **Test the form flow**
   - Verify pre-populated data loads correctly
   - Navigate through all 5 steps
   - Test form validation
   - Upload files (optional)
   - Sign and submit

## 🐛 Troubleshooting

### Port Configuration

The frontend runs on port 8080 to avoid conflict with the backend (port 3000):
```bash
npm run dev
# Runs on http://localhost:8080
```

### API Connection Issues

1. Check backend is running: `http://localhost:3000/health`
2. Verify API base URL in `.env` or `nuxt.config.ts`
3. Check CORS settings in backend

### Build Errors

```bash
# Clear Nuxt cache
rm -rf .nuxt
npm run dev
```

## 📦 Production Deployment

### Option 1: Node.js Server

```bash
npm run build
node .output/server/index.mjs
```

### Option 2: Static Hosting (Netlify, Vercel)

```bash
npm run generate
# Deploy the .output/public directory
```

### Environment Variables for Production

Set these in your hosting platform:
```
NUXT_PUBLIC_API_BASE_URL=https://your-production-api.com
```

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For support, contact:
- Email: sales@funddirect.us
- Phone: (800) 641-2609

---

## 🎯 Key Form Steps

### Step 1: Business Information
- Legal business name, DBA
- Contact information
- Business address
- EIN and start date

### Step 2: Business Funding
- Amount requested
- Monthly revenue
- Existing balances
- Number of owners

### Step 3: Primary Owner Information
- Personal details
- Contact information
- Ownership percentage
- SSN and date of birth

### Step 4: Upload Documents
- Bank statements (up to 3)
- Drag-and-drop support
- PDF, JPG, PNG formats
- 10MB file size limit

### Step 5: Review & Sign
- Review all information
- Digital signature
- Terms and conditions
- Final submission

## 🔄 Development Workflow

1. Make changes to components
2. See live updates (hot reload)
3. Test on different screen sizes
4. Check browser console for errors
5. Test API integration
6. Build and deploy

---

**Built with ❤️ using Nuxt 3 and Tailwind CSS**
