/**
 * Validation script for Layout.astro i18n implementation
 * This script checks if all layout-specific translation keys work correctly
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import the translation data dynamically
async function loadTranslations() {
  const results = {};
  const localesDir = join(__dirname, 'src/i18n/locales');
  const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.ts'));
  
  for (const file of files) {
    const lang = file.replace('.ts', '');
    try {
      const module = await import(`./src/i18n/locales/${file}`);
      results[lang] = module.default;
    } catch (error) {
      console.error(`Error loading ${lang} translations:`, error);
    }
  }
  
  return results;
}

// Required layout translation keys
const layoutKeys = [
  'layout.error.system',
  'layout.error.tracking',
  'layout.error.tracking.failed',
  'layout.accessibility.motion.reduced',
  'layout.accessibility.theme.dark',
  'layout.analytics.init.failed'
];

// Validate translation keys
function validateLayoutTranslations(translations) {
  console.log('🔍 Validating Layout.astro i18n implementation...\n');
  
  let allValid = true;
  
  for (const [lang, langTranslations] of Object.entries(translations)) {
    console.log(`📝 Checking ${lang.toUpperCase()} translations:`);
    
    let langValid = true;
    for (const key of layoutKeys) {
      const hasTranslation = key in langTranslations;
      const translationValue = langTranslations[key];
      
      if (!hasTranslation) {
        console.log(`  ❌ Missing key: ${key}`);
        langValid = false;
      } else if (!translationValue || translationValue.trim() === '') {
        console.log(`  ❌ Empty translation: ${key}`);
        langValid = false;
      } else {
        console.log(`  ✅ ${key}: "${translationValue}"`);
      }
    }
    
    if (langValid) {
      console.log(`  ✅ All layout translations present for ${lang}\n`);
    } else {
      console.log(`  ❌ Missing translations found for ${lang}\n`);
      allValid = false;
    }
  }
  
  return allValid;
}

// Test the useTranslations function simulation
function testTranslationFunction(translations) {
  console.log('🧪 Testing translation function simulation...\n');
  
  // Simulate the useTranslations function
  function useTranslations(lang) {
    return function t(key, vars = {}) {
      const langTranslations = translations[lang] || {};
      const defaultTranslations = translations['en'] || {};
      
      let text = langTranslations[key] || defaultTranslations[key] || key;
      
      // Replace variables
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), v.toString());
      });
      
      return text;
    };
  }
  
  // Test clientTranslations object creation for each language
  for (const lang of Object.keys(translations)) {
    console.log(`🔧 Testing clientTranslations for ${lang}:`);
    const t = useTranslations(lang);
    
    const clientTranslations = {
      systemError: t("layout.error.system"),
      errorTracking: t("layout.error.tracking"),
      errorTrackingFailed: t("layout.error.tracking.failed"),
      motionReduced: t("layout.accessibility.motion.reduced"),
      darkTheme: t("layout.accessibility.theme.dark"),
      analyticsInitFailed: t("layout.analytics.init.failed"),
    };
    
    console.log(`  ✅ systemError: "${clientTranslations.systemError}"`);
    console.log(`  ✅ errorTracking: "${clientTranslations.errorTracking}"`);
    console.log(`  ✅ errorTrackingFailed: "${clientTranslations.errorTrackingFailed}"`);
    console.log(`  ✅ motionReduced: "${clientTranslations.motionReduced}"`);
    console.log(`  ✅ darkTheme: "${clientTranslations.darkTheme}"`);
    console.log(`  ✅ analyticsInitFailed: "${clientTranslations.analyticsInitFailed}"`);
    console.log('');
  }
}

// Main validation
async function main() {
  try {
    console.log('🚀 Starting Layout.astro i18n validation...\n');
    
    const translations = await loadTranslations();
    const languageCount = Object.keys(translations).length;
    
    console.log(`📊 Loaded translations for ${languageCount} languages: ${Object.keys(translations).join(', ')}\n`);
    
    const isValid = validateLayoutTranslations(translations);
    testTranslationFunction(translations);
    
    if (isValid) {
      console.log('🎉 All Layout.astro i18n validations passed successfully!');
      console.log('✅ The layout component is ready for multilingual use.');
    } else {
      console.log('❌ Some layout translation validations failed.');
      console.log('⚠️  Please check the missing translations above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Validation failed with error:', error);
    process.exit(1);
  }
}

main();
