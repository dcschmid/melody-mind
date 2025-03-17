import { ui, defaultLang } from "../i18n/ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string, replacements?: Record<string, string>) {
    // Use type assertion to handle any key
    let translation = ui[lang][key as keyof (typeof ui)[typeof lang]] || 
                     ui[defaultLang][key as keyof (typeof ui)[typeof defaultLang]] || 
                     key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(`{${placeholder}}`, value);
      });
    }
    
    return translation;
  };
}
