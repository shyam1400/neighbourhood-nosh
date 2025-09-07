// Google Translate API service
// Note: This is a client-side implementation using Google Translate API
// For production, you should use a backend service to keep API keys secure

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Supported languages for translation
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
];

class GoogleTranslateService {
  private apiKey: string | null = null;
  private isInitialized = false;

  constructor() {
    // In a real application, you would get this from environment variables
    // For demo purposes, we'll use a placeholder
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || null;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    if (!this.apiKey) {
      console.warn('Google Translate API key not found. Using fallback translation.');
      return false;
    }

    this.isInitialized = true;
    return true;
  }

  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // If no API key, return the original text
    if (!this.apiKey) {
      return { translatedText: text };
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
            source: sourceLanguage || 'auto',
            format: 'text',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translation = data.data.translations[0];

      return {
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage,
      };
    } catch (error) {
      console.error('Translation error:', error);
      // Return original text if translation fails
      return { translatedText: text };
    }
  }

  async translateMultipleTexts(
    texts: string[],
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.apiKey) {
      return texts.map(text => ({ translatedText: text }));
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: texts,
            target: targetLanguage,
            source: sourceLanguage || 'auto',
            format: 'text',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations.map((translation: any) => ({
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage,
      }));
    } catch (error) {
      console.error('Translation error:', error);
      return texts.map(text => ({ translatedText: text }));
    }
  }

  getSupportedLanguages(): Language[] {
    return SUPPORTED_LANGUAGES;
  }

  getLanguageByCode(code: string): Language | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }

  // Fallback translation using a simple mapping for common words
  // This is used when the API is not available
  getFallbackTranslation(text: string, targetLanguage: string): string {
    const fallbackTranslations: Record<string, Record<string, string>> = {
      'hi': {
        'Home': 'होम',
        'Shop': 'शॉप',
        'Cart': 'कार्ट',
        'Profile': 'प्रोफाइल',
        'Language': 'भाषा',
        'Add to Cart': 'कार्ट में जोड़ें',
        'Checkout': 'चेकआउट',
        'Price': 'कीमत',
        'Total': 'कुल',
        'Continue': 'जारी रखें',
        'Cancel': 'रद्द करें',
        'Save': 'सेव करें',
        'Edit': 'संपादित करें',
        'Delete': 'हटाएं',
        'View': 'देखें',
        'Close': 'बंद करें',
        'Back': 'वापस',
        'Next': 'अगला',
        'Previous': 'पिछला',
        'Search': 'खोजें',
        'Filter': 'फिल्टर',
        'Sort': 'सॉर्ट',
        'All': 'सभी',
        'Yes': 'हां',
        'No': 'नहीं',
        'OK': 'ठीक है',
      },
      'ta': {
        'Home': 'முகப்பு',
        'Shop': 'கடை',
        'Cart': 'கார்ட்',
        'Profile': 'சுயவிவரம்',
        'Language': 'மொழி',
        'Add to Cart': 'கார்ட்டில் சேர்',
        'Checkout': 'செக்அவுட்',
        'Price': 'விலை',
        'Total': 'மொத்தம்',
        'Continue': 'தொடர',
        'Cancel': 'ரத்து',
        'Save': 'சேமி',
        'Edit': 'திருத்து',
        'Delete': 'நீக்கு',
        'View': 'பார்',
        'Close': 'மூடு',
        'Back': 'பின்',
        'Next': 'அடுத்து',
        'Previous': 'முந்தைய',
        'Search': 'தேடு',
        'Filter': 'வடிகட்டு',
        'Sort': 'வரிசைப்படுத்து',
        'All': 'அனைத்தும்',
        'Yes': 'ஆம்',
        'No': 'இல்லை',
        'OK': 'சரி',
      },
      'kn': {
        'Home': 'ಮುಖಪುಟ',
        'Shop': 'ಅಂಗಡಿ',
        'Cart': 'ಕಾರ್ಟ್',
        'Profile': 'ಪ್ರೊಫೈಲ್',
        'Language': 'ಭಾಷೆ',
        'Add to Cart': 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
        'Checkout': 'ಚೆಕ್‌ಔಟ್',
        'Price': 'ಬೆಲೆ',
        'Total': 'ಒಟ್ಟು',
        'Continue': 'ಮುಂದುವರಿಸಿ',
        'Cancel': 'ರದ್ದುಗೊಳಿಸಿ',
        'Save': 'ಉಳಿಸಿ',
        'Edit': 'ಸಂಪಾದಿಸಿ',
        'Delete': 'ಅಳಿಸಿ',
        'View': 'ನೋಡಿ',
        'Close': 'ಮುಚ್ಚಿ',
        'Back': 'ಹಿಂದೆ',
        'Next': 'ಮುಂದೆ',
        'Previous': 'ಹಿಂದಿನ',
        'Search': 'ಹುಡುಕಿ',
        'Filter': 'ಫಿಲ್ಟರ್',
        'Sort': 'ವಿಂಗಡಿಸಿ',
        'All': 'ಎಲ್ಲಾ',
        'Yes': 'ಹೌದು',
        'No': 'ಇಲ್ಲ',
        'OK': 'ಸರಿ',
      },
      'ml': {
        'Home': 'ഹോം',
        'Shop': 'ഷോപ്പ്',
        'Cart': 'കാർട്ട്',
        'Profile': 'പ്രൊഫൈൽ',
        'Language': 'ഭാഷ',
        'Add to Cart': 'കാർട്ടിലേക്ക് ചേർക്കുക',
        'Checkout': 'ചെക്ക്‌ഔട്ട്',
        'Price': 'വില',
        'Total': 'മൊത്തം',
        'Continue': 'തുടരുക',
        'Cancel': 'റദ്ദാക്കുക',
        'Save': 'സേവ് ചെയ്യുക',
        'Edit': 'എഡിറ്റ് ചെയ്യുക',
        'Delete': 'ഇല്ലാതാക്കുക',
        'View': 'കാണുക',
        'Close': 'അടയ്ക്കുക',
        'Back': 'പിന്നോട്ട്',
        'Next': 'അടുത്തത്',
        'Previous': 'മുമ്പത്തെ',
        'Search': 'തിരയുക',
        'Filter': 'ഫിൽട്ടർ',
        'Sort': 'സോർട്ട്',
        'All': 'എല്ലാം',
        'Yes': 'അതെ',
        'No': 'ഇല്ല',
        'OK': 'ശരി',
      },
    };

    const translations = fallbackTranslations[targetLanguage];
    if (translations && translations[text]) {
      return translations[text];
    }
    return text;
  }
}

// Export a singleton instance
export const googleTranslateService = new GoogleTranslateService();
export default googleTranslateService;
