# Google Translate Integration Setup

This project now includes Google Translate functionality that allows users to translate any page content to multiple languages.

## Features

- **Real-time Translation**: Translate any page content instantly
- **100+ Languages**: Support for over 100 languages including major Indian languages
- **Smart Translation**: Automatically detects and translates text elements
- **Fallback Support**: Works even without API key using basic translations
- **Caching**: Translated content is cached for better performance
- **Batch Processing**: Efficiently translates multiple elements at once

## Setup Instructions

### 1. Get Google Translate API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Translation API
4. Go to "Credentials" and create an API key
5. Restrict the API key to only the Translation API for security

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
```

### 3. Install Dependencies

The required dependencies are already installed:

```bash
npm install @google-cloud/translate
```

## Usage

### For Users

1. Click the "Translate" button in the navigation bar
2. Select your desired language from the dropdown
3. Click "Translate Page" to translate all visible content
4. Use "Reset" to restore original content

### For Developers

The translation system includes:

- `TranslateButton` component for UI
- `TranslateProvider` context for state management
- `googleTranslateService` for API calls
- Fallback translations for common words

## Supported Languages

The system supports 100+ languages including:

- **Indian Languages**: Hindi, Tamil, Kannada, Malayalam, Telugu, Bengali, Gujarati, Marathi, Punjabi, Urdu
- **International**: English, Chinese, Japanese, Korean, French, German, Spanish, Italian, Portuguese, Russian, Arabic, and many more

## API Costs

Google Translate API pricing (as of 2024):
- First 500,000 characters per month: Free
- Additional characters: $20 per 1M characters

## Fallback Mode

If no API key is provided, the system will:
- Use basic fallback translations for common words
- Display original text for untranslated content
- Show a warning in the console

## Security Notes

- Never commit API keys to version control
- Use environment variables for API keys
- Consider using a backend proxy for production to keep keys secure
- Implement rate limiting for production use

## Troubleshooting

### Translation not working
- Check if API key is correctly set
- Verify the Translation API is enabled in Google Cloud Console
- Check browser console for error messages

### Slow translations
- The system processes elements in batches to avoid API limits
- Large pages may take longer to translate
- Consider implementing lazy loading for better performance

### API quota exceeded
- Check your Google Cloud billing
- Implement caching to reduce API calls
- Consider using fallback translations for common content
