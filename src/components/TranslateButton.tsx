import React, { useState, useRef, useEffect } from 'react';
import { Languages, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslate } from '@/contexts/TranslateContext';
import { Language } from '@/lib/googleTranslate';

interface TranslateButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const TranslateButton: React.FC<TranslateButtonProps> = ({ 
  className = '', 
  variant = 'outline', 
  size = 'sm' 
}) => {
  const { 
    isTranslating, 
    translateText, 
    getSupportedLanguages, 
    getLanguageByCode 
  } = useTranslate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [translationStatus, setTranslationStatus] = useState<'idle' | 'translating' | 'success' | 'error'>('idle');
  const [translatedElements, setTranslatedElements] = useState<Set<HTMLElement>>(new Set());
  
  const supportedLanguages = getSupportedLanguages();
  const filteredLanguages = supportedLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const translatePage = async () => {
    if (isTranslating) return;
    
    setTranslationStatus('translating');
    
    try {
      // Get all text elements on the page
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, label, li, td, th, input[placeholder], textarea[placeholder]');
      
      const elementsToTranslate: { element: HTMLElement; originalText: string }[] = [];
      
      textElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const text = htmlElement.textContent?.trim();
        
        // Skip if element is empty, already translated, or contains only numbers/symbols
        if (!text || 
            translatedElements.has(htmlElement) || 
            /^[\d\s\-\+\(\)\[\]{}.,;:!?@#$%^&*=_|\\/<>~`"']+$/.test(text) ||
            text.length < 2) {
          return;
        }
        
        elementsToTranslate.push({ element: htmlElement, originalText: text });
      });

      // Translate elements in batches
      const batchSize = 10;
      for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
        const batch = elementsToTranslate.slice(i, i + batchSize);
        const texts = batch.map(item => item.originalText);
        
        const translations = await Promise.all(
          texts.map(text => translateText(text, selectedLanguage))
        );
        
        // Apply translations
        batch.forEach((item, index) => {
          const translatedText = translations[index];
          if (translatedText && translatedText !== item.originalText) {
            item.element.textContent = translatedText;
            setTranslatedElements(prev => new Set([...prev, item.element]));
          }
        });
        
        // Small delay between batches to avoid overwhelming the API
        if (i + batchSize < elementsToTranslate.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      setTranslationStatus('success');
      setTimeout(() => setTranslationStatus('idle'), 2000);
      
    } catch (error) {
      console.error('Page translation error:', error);
      setTranslationStatus('error');
      setTimeout(() => setTranslationStatus('idle'), 2000);
    }
  };

  const resetTranslation = () => {
    // Reload the page to reset all translations
    window.location.reload();
  };

  const getStatusIcon = () => {
    switch (translationStatus) {
      case 'translating':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Languages className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (translationStatus) {
      case 'translating':
        return 'Translating...';
      case 'success':
        return 'Translated!';
      case 'error':
        return 'Error';
      default:
        return 'Translate';
    }
  };

  const selectedLang = getLanguageByCode(selectedLanguage);

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            className={`gap-2 ${className}`}
            disabled={isTranslating}
          >
            {getStatusIcon()}
            <span className="hidden sm:inline">{getStatusText()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-hidden">
          <div className="p-3 border-b">
            <h3 className="font-semibold text-sm mb-2">Translate Page</h3>
            <Input
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {filteredLanguages.slice(0, 50).map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`flex items-center gap-3 cursor-pointer ${
                  selectedLanguage === lang.code ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <span className="text-sm font-medium">{lang.nativeName}</span>
                <span className="text-xs text-gray-500">{lang.name}</span>
                {selectedLanguage === lang.code && (
                  <Check className="w-4 h-4 ml-auto text-blue-600" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
          
          <div className="p-3 border-t bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {selectedLang?.nativeName || selectedLang?.name || 'English'}
              </Badge>
              {translatedElements.size > 0 && (
                <Badge variant="outline" className="text-xs">
                  {translatedElements.size} elements
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={translatePage}
                disabled={isTranslating || translationStatus === 'translating'}
                size="sm"
                className="flex-1"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Translating...
                  </>
                ) : (
                  'Translate Page'
                )}
              </Button>
              
              {translatedElements.size > 0 && (
                <Button
                  onClick={resetTranslation}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TranslateButton;
