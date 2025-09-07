# Google Maps Setup Guide

This application uses Google Maps to display store locations and provide interactive mapping functionality. Follow these steps to enable maps functionality:

## 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API** (for location search)
   - **Geocoding API** (for address conversion)

## 2. Configure API Key

### Option 1: Environment Variable (Recommended)
Create a `.env.local` file in the project root:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Option 2: Direct Configuration
Edit `src/config/maps.ts` and replace `YOUR_API_KEY_HERE` with your actual API key:

```typescript
export const MAPS_CONFIG = {
  API_KEY: 'your_actual_api_key_here',
  // ... rest of config
};
```

## 3. API Key Security

**Important Security Notes:**
- Never commit your API key to version control
- Add `.env.local` to your `.gitignore` file
- Restrict your API key to specific domains in Google Cloud Console
- Set up billing alerts to monitor usage

## 4. Restrict API Key (Recommended)

In Google Cloud Console:
1. Go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domain(s):
   - `localhost:*` (for development)
   - `yourdomain.com/*` (for production)

## 5. Test the Setup

1. Start the development server: `npm run dev`
2. Navigate to the customer app and click on the "Map" tab
3. You should see the interactive Google Maps with store locations

## Fallback Behavior

If no API key is configured, the application will show a fallback map interface that displays store information in a grid layout. This ensures the app remains functional even without Google Maps.

## Troubleshooting

### Common Issues:

1. **"Maps Not Available" message**
   - Check if your API key is correctly set
   - Verify the API key has the required APIs enabled
   - Check browser console for error messages

2. **"Failed to load Google Maps API"**
   - Verify your internet connection
   - Check if the API key is valid
   - Ensure billing is enabled on your Google Cloud project

3. **Maps load but show no stores**
   - Check if the store data has valid coordinates
   - Verify the map center coordinates are correct

### Browser Console Errors:
- Check the browser's developer console for detailed error messages
- Look for CORS errors or API quota exceeded messages

## Cost Considerations

Google Maps API has usage-based pricing. For development and small applications:
- Maps JavaScript API: $7 per 1,000 loads
- Places API: $17 per 1,000 requests
- Geocoding API: $5 per 1,000 requests

Set up billing alerts to monitor your usage and costs.
