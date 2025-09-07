import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { googleTranslateService, Language, TranslationResult } from '@/lib/googleTranslate';

interface TranslateContextType {
  isTranslating: boolean;
  translatedTexts: Record<string, string>;
  translateText: (text: string, targetLanguage: string, sourceLanguage?: string) => Promise<string>;
  translateMultipleTexts: (texts: string[], targetLanguage: string, sourceLanguage?: string) => Promise<string[]>;
  clearTranslations: () => void;
  getSupportedLanguages: () => Language[];
  getLanguageByCode: (code: string) => Language | undefined;
}

const TranslateContext = createContext<TranslateContextType | undefined>(undefined);

export const TranslateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});

  const translateText = useCallback(async (
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> => {
    // Check if we already have this translation
    const cacheKey = `${text}-${targetLanguage}-${sourceLanguage || 'auto'}`;
    if (translatedTexts[cacheKey]) {
      return translatedTexts[cacheKey];
    }

    setIsTranslating(true);
    try {
      const result = await googleTranslateService.translateText(text, targetLanguage, sourceLanguage);
      const translatedText = result.translatedText || text;
      
      // Cache the translation
      setTranslatedTexts(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [translatedTexts]);

  const translateMultipleTexts = useCallback(async (
    texts: string[],
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string[]> => {
    setIsTranslating(true);
    try {
      const results = await googleTranslateService.translateMultipleTexts(texts, targetLanguage, sourceLanguage);
      const translatedTexts = results.map(result => result.translatedText || '');
      
      // Cache the translations
      const newTranslations: Record<string, string> = {};
      texts.forEach((text, index) => {
        const cacheKey = `${text}-${targetLanguage}-${sourceLanguage || 'auto'}`;
        newTranslations[cacheKey] = translatedTexts[index];
      });
      
      setTranslatedTexts(prev => ({
        ...prev,
        ...newTranslations
      }));
      
      return translatedTexts;
    } catch (error) {
      console.error('Translation error:', error);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const clearTranslations = useCallback(() => {
    setTranslatedTexts({});
  }, []);

  const getSupportedLanguages = useCallback(() => {
    return googleTranslateService.getSupportedLanguages();
  }, []);

  const getLanguageByCode = useCallback((code: string) => {
    return googleTranslateService.getLanguageByCode(code);
  }, []);

  // Initialize the service
  useEffect(() => {
    googleTranslateService.initialize();
  }, []);

  const value: TranslateContextType = {
    isTranslating,
    translatedTexts,
    translateText,
    translateMultipleTexts,
    clearTranslations,
    getSupportedLanguages,
    getLanguageByCode,
  };

  return (
    <TranslateContext.Provider value={value}>
      {children}
    </TranslateContext.Provider>
  );
};

export const useTranslate = () => {
  const context = useContext(TranslateContext);
  if (context === undefined) {
    throw new Error('useTranslate must be used within a TranslateProvider');
  }
  return context;
};
